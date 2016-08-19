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

`Bolero` only provides the `RESTful` Server returning the `JSON` data,
will NOT provide the View page.

### Factors in `RESTful API`

Generally, factors below should be considered during the `RESTful API` design:

* HTTP Method, such as `GET`, `POST`, `PUT`, etc [^rest_http_method],
* `URI`, like `/user/:id/profile`, parameters can be used for sorting, pagination or filtering,
* `payload` data that is usually used in `POST` or `PUT`, it will be transferred to `RESTful` Server from Client side,
* HTTP Header, metadata of HTTP Request, we can add authentication token in Header,
* HTTP Response data, the returning value of `RESTful API`.

### Consistency in payload and Response

Consistency is not a new idea, especially, when you
are familier with `map()` in `Scala`:

{% highlight scala %}
T.map(): T
// such as
List[A].map(): List[B]
Future[A].map(): Future[B]
{% endhighlight %}

According to this consistency principle,
the data structure of HTTP Response data is same as
the data structure of `payload` in Request:

{% highlight HTML %}
POST /checkout

// Request
// header: Token for authentication
payload: "Bolero.models.Order"

// Response
data: "Bolero.models.Order"
{% endhighlight %}

Consistency principle of Request and Response
makes the API easy to remember and invoke.

### Be CORS or NOT

CORS stands for Cross Origin Resource Sharing [^mdn_cors].

At the very beginning of `Bolero`, I restricted the
access origin of `RESTful API`, and I allowed only one
specific client (web page server) to access the `RESTful` Server.

However, restricting of access origin is helpless for a `RESTful` Server,
especially, when we need to interact with 3rd party Server.
For instance, the `Bolero` Server receives the Webhook from Ping++ payment server,
which is a `POST` request actually, so that it need to open its access origin.

Attention, `Access-Control-Allow-Origin` doesn't support
the so-called _multipal origin_ [^w3_cors_multi_issue],
we need to open our access origin widely (`*`):

> In practice the `origin-list-or-null` production is more constrained.
> Rather than allowing a space-separated list of origins,
> **it is either a single origin or the string "null"**.

Also, restriction of access origin is NOT appropriate
under Loose Coupling principle and multiple instance deployment.

And, If we need the access origin control, or to monitor the
HTTP Request, we can:

* use `Filters` of `Play!` [^play_filter],
* use `origin` of HTTP Request to restrict origin source,
* limit the abnormal high frequency sending of HTTP Request in client side.

### URI, the Plurals, and the Order

`Bolero` has the naming conventions of `URI` below:

* using simple nouns in `URI`,
* NOT using any symbol except the `/`,
* NOT using camel-case,
* using ONLY singular form of nouns in `URI`, even the Response data is `List`:

      // get the list of user
      GET /user
      // get a user with specific id
      GET /user/:id

  If we treat a user as a file named `:id`, we also treat the `List[user]` as the folder
  named `user`, when we need a file, or need to access the entire folder, we will also access
  the path named `/user`. We don't use path `/user` for a single user,
  and use path `/users` for a gourp of user at same time.

# Details in Codes

The source code of `Bolero` is hosted as open source
in [github](https://github.com/scozv/bolero).

The brief structure of `Bolero` code is:

{% highlight sh %}
.
├── app
|   ├── base                // utils function
|   ├── biz                 // business implement, ONLY access MongoDB here
|   ├── contollers          // controll of MVC
|   └── models              
|       ├── interop         // models used for interact with 3rd party API
|       └── model.scala     // modeling data in Scala
|
├── conf                    // Play! configuration
|   ├── application.conf
|   ├── play.plugins
|   ├── release.conf
|   └── routes
|
├── project                  // project configuration
|   ├── build.properties
|   └── plugin.sbt
|
├── test                     // test case
|
└── build.sbt
{% endhighlight %}

## Ability of Model

In `Scala`, `trait` means an ability,
`Bolero` names `trait` as `CanHaveSpecificAbility`.

### `CanBeHierarchic`, building the hierarchical model(s)

Hierarchical model(s) is (are) conntected with each other.
We can use `union-find` to maintain the relationship:

* the `rootId` of root object is its own `_id`,
* for any two instances, if they have the same `rootId`, they are connected.

### `CanBeJsonfied`, reading and writing `JSON`

Please read the source code of `CanBeJsonfied` [^scozv_git_goods].

### `CanBeMasked`, removing the sensitive data

`Bolero` will put a mask on the sensitive data, such as
underlying unique `_id`, cost of a product.

Then, using `T.asMasked()` will be remove the sensitive data.

Naming as `Mask`, is inspired from Oracle Data Masking [^oracle_mask].

## `OrderOrError`, a Monad Pattern for Global Validation

Before creating an `Order`, we need validate a serial of rules on this `Order`:

* does the user have the privilege of creating order,
* is there enough inventory for this order,
* is price valid,
* is the coupon of order valid,
* etc.

`Bolero` provides a Monad Pattern named `OrderOrError`,
it accepts an `OrderOrError`, and will

* return `Order`, if previous order valid, otherwise,
* return `Error`.

Learning from the `Try` of `Scala` [^scala_try] , I designed
`OrderOrError` as below:

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

> Attention:
>
> Strictly speaking, `OrderOrError` above is not a Monad.
> Two primary methods haven't been implemented [^scozv_bolero_issue1]:
>
>       ModelOrError[A].map(A => B): ModelOrError[B]
>       ModelOrError[A].flatMap(A => ModelOrError[B]): ModelOrError[B]


## `CanCrossOrigin`, handling the `OPTION` Request

`OPTION` Request is used for `POST` or `PUT` of CORS, we need to:

* define the `OPTION` router, and,
* return `HTTP 200` after accepting the `OPTION` Request.

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

## `CanConnectDB2[T]`, making code easy to I/O `MongoDB`

`CanConnectDB2[T]` will replace the original `CanConnectDB` soon.
It will make code easy to read and write `MongoDB`.

The code changes
could be found at
[git diff](https://github.com/scozv/bolero/commit/b0a5fd3c3ab58159305711e6e0f742786fccc30b).

Currently, methods below are provided:

{% highlight scala %}
trait CanConnectDB2[T] {
  // Lists all T
  def list(db: DB): Future[Seq[T]] = ???
  // Quereis one T with specific _id
  def one(db: DB, id: String): Future[Option[T]] = ???
  // Gets the value of specific field of one T
  def field[B](db: DB, id: String, fieldName: String): Future[Option[B]] = ???
  // Lists the specific field values
  def sequence(db: DB, selector: JsObject, fieldName: String): Future[Seq[B]] = ???
  // Inserts one T
  def insert(db: DB, document: T): Future[WriteResult] = ???
  // Updates T(s) when selector holds
  def update(db: DB, selector: JsObject, update: T): Future[UpdateWriteResult] = ???
  // Edits one T with specific _id
  def edit(db: DB, id: String, update: T):Future[UpdateWriteResult] = ???
}
{% endhighlight %}

## Token Based Authentication

All `RESTful` API are stateless in `Bolero`.
Token based authentication can be used for
user identification. A post [^auth0_token] from `auth0`
is recommanded.

Also, I am writing a post on token authentication,
the source code of this draft is in github [^scozv_blog_auth_token].

> Attention:
>
> I am not a expert on Web Security.
> `Bolero` cannot ensure the 100% security of authentication.
> I am still improving it.

Currently, `Bolero` uses Action composition [^play_composition]
for authentication.
You can read the source code of `controllers.CanAuthenticate.scala`.

# Test, Refactor and CI

> **Test is very important [^scozv_blog_jira], it is key to Refactor and CI.**
>
> **Test is very important [^scozv_blog_jira], it is key to Refactor and CI.**
>
> **Test is very important [^scozv_blog_jira], it is key to Refactor and CI.**

The source code of `test`
is located in [`test`](https://github.com/scozv/bolero/tree/master/test) folder.

## The Structure of Test

{% highlight sh %}
.
├── test
|   ├── WithApplication.scala         // still use previous release instead Play! 2.4
|   ├── CanConnectDB.scala            // connect to test database
|   ├── CanFakeHTTP.scala             // fake HTTP Request
|   └── BoleroApplicationSpec.scala   // test files

{% endhighlight %}

## Begin and End of Test

In order to keep independency of database,
`Bolero` will prepare data before test, and clean up data after test.

## `CanFakeHTTP`, HTTP Request Mocking

Based on the 

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
[^scozv_bolero_issue1]: [`Bolero` issue #1 monad ModelOrError needed](https://github.com/scozv/bolero/issues/1)
