---
layout: post
title: "Bolero, a RESTful Scaffold with Scala, Play! and ReactiveMongo"
description: ""
category: "guide"
tags: ["scala","scaffold","project","architecture","restful"]
lang: "en"
---
{% include JB/setup %}

# Abstract
{:.no_toc}

> Bolero is a `RESTful` Scaffold with `Scala`, `Play!` and `ReactiveMongo`.
>
> `Play!` handles the HTTP Request and Response, while the `ReactiveMongo`
> reads and write with `MongoDB`. This article will introduce a few ideas in Bolero, including:
>
> * `Model` naming and Jsonfying,
> * `RESTful API` design,
> * `CORS` configuration,
> * Token based authentication,
> * `EitherOrError`, a Monad class for global rules,
> * Webhook handling,
> * `FakeApplication` for HTTP Request mock,
> * Deploy with `sbt-native`.
>
> This article, currently, is written in Chinese, and will be in English soon.
> You may find the source code of `Bolero` on [scozv/bolero](https://github.com/scozv/bolero).

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# Principles of `Bolero`

I will introduce a `RESTful` Server code scaffold named `Bolero`.
The source code of it can be checked in [github](https://github.com/scozv/bolero).

Let's look at the principles of `Bolero`.

## Loose Coupling

Loose Coupling is a very important idea of `Bolero`, I develop and deploy the
View (web page) and `RESTful` Server individually:

* `Bolero` only provides the `RESTful` Server, the view engine of `Play !` is
  not used in `Bolero`. I am planning to replace `Play!` with `Spary.io`,
* As the `RESTful` Server, `Bolero` ensures that all data returned is `JSON` format.

We can apply `Bolero` for multiple `RESTful` Server, however, `Bolero` is NOT
a Microservices Framework. Currently, the `Scala` version of `Lagom` Framework
provided by Lightbend
is under development [^lagom_issue1].

## Modeling, the Name, Polymorphism, and the JSON Formats

Data (`models`) has two paths of transferring in `Bolero`.

One path is that HTTP Request sends
data contained in `payload` to `models` in `Scala`,
and finally persists the data into `MongoDB`.

Another path is from `MongoDB` to `models`, and then to `JSON` in web page.

So we need to build the model in 3 places:

* `JSON` model in web page, `TypeScript` is recommanded for `JSON` modeling,
* `Scala` model in `RESTful` Server, `trait` or `case`,
* `JSON` model in `MongoDB`.

In order to keep consistency in 3 places, the naming convention is:

* `_id` is used for all primary fields,
* `NameOfModel` is camel-casing, with initial letter Uppercase,
* `propertyOfModel` is camel-casing, with initial letter lowercase.

> Attentions:
>
> The naming conventions above is not a best practice.
> And, I am considering to convert the camel-case to underline_case in `JSON` and `MongoDB`.
> Considering means just-considering, NOT decided-yet.

`Play!` provides `Reads` and `Writes` [^play_json] for
`JSON` serialization and deserialization:

* It `Writes` code model to `JSON`, while,
* `Reads` data as strong-typed model from `JSON`.

Also, `Play!` contains `Formats` for `JSON` automated mapping [^play_json_auto].

{% highlight scala %}
import play.api.libs.json._

implicit val autoReads = Json.reads[T]
implicit val autoWrites = Json.writes[T]

// format = reads + writes
implicit val autoFormat = Json.format[T]
{% endhighlight %}

> Tips:
>
> `Play!` provides automated mapping, however, using `Reads` and `Writes`
> is recommanded, especially for complex `models`, assuming we have the
> high percentage of APIs test coverage.
>
> The reason of NOT using `Formats[T]` is:
>
> * When any changes happen in any places, we have to update the code of `Reads` and `Writes`,
>   otherwise, an error will be thrown:
>   
>        play.api.libs.json.JsResultException: "obj.field_name":{"msg":["error.path.missing"]
> * `JSON` formatting will be more flexible, such as `Writing` empty when `Option[T]` is `None`,
> * We can use different naming conventions in different places.

Polymorphism is the core idea of OOP, when using the `Reads` and `Writes`,
we may encounter the compile error saying:

{% highlight scala %}
ambiguous reference to overloaded definition
{% endhighlight %}

That means code has the conflict overrides,
if you have the same issue,
please read the source code of [`Bolero`]((https://github.com/scozv/bolero)),
or drop me a message.

## Tips on `RESTful API` Design

### Factors in `RESTful API`

### Consistency in payload and Response

### Be CORS or NOT

### URI, the Plurals, and the Order

# Deep in Code

## Ability of Model

### `CanBeHierarchic`

### `CanBeJsonfied`

### `CanBeMasked`

## `OrderOrError`, a Monad for Global Rules Validation

{% highlight scala %}

type OrderOrError = Either[Order, Error]

def genericValidation(order: Order, db: DB): Future[OrderOrError] = {
  ???
  /*
  * we connect DB and validate the order,
  * so a Future[T] will be returned
  * */
}

def genericRule
(order: Future[OrderOrError], db: => DB)
(implicit ec: ExecutionContext): Future[OrderOrError] =
  order.flatMap {
    case Right(e) => Future.successful(Right(e))
    case Left(o) => genericValidation(o, db)
  }
{% endhighlight %}

## `CanCrossOrigin`

{% highlight scala %}
// routes
// OPTIONS       /*path        controllers.CORSController.preFlight(path)
// controllers
class CORSController
  extends Controller
  with CanCrossOrigin {
  def preFlight(path: String) = Action { request =>
    corsOPTION(path)
  }
}

// CanCrossOrigin
trait CanCrossOrigin {
  self: Controller =>

  def corsOPTION(from: String = "..."): Result = {
    ???
    // add Access-Control-Allow-Origin to header
  }
}

{% endhighlight %}

## Token Based Authentication

# Test, Refactor and CI

## Begin and End of Test

## `FakeApplication`, HTTP Request Mocking

# Deployment

DO NOT host the deployment script or production configuration in development code.

Supposing we have a huge project (codename: PJ):

{% highlight bash %}
pj-docs                 # documentation center, using Markdown
pj-core-restful         # this is where the Bolero use
pj-core-web             # Web models, using TypeScript
pj-client-web           # View, the user interface, using `pj-core-web`
pj-client-device        # View, application
pj-client-console       # View, core management system, still using `pj-core-web`
pj-deploy               # deploy configuration, NOT open to developers
pj-data                 # production data backup, NOT open to developers
{% endhighlight %}

# References

[^play_json]: [`Play!` JSON Reads/Writes/Format Combinators](https://www.playframework.com/documentation/2.5.x/ScalaJsonCombinators)
[^play_json_auto]: [`Play!` JSON automated mapping](https://www.playframework.com/documentation/2.5.x/ScalaJsonAutomated)
[^rest_http_method]: [Using HTTP Methods for RESTful Services](http://www.restapitutorial.com/lessons/httpmethods.html)
[^mdn_cors]: [HTTP access control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
[^w3_cors_multi_issue]: [5.1 Access-Control-Allow-Origin Response Header](https://www.w3.org/TR/cors/#access-control-allow-origin-response-header) from w3.org
[^play_filter]: [`Play!` Filters](https://www.playframework.com/documentation/2.5.x/ScalaHttpFilters)
[^play_rqst_header]: [`play.api.mvc.RequestHeader`](https://www.playframework.com/documentation/2.5.x/api/scala/index.html#play.api.mvc.RequestHeader)
[^auth0_token]: [Cookies vs Tokens. Getting auth right with Angular.JS](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/)
[^scozv_blog_auth_token]: [对登录和基于Token的认证机制的理解（草稿）](https://github.com/scozv/blog/blob/master/_drafts/2016-05-12-understanding-of-login-and-the-token-based-authentication.md)
[^oracle_mask]: [Oracle Data Masking and Subsetting Pack](http://www.oracle.com/technetwork/database/options/data-masking-subsetting/overview/index.html)
[^scala_try]: [`scala.util.Try`](http://www.scala-lang.org/api/2.9.3/scala/util/Try.html)
[^play_composition]: [`Play!` Action composition](https://www.playframework.com/documentation/2.5.x/ScalaActionsComposition)
[^scozv_blog_jira]: [Fully Migrating from Bitbucket Cloud Issue System to JIRA Server](https://scozv.github.io/blog/guide/2016/04/05/fully-migrating-from-bitbucket-cloud-issue-system-to-jira-server)
[^scala_sbt_native]: [Debian Plugin]([^scala_sbt_native])
[^scozv_git_goods]: [`models.Goods`](https://github.com/scozv/bolero/blob/master/app/models/Goods.scala#L28)
