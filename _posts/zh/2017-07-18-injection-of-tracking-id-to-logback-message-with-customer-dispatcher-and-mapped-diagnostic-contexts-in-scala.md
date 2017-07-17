---
layout: post
title: "使用自定义的Akka Dispatcher和Mapped Diagnostic Contexts为Scala下日志信息增加Tracking Id"
description: ""
category: "pattern"
tags: ["scala", "akka", "trackingId", "resourceId", "mdc", "play", "play2.6"]
lang: "zh"
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> Yann Simon在2014的文章中总结了两种向Mapped Diagnostic Contexts（MDC）
> 增加全局变量的编程方式，利用MDC的全局变量，可以在日志中记录每一个HTTP Request的Tracking Id。
>
> 本文首先对Tracking Id和Yann Simon的两种方式做简要介绍，随后列出一些实践过程
> 中遇到的问题。其中一个主要的问题是，
> 部分日志没有Tracking Id（同样的问题在Github上也被提到 [^_github_rishabh9_issue1]）。
> 因此，本文最后阐述利用日志中线程信息来定位和解决这个问题的调试过程。

# 背景介绍

软件工程中，比争论不同编程语言孰优孰劣更重要的是，在系统层面使用高效
的交付方式，建立完善系统监控机制。如果说Git工作流、测试或者覆盖率等是
可持续交付的基本保障，那么诸如日志、健康检查或者运行时度量（Metric）便是对
系统监控的基础。

软件交付之后，难免会遇上运行时错误，快速地定位并处理问题是保证
系统可靠的一个因素。在定位线上问题的时候，
常见的做法是查看日志，Tracking Id是日志信息中针对不同的HTTP Request
分别生成的唯一编号，用来追踪每一个请求在系统中经历的不同节点。

## Tracking Id的重要性

目前的系统，通常需要应对大量的请求、而且系统的部署节点可能分布在不同的物理位置。
简单的`tail -f application.log`命令无法跟踪系统的运行状态。

同时，由于多线程的执行对不同请求而言不是线性的，所以不同请求的日志信息
会随机写入到日志文件中。在日志中使用`TrackingId`，能够重组不同的请求
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

一个完整的`TrackingId`方案最好能形成一个闭环，从客户端的发起、到网络中的
反向代理（Nginx日志），传递到服务端进行后台处理，包括返回的最终结果，每一个节点都能记录
唯一的`TrackingId`。在这种方案中，通常由客户端生成`TrackingId`，传递给系统
的其它节点使用，并最终送回给客户端。

本文简化了这个流程，并在Play 2.6下实现了服务端的`TrackingId`生成：

0. 服务端接收到请求（HTTP Request）；
0. 利用`HttpFilter`为每一个请求赋予一个唯一`TrackingId`；
0. 尝试将`TrackingId`写入相关的日志中；
0. 同样在`HttpFilter`中，将`TrackingId`写入最后的HTTP Response中；
0. 客户端接收到带有`TrackingId`的返回结果。

Yann Simon给出的方案就是为了将`TrackingId`写入
Mapped Diagnostic Contexts中，从而可以使用如下的Pattern记录带
`TrackingId`的日志：

{% highlight xml %}
<appender name="FILE" class="ch.qos.logback.core.FileAppender">
  <file>${application.home:-.}/logs/application.log</file>
  <encoder>
    <pattern>%date [%level] [%mdc{trackingId:--}] - %message%n%xException</pattern>
  </encoder>
</appender>
{% endhighlight %}

## Golang下的一种实现方式

## Play 2.6下全局变量的不便因素

# Yann Simon两种方式的实践

## 自定义Dispatcher

## 自定义ExecutionContext

## 原文中存在的问题

## 实践过程中出现的问题

# 解决Tracking Id未能添加到日志消息的问题

## 问题表述

## 解决思路和问题定位

## 停用Scala自带ExecutionContext

## 解决过程总结

# 本文总结

# 参考文献

[^_github_rishabh9_issue1]: [`TrackingId` not printed as description in issue #1 of rishabh9/mdc-propagation-dispatcher](https://github.com/rishabh9/mdc-propagation-dispatcher/issues/1)
