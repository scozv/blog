---
layout: post
title: "使用自定义Akka Dispatcher和Mapped Diagnostic Contexts为Play中的日志增加Tracking Id"
description: ""
category: "pattern"
tags: ["scala", "akka", "trackingId", "resourceId", "mdc", "play", "play2.6", "go", "golang"]
lang: "zh"
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> Yann Simon在2014的文章[^_blog_yanns_mdc_play]中总结了两种向Mapped Diagnostic Contexts（MDC）
> 增加全局变量的编程方式，利用MDC的全局变量，可以在日志中记录每一个HTTP Request的Tracking Id。
>
> 本文首先对Tracking Id和Yann Simon的两种方式做简要介绍，并描述实践过程
> 中遇到的问题。其中一个主要的问题是，
> 部分日志没有Tracking Id（同样的问题在Github上也被提到 [^_github_rishabh9_issue1]）。
> 本文通过在日志中输出了线程信息和Dispatcher的名称，发现`scala.concurrent.ExecutionContext`
> 下的所有日志，都没有Tracking Id，最终通过替换该`ExecutionContext`的方式
> 解决了日志中无Tracking Id的问题。

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# 背景介绍

软件工程中，比争论不同编程语言孰优孰劣更重要的是，在系统层面使用高效
的交付方式，建立完善系统监控机制。如果说Git工作流、测试或者覆盖率等是
可持续交付的基本保障，那么诸如日志、健康检查或者运行时度量（Metric）便是
系统监控的基础。

软件交付之后，难免会遇上运行时错误，快速地定位并处理问题是保证
系统可靠的一个因素。在定位线上问题的时候，
常见的做法是查看日志，Tracking Id是日志信息中针对不同的HTTP Request
分别生成的唯一编号，用来追踪每一个请求在系统中经历的不同节点。

## Tracking Id的重要性

目前的系统，通常需要应对大量的请求、而且系统的部署节点可能分布在不同的物理位置。
简单的`tail -f application.log`命令无法跟踪系统的运行状态。

同时，由于多线程的执行对不同请求而言不是线性的，所以不同请求的日志信息
会随机写入到日志文件中。在日志中使用Tracking Id，能够重组不同的请求
的运行时状态。比较如下两份日志文件：

{% highlight bash %}

[2017-07-17T19:06:55.560Z] [DEBUG] user 1 connected
[2017-07-17T19:06:57.121Z] [DEBUG] get token from redis
[2017-07-17T19:07:03.289Z] [DEBUG] start the query with parameter {...}
[2017-07-17T19:07:03.981Z] [DEBUG] user 2 connected
[2017-07-17T19:07:05.192Z] [WARN] get result with 1029ms
[2017-07-17T19:07:05.207Z] [DEBUG] get token from redis
[2017-07-17T19:07:05.285Z] [ERROR] invalid token

{% endhighlight %}


{% highlight bash %}

[2017-07-17T19:06:55.560Z] [tracking-id-0001] [DEBUG] user 1 connected
[2017-07-17T19:06:57.121Z] [tracking-id-0001] [DEBUG] get token from redis
[2017-07-17T19:07:03.289Z] [tracking-id-0001] [DEBUG] start the query with parameter {...}
[2017-07-17T19:07:03.981Z] [tracking-id-1024] [DEBUG] user 2 connected
[2017-07-17T19:07:05.192Z] [tracking-id-0001] [WARN] get result with 1029ms
[2017-07-17T19:07:05.207Z] [tracking-id-1024] [DEBUG] get token from redis
[2017-07-17T19:07:05.285Z] [tracking-id-1024] [ERROR] invalid token

{% endhighlight %}

可以看到，第二份日志清晰地记录了两个请求，而且两个请求在系统中的流转过程可以通过`trackingId`
完整地串联起来。

## Tracking Id的方案设计

一个完整的Tracking Id方案最好能形成一个闭环，从客户端的发起、到网络中的
反向代理（Nginx日志），传递到服务端进行后台处理，包括返回的最终结果，每一个节点都能记录
唯一的`trackingId`。在这种方案中，通常由客户端生成`trackingId`，传递给系统
的其它节点使用，并最终送回给客户端。

本文简化了这个流程，并在Play 2.6下实现了服务端的`trackingId`生成：

0. 服务端接收到请求（HTTP Request）；
0. 利用`HttpFilter`为每一个请求赋予一个唯一`trackingId`；
0. 尝试将`trackingId`写入相关的日志中；
0. 同样在`HttpFilter`中，将`trackingId`写入最后的HTTP Response中；
0. 客户端接收到带有`trackingId`的返回结果。

Yann Simon给出的方案就是为了将`trackingId`写入
Mapped Diagnostic Contexts中，从而可以使用如下的Pattern记录带有
`trackingId`的日志：

{% highlight xml %}
<appender name="FILE" class="ch.qos.logback.core.FileAppender">
  <file>${application.home:-.}/logs/application.log</file>
  <encoder>
    <pattern>%date [%level] [%mdc{trackingId:--}] %message%n%xException</pattern>
  </encoder>
</appender>
{% endhighlight %}

# Tracking Id的实现

## Golang下的一种实现方式

使用Golang下的`cihub/seelog`，会发现`seelog`中并不支持带有
`%mdc`的日志格式（Pattern）[^_github_cihub_seelog_format_ref]。
David Budworth指出“Java下MDC所依赖的线程存储（Thread Local Storage），
在Go中并不存在 [^_sf_david_bud_mdc_java_go]”。

尽管如此，可以利用`Context`传递`trackingId`。
一方面，在`gin.Context`的基础上新建一个对象 [^_note_where_go_code_from]：

{% highlight go %}
type RequestContext struct {
  *gin.Context

  TrackingId        string
}

func newContext(c *gin.Context) *RequestContext {
  return &RequestContext{
    Context:    c,
    TrackingId: GenGuid(),
  }
}
{% endhighlight %}

另一方面，在需要记录日志的地方，将`RequestContext`对象传递到
日志相关的方法中:

{% highlight go %}
func fooAction(c *gin.Context) {
  var err error

  ctx := getRequestContext(c)

  // ..., err =

  logger.Errorf(buildLogMessage(ctx, "Failed in fooAction: $v", err))
}
{% endhighlight %}

上述代码中，`getRequestContext`用于获取（`val.(*RequestContext)`）
或者新建一个`RequestContext`（对应`newContext`）。日志记录时，通过获取到的
`RequestContext`创建带有`trackingId`的消息体，并记录到日志中。

这样，Golang虽然不能通过MDC的方式（`%mdc{trackingId}`）将`trackingId`写入日志，
但在创建日志消息体的时候，可将`trackingId`附在消息体的最后。唯一的限制条件就是，
日志的Pattern需设计成：

{% highlight xml %}
<appender name="FILE" class="ch.qos.logback.core.FileAppender">
  <file>${application.home:-.}/logs/application.log</file>
  <encoder>
    <pattern>%date [%level] %message%n%xException</pattern>
  </encoder>
</appender>
{% endhighlight %}

这样，无论是通过Java的MDC还是消息体中直接带上 `trackingId`。
都能保证最后的日志格式一致：

{% highlight xml %}

// with MDC
%date [%level] [%mdc{trackingId:--}] %message%n%xException

// in Golang
%date [%level] %message%n%xException

func buildLogMessage(ctx *RequestContext, format string, parms ...interface{}) string {
  // [trackingId] msg
  f := fmt.Sprintf("[%s] ", ctx.TrackingId) + format
  return fmt.Sprintf(f, parms...)
}
{% endhighlight %}

## 基于HttpFilter和Dispatcher的实现

Yann Simon指出，Play框架会使用不同的线程（Thread）处理同一个HTTP Request。
而Logback中MDC采用的`ThreadLocal`变量，只在单线程中有效[^_blog_yanns_mdc_play]。
因此，为了给每一个HTTP Request赋予唯一的Tracking Id，
并写入不同线程中的日志中，需要完成为Request生成编号、将编号写入日志两个步骤。

在Play框架下，可以使用`HttpFilter`对每一个HTTP Request做一次“过滤”
的操作，自定义的`HttpFilter`一来为请求生成一个编号，二来在后台服务结束之后，将编号
写入HTTP Response的Header中。当客户端收到异常的时候，可以告知服务端Tracking Id，
用于查找相关的日志消息。主要的代码如下所示：

{% highlight scala %}
class TrackingFilter @Inject() (
  implicit ec: ExecutionContext
) extends EssentialFilter {
  def apply(action: EssentialAction) = new EssentialAction {
    def apply(requestHeader: RequestHeader): Accumulator[ByteString, Result] = {
      val trackingId = UUID.randomUUID().toString
      MDC.put("trackingId", trackingId)

      action(requestHeader)
        .map { _.withHeaders("X-Tracking-Id" -> trackingId) }
        .map { result =>
          MDC.remove("trackingId")
          result
        }
    }
  }
}
{% endhighlight %}

`HttpFilter`所生成的`trackingId`还需要传递到不同的线程中，并写入各个线程中的MDC里面，
也就是将MDC中的信息从一个线程传递到另外一个线程中。
使用Yann Simon文中总结的两种方法——自定义Akka Dispatcher和ExecutionContext，可以
在非阻塞的Play框架中实现这个功能。

本文选用了自定义Akka Dispatcher的方式，关键的代码如下所示，
需要注意的是，代码中线程的切换发生在`self.execute(() => {})`里：

{% highlight scala %}
def execute(runnable: Runnable): Unit = self.execute(() => {
  val oldMDCContext = MDC.getCopyOfContextMap

  setContextMap(mdcContext)
  try {
    runnable.run()
  } finally {
    setContextMap(oldMDCContext)
  }
})
{% endhighlight %}

## 实践过程中的建议

相关实现的代码量并不大，并且自定义Akka Dispatcher的代码量相较第二种
方法，代码量更少。

使用Play 2.6的话，需要保持代码的可注入特性。`HttpFilter`


# 解决Tracking Id未能添加到日志消息的问题

## 问题表述

## 解决思路和问题定位

## 停用Scala自带ExecutionContext

## 解决过程总结

# 本文总结

# 参考文献

[^_blog_yanns_mdc_play]: [SLF4J Mapped Diagnostic Context (MDC) With Play Framework](http://yanns.github.io/blog/2014/05/04/slf4j-mapped-diagnostic-context-mdc-with-play-framework/) by Yann Simon, 2014

[^_github_rishabh9_issue1]: [`TrackingId` not printed as description in issue #1 of rishabh9/mdc-propagation-dispatcher](https://github.com/rishabh9/mdc-propagation-dispatcher/issues/1)
[^_github_cihub_seelog_format_ref]: [Format Reference of cihub/seelog](https://github.com/cihub/seelog/wiki/Format-reference/7eb0ebc6df74a6386165d9b4687445c6b86bac97)

[^_sf_david_bud_mdc_java_go]: [_"Java MDC relies on thread local storage, Go does not have"_ by David Budworth's reply on Stackoverflow](https://stackoverflow.com/a/41049394)

[^_note_where_go_code_from]: 这段代码中的`RequestContext`来自沪江工作期间，原同事的Golang代码，我在其基础上增加了`TrackingId`变量，并完成了日志中写入`TrackingId`的代码
