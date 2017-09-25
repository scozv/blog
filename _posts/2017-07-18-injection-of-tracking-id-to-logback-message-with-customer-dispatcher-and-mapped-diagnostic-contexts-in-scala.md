---
layout: post
title: "Putting Tracking Id to Log Message with Customized Akka Dispatcher and Mapped Diagnostic Contexts in Play 2.6"
description: ""
category: "pattern"
tags: ["scala", "akka", "trackingId", "resourceId", "mdc", "play", "play2.6", "go", "golang"]
lang: "en"
---
{% include JB/setup %}

# Abstract
{:.no_toc}

> Two approaches of adding global value to Mapped Diagnostic Contexts（MDC)
> have been introduced in the post of 2014 by Yann Simon[^_blog_yanns_mdc_play].
> Since the global value could be added into MDC,
> the Tracking Id used for tracking the log messages for each HTTP Request
> can be also added into the MDC.
>
> This post initially introduces the background of Tracking Id
> and the approaches mentioned in Yann's post. Then describes some improve
> or issues during the implementation.
> A critical or blocked issue is `trackingId` not added in every log message,
> and a similiar issue is also mention in Github[^_github_rishabh9_issue1].
>
> Logging the thread name is useful for locating the reason of issue.
> According to thread information of log messages, a solution or fix that
>
> * changing the configuration name `play.akka.actor` to `akka.actor`, and
> * replacing `scala.concurrent.ExecutionContext` with injected object
>
> has been found and applied.

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# Introduction

Applying the Software Engineering means more attention
should be paid on Engineering, efficient delivery and
reliable system monitoring, instead of endless dispute on
programming language A must be better than B.

Initially setting up the team with similar programming stack,
then the Lead spends much more effort on testing, coverage, and
also log system, health check, and software metric.

The runtime error in production MUST be fixed as soon as
possible. Since the regular diagnostic information comes from
the log message, querying the issue related log message quickly
is the key to locating the reason of issue. Tracking Id is
an random string generated for each HTTP Request, this unique string
will be appended in each log message related to a HTTP Request.
Searching the log messages by `trackingId` can find out the
exact happened story for each specific HTTP Request.

## Use Case and Design of Tracking Id

High volume of concurrence and loose coupling of distributed deployment are
two generic facts of current system design. The log files stored in difference
server become larger. Meanwhile, the log messages related to a specific HTTP
Request CANNOT be written linearly.

Here is an example for two requests:

{% highlight bash %}

[2017-07-17T19:06:55.560Z] [DEBUG] user 1 connected
[2017-07-17T19:06:57.121Z] [DEBUG] get token from redis
[2017-07-17T19:07:03.289Z] [DEBUG] start the query with parameter {...}
[2017-07-17T19:07:03.981Z] [DEBUG] user 2 connected
[2017-07-17T19:07:05.192Z] [WARN] get result with 1029ms
[2017-07-17T19:07:05.207Z] [DEBUG] get token from redis
[2017-07-17T19:07:05.285Z] [ERROR] invalid token

{% endhighlight %}

Reading the large log file from
multiple server nodes with `tail -f application.log` is impossible to
locating the issue in 5 minutes.

However, with appending `trackingId` in log message shown below,
the exact linear story can be extracted from the large log files:

{% highlight bash %}

[2017-07-17T19:06:55.560Z] [tracking-id-0001] [DEBUG] user 1 connected
[2017-07-17T19:06:57.121Z] [tracking-id-0001] [DEBUG] get token from redis
[2017-07-17T19:07:03.289Z] [tracking-id-0001] [DEBUG] start the query with parameter {...}
[2017-07-17T19:07:03.981Z] [tracking-id-1024] [DEBUG] user 2 connected
[2017-07-17T19:07:05.192Z] [tracking-id-0001] [WARN] get result with 1029ms
[2017-07-17T19:07:05.207Z] [tracking-id-1024] [DEBUG] get token from redis
[2017-07-17T19:07:05.285Z] [tracking-id-1024] [ERROR] invalid token

{% endhighlight %}


A flow of generating and passing the `trackingId` in Play 2.6 is designed as below:

0. HTTP Request accepted in backend server side,
0. `trackingId` generated for each request in `HttpFilter` of Play,
0. `trackingId` passed to MDC and appended to log message,
0. `trackingId` inserted into the header of HTTP Response,
0. frontend side received the `trackingId`.

The approaches provided in Yann Simon's post are used for passing the `trackingId`
to Mapped Diagnostic Contexts (MDC). So that we can use the Logback pattern with `%mdc{trackingId}` to write `trackingId` in log messages:

{% highlight xml %}
<appender name="FILE" class="ch.qos.logback.core.FileAppender">
  <file>${application.home:-.}/logs/application.log</file>
  <encoder>
    <pattern>%date [%level] [%mdc{trackingId:--}] %message%n%xException</pattern>
  </encoder>
</appender>
{% endhighlight %}

# Implementation of Tracking Id

## Holding `trackingId` in Context of Golang

The `%mdc` pattern or fommatter is not supported in `cihub/seelog`
package of Golang[^_github_cihub_seelog_format_ref]. David Budworth
explained this in Stackoverflow as[^_sf_david_bud_mdc_java_go]:

> Java MDC relies on thread local storage, something Go does not have.

An alternative solution is holding the `trackingId` in a global context,
such as creating a `RequestContext` basing on the `gin.Context`[^_note_where_go_code_from]:


{% highlight go %}
type RequestContext struct {
  *gin.Context

  TrackingId    string
}

func newContext(c *gin.Context) *RequestContext {
  return &RequestContext{
    Context:    c,
    TrackingId: GenGuid(),
  }
}
{% endhighlight %}

Also, passing the `RequestContext` to the method where the
logger needed:

{% highlight go %}
func fooAction(c *gin.Context) {
  var err error

  ctx := getRequestContext(c)

  // ..., err =

  logger.Errorf(buildLogMessage(ctx, "Failed in fooAction: $v", err))
}
{% endhighlight %}

The method named `getRequestContext` has two purposes, one is getting the
`RequestContext` if any (`val.(*RequestContext)`), another is
creating a new `RequestContext` if not existing.

Since seelog doesn't support `%mdc{}` pattern, `buildLogMessage`
can be used for appending the `trackingId` into the log message.

With the pattern below, `trackingId` will be considered as
a part of log message:


{% highlight xml %}
<appender name="FILE" class="ch.qos.logback.core.FileAppender">
  <file>${application.home:-.}/logs/application.log</file>
  <encoder>
    <pattern>%date [%level] %message%n%xException</pattern>
  </encoder>
</appender>
{% endhighlight %}

Only need is prepending the `trackingId` to the log message body,
to keep the same format of log both in Scala and Java:

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

## Using HttpFilter and Dispatcher in Scala

As mentioned in Yann Simon's post[^_blog_yanns_mdc_play]:

> To record the values in the MDC, Logback uses a ThreadLocal variable. This strategy works when one thread is used for one request. The implementation of the MDC with a ThreadLocal cannot work with this non-blocking asynchronous threading model in Play.

Two steps need to be implemented for `trackingId`:

* Generating the unique string for each request,
* Passing the `trackingId` in different threads.

The `HttpFilter` of Play Framework is a feature that makes
it possible to run some code before or after the actions are
invoked[^_book_julien_foy_2014].

The `trackingId` is generated before the actions are invoked,
then it will be inserted into HTTP Response header
after the actions are invoked. Frontend reports the `trackingId`
in HTTP Response when runtime error happens.

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

The `trackingId` generated in `TrackingFilter` needs to be passed into the MDC of
different threads, where the Customized Akka Dispatcher or ExecutionContext mentioned by
Yann Simon is needed.

The main implementation of customized Akka Dispatcher copied as below,
The switch of different threads happenes in `self.execute(() => {})`, where a new
Runnable instance is created:


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

## Tips in Implementation

Play Framework has been shipped with Dependency Injection
from 2.4 [^_play_di_in_24], in version 2.6, `Controller` and `ExecutionContext.global`
has been deprecated and replaced with injected case class[^_play_di_in_26].
When `TrackingFilter` is used as an injected class, we need configure to use Filters
in `play.http.filters` conf item[^_play_http_filters].

After that, we will learn from the server starting log that Play enabled four `HttpFilter` by default:

{% highlight bash %}
[info] [-] p.a.h.EnabledFilters - Enabled Filters (see <https://www.playframework.com/documentation/latest/Filters>):

    play.filters.csrf.CSRFFilter
    play.filters.headers.SecurityHeadersFilter
    play.filters.hosts.AllowedHostsFilter
    play.filters.cors.CORSFilter

[info] [-] play.api.Play - Application started (Dev)

{% endhighlight %}

Being enable of `AllowedHostsFilter` may receive some
error saying "Host not allowed: server-name", or "Host not allowed: private-ip"
in some IaaS platform using the load balance for health check.
In this case, a white list of allowed hosts should be configured[^_play_host_allowed].

Another solution for fixing the "Host not allowed: server-name" error is removing
`AllowedHostsFilter`：

{% highlight scala %}
class Filters @Inject() (
  defaultFilters: EnabledFilters,
  tracking: TrackingFilter
) extends DefaultHttpFilters(defaultFilters.filters.filter {
  case f: AllowedHostsFilter => false
  case _ => true
} :+ tracking: _*)
{% endhighlight %}

A final tip for customized Dispatcher is the name of
dispatcher conf node may be `akka.actor`, instead of `play.akka.actor`
mentioned in Yann Simon's post. Anyway, runtime will choose a correct one.

# Diagnosis of Tracking Id not Written in Log Message

## Issue Description

Most log messages don't have the `trackingId` after implemented the customized
Akka Dispather.

{% highlight bash %}
[info] [-] play.api.Play - Application started (Dev)
[warn] [-] c.z.h.HikariConfig - The initializationFailFast propery is deprecated, see initializationFailTimeout
[debug] [-] c.l.p.a.v.g.G.w.s.com - list feature enabled: Vector(security, profile)
[debug] [-] c.l.p.a.v.g.ActivityApi - start the get last message
[debug] [-] c.l.p.n.d.ReactiveMongoManager$ -  <:> Connecting reactive driver
{% endhighlight %}

Putting log in `TrackingFilter` will print some trackable log messages, but not all：

{% highlight bash %}
[info] [-] play.api.Play - Application started (Dev)
[debug] [3734068e-f354-4de4-a9e7-25fc6ed9a1cb] c.l.TrackingFilter -  <:> trackingId generated: 3734068e-f354-4de4-a9e7-25fc6ed9a1cb
[warn] [-] c.z.h.HikariConfig - The initializationFailFast propery is deprecated, see initializationFailTimeout
[debug] [-] c.l.p.a.v.g.G.w.s.com - list feature enabled: Vector(security, profile)
{% endhighlight %}

Moreover, putting the log in `MDCPropagatingDispatcher`, will see：

{% highlight bash %}
[info] [-] play.api.Play - Application started (Dev)
[debug] [a5a7cbab-6ee4-4dd8-b54e-64217dc7357e] c.l.TrackingFilter -  <:> trackingId generated: a5a7cbab-6ee4-4dd8-b54e-64217dc7357e
[debug] [a5a7cbab-6ee4-4dd8-b54e-64217dc7357e] old context: null
[debug] [a5a7cbab-6ee4-4dd8-b54e-64217dc7357e] new context: {trackingId=a5a7cbab-6ee4-4dd8-b54e-64217dc7357e}
# many log skipped  ...
[debug] [-] old context: null
[debug] [-] new context: null
[debug] [-] old context: {}
[debug] [-] new context: null
{% endhighlight %}

## Solution for Tracking Id Missing

The last log messages indicate:

* The customized Akka Dispatcher works, since the log contain the message from `MDCPropagatingDispatcher`,
* The thread keeps switching, since multiple messages of `old / new context` show up
  in the log.

So the question of Tracking Id missing becomes
__why `trackingId` is not passing in MDC of different threads__.
In order to find out the solution, we display the thread name in each
log message:

{% highlight bash %}
# Log format
# <pattern>%coloredLevel [%mdc{trackingId:--}] [%thread] %logger{15} - %message%n%xException{10}</pattern>

[info] [-] [scala-execution-context-global-80] play.api.Play - Application started (Dev)
[debug] [006bc4df-0310-4793-a88d-923dfde227d9] [play-dev-mode-akka.actor.default-dispatcher-2] c.l.TrackingFilter -  <:> trackingId generated: 006bc4df-0310-4793-a88d-923dfde227d9
[debug] [006bc4df-0310-4793-a88d-923dfde227d9] [application-akka.actor.default-dispatcher-2] - old context: null
[debug] [006bc4df-0310-4793-a88d-923dfde227d9] [application-akka.actor.default-dispatcher-2] - new context: {trackingId=006bc4df-0310-4793-a88d-923dfde227d9}
[warn] [-] [scala-execution-context-global-80] - ['token': 'fd'] | ['request': 'POST /api/auth'] | ['clientIp': '0:0:0:0:0:0:0:1'] <:> Valid token not found

{% endhighlight %}

The last two messages are the key to locating the issue, one has `trackingId`,
another has not, and the thread names are different：

{% highlight bash %}
[debug] [006bc4df-0310-4793-a88d-923dfde227d9] [application-akka.actor.default-dispatcher-2] - new context: {trackingId=006bc4df-0....
[warn] [-] [scala-execution-context-global-80] - ['token': '404'] | ['request': 'POST /api/auth'] | ['clientIp': '0:0:0:0:0:0:0:1'] <:> Valid token not found

{% endhighlight %}

These two messages may generated by different thread objects,
one is created by `akka.actor.default-dispatcher`,
another is created by some scala object related to
`scala.concurrent.ExecutionContext.global`.

The name of `scala-execution-context-global-80` reminds me that Play 2.6 encourages
developer to use Dependency Injection, not global `ExecutionContext.global`[^_play_ec_deprected]. And from the thread information
of log messages, it is one step closer to the final solution.

## Replacing ExecutionContext.global with Injected Object

Basing on the analysis above, the implicit usage of `ExecutionContext.global` has
finally been found in source code, it should be replaced by injected `ExecutionContext`
as the solution below:

{% highlight scala %}
class Security @Inject() (
+  implicit ec: ExecutionContext,
  membersDao: MembersDao,
  userApiToken: UserApiTokenDao,
  enforceHttpsAction: EnforceHttpsAction
) {

-  implicit val ec = scala.concurrent.ExecutionContext.global

}
{% endhighlight %}

And this solution works:

{% highlight bash %}
[debug] [f6ab38a5-1461-44c9-a5f8-ce7764025fad] -  <:> trackingId generated: f6ab38a5-1461-44c9-a5f8-ce7764025fad
[warn] [f6ab38a5-1461-44c9-a5f8-ce7764025fad] - ['token': '404'] | ['request': 'POST /api/auth'] | ['clientIp': '0:0:0:0:0:0:0:1'] <:> Valid token not found
{% endhighlight %}


# Improve of Tracking Id

The importance of Tracking Id is evidently. Since this post
only focus on the backend Tracking Id generating, an improve
of Tracking Id is frontend generating. The Tracking Id
will take its entire life cycle starting from the HTTP Request initialization,
going through the load balance, network, and arriving at backend side. After
the business calculation in backend server finish, the Tracking Id will be finally responsed
back to the frontend side.

The system deployed with the Ngnix needs writing the `trackingId` into the
Ngnix, then the `condition` conf[^_ngix_condition_log] can be used for Access Log.
Even more, the Access Log can be configured for tracking the `4xx` HTTP Response only for production error.

Reporting the `trackingId` from frontend:

* can track the access log of Nginx,
* can help build the story in backend.

No need of reading and searching word by word in large log file.

# Reference

[^_blog_yanns_mdc_play]: [SLF4J Mapped Diagnostic Context (MDC) With Play Framework](http://yanns.github.io/blog/2014/05/04/slf4j-mapped-diagnostic-context-mdc-with-play-framework/) by Yann Simon, 2014

[^_github_rishabh9_issue1]: [`TrackingId` not printed as description in issue #1 of rishabh9/mdc-propagation-dispatcher](https://github.com/rishabh9/mdc-propagation-dispatcher/issues/1)
[^_github_cihub_seelog_format_ref]: [Format Reference of cihub/seelog](https://github.com/cihub/seelog/wiki/Format-reference/7eb0ebc6df74a6386165d9b4687445c6b86bac97)

[^_sf_david_bud_mdc_java_go]: [_"Java MDC relies on thread local storage, Go does not have"_ by David Budworth's reply on Stackoverflow](https://stackoverflow.com/a/41049394)

[^_note_where_go_code_from]: The `RequestContext` originally comes from the Golang code of my colleague in Hujiang. Basing on that, I added the `TrackingId` and wrote it to log.

[^_play_http_filters]: [Using Filters in Play 2.6](https://www.playframework.com/documentation/2.6.x/ScalaHttpFilters#Using-filters)

[^_play_host_allowed]: [Configure Allowed Hosts](https://www.playframework.com/documentation/2.6.x/AllowedHostsFilter#Configuring-allowed-hosts)
[^_play_di_in_24]: [Runtime Dependency Injection in Play 2.4](https://www.playframework.com/documentation/2.4.x/ScalaDependencyInjection)

[^_play_di_in_26]: [Scala Controller Changes in Play 2.6](https://playframework.com/documentation/2.6.x/Migration26#scala-controller-changes)

[^_play_ec_deprected]: [`play.api.libs.concurrent.Execution` is deprecated](https://playframework.com/documentation/2.6.x/Migration26#play.api.libs.concurrent.Execution-is-deprecated)

[^_book_julien_foy_2014]: Julien Richard-Foy, Play Framework Essentials, Packt Publishing 2014

[^_ngix_condition_log]: [Module ngx_http_log_module](http://nginx.org/en/docs/http/ngx_http_log_module.html)
