---
layout: post
title: "Bolero——基于Scala、Play!和ReactiveMongo的RESTful代码模板"
description: ""
category: "guide"
tags: ["scala","scaffold","project","architecture","restful"]
lang: "zh"
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 本文介绍一套`RESTful`的代码模板（代号：`Bolero`）——使用`Scala`语言，基于`Play!`库以及`ReactiveMongo`。
>
> 除了基本的HTTP Request和Response处理、MongoDB的异步读写之外，`Bolero`还包含如下功能：
>
> * `Model`的几个建议；
> * `RESTful API`设计的几个建议；
> * `CORS`跨域配置；
> * 基于Token认证的Request处理；
> * 全局范围内设计的一套Monad规则：`EitherOrError`；
> * 接收Webhook；
> * 基于`Specs2`的`FakeApplication`集成测试；
> * 基于`sbt-native`的发布脚本。
>
> 本文（尤其是阅读源代码）需要有一定的`Scala`语言基础，需要对Monad有初步的理解。
> 最好能够（熟练地）使用`Future[T]`。
>
> `Bolero`目前主要基于`Play!`框架（`2.4`），但是不包含任何View的部分，所有的Action都返回`JSON`对象。
> 我计划用`Spary.io`代替`Play!`。
>
> `Bolero`的源代码参见 [scozv/bolero](https://github.com/scozv/bolero)。

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# `Bolero`设计的基本理念

本文介绍的这一套`RESTful`的代码模板，代号为`Bolero`，以下就将该套模板
称为`Bolero`。`Bolero`的源代码参见：

[https://github.com/scozv/bolero](https://github.com/scozv/bolero)

先来看`Bolero`设计的一些基本理念。

## 松耦合的架构思想

`Bolero`基于松耦合 [^scozv_blog_archi] 的思想，就前后端分离而言：

* `Bolero`只负责后端，我没有使用`Play!`提供的`View`引擎，并且计划使用`Spary.io`代替`Play!`；
* 作为后台服务，`Bolero`保证所有的HTTP Response都是`JSON`格式，都使用`RESTful`的方式呈现。

可以使用`Bolero`创建多个服务，不过目前，`Bolero`并不是一个Microservices的框架。
关于微服务，可以关注Lightbend推出的`Lagom`框架，`Lagom`的`Scala`版本正在进行中 [^lagom_issue1]。

## 建模中的一些问题：命名、多态和序列化

数据的传递方向，一个是从前端通过HTTP Request将`payload`数据传递给后端，
后端转换（`Validate[T]`）为代码层面的`models`，
经过数据处理之后，持久化到数据库`MongoDB`中。

另一个方向反之，从数据库读、代码层面加工，最后通过HTTP Response返回给前端。

因此，整个过程中有三个层面需要建模：

* 前端建模，虽然`JavaScript`是弱类型，但是建议使用`TypeScript`在前端建模；
* 代码层面，在`Bolero`中，对应地使用`Scala`设计接口（`trait`）和类（`class`）；
* 数据库层面，对应的就是`MongoDB`的设计。

在这三个层面中，`Bolero`使用或者建议的命名规范是：

* 所有的主键都叫`_id`；
* 对象名使用驼峰命名，首字母大写；
* 对象中的字段使用驼峰命名，首字母小写。

这样，保证了三个层面上的数据建模都是一模一样的。

此处有备住：

> 以上的数据建模规范，不一定是最佳的实践。另外，我正在考虑将前端和数据库层面的建模，
> 修改为下划线风格，代码层面继续使用驼峰。我是指，“我在考虑，但并没有决定”。

`Play!`中提供了`Reads`和`Writes`模块 [^play_json]，用来处理对象类和`JSON`之间
的转换：类到`JSON`我们用`Writes`，表示“写”；`JSON`到类，我们用`Reads`，表明“读”。

`Play!`中也提供了用于automated mapping的`JSON`读写 [^play_json_auto]：

{% highlight scala %}
import play.api.libs.json._

implicit val autoReads = Json.reads[T]
implicit val autoWrites = Json.writes[T]

// format = reads + writes
implicit val autoFormat = Json.format[T]
{% endhighlight %}

此处有建议：

> 尽管`Play!`提供了automated mapping，但是对于`models`比较复杂的
> 系统，我建议手动配置`Reads`和`Writes`（**前提是，要有完备的读写测试来覆盖代码**）：
>
> * 当任何一层的建模，发生更改的时候，我们必须手动去对应地修改`Reads`和`Writes`，
>   否则将会收到如下异常，此举，可以保证我们代码的质量：
>
>        play.api.libs.json.JsResultException: "obj.field_name":{"msg":["error.path.missing"]
> * 手动配置`Reads`和`Writes`的另一个原因就是，可以更加自由地处理`JSON`的序列化：
>   * `Option[T]`为`None`时，可以不用`Writes`；
>   * 可以兼容`Scala`建模用驼峰、`MongoDB`建模用下划线的情况。

目前系统的建模，通常离不开继承和多态，使用`Reads`和`Writes`时，可能会遇到如下异常：

{% highlight scala %}
ambiguous reference to overloaded definition
{% endhighlight %}

表明某一个类的`Reads`或者`Writes`有重复定义的情况。我之前花了9个`git commits`来处理这个问题。
你可以参考`Bolero`的[源代码](https://github.com/scozv/bolero)，或者给我看看错误信息。

## `RESTful API`设计的几个建议

再次强调，`Bolero`只提供`RESTful`的服务，不提供View渲染。所有的
`RESTful API`返回的都是`JSON`对象。

### `RESTful API`的几个要素

通常而言，`RESTful`接口在设计的时候，需要考虑这些要素：

* HTTP Method：`GET`、`POST`、`PUT`等 [^rest_http_method]；
* 资源路径，比如`/user/:id/profile`，可以在路径加入适当的参数，用来排序、分页或者筛选；
* `payload`数据，传递给`RSETful`服务的`JSON`数据；
* HTTP Header：可以为当前的HTTP Request添加一些元数据，比如Token认证过程中的用户身份Token；
* HTTP Response：服务传递回来的`JSON`结果。

### 一致的Payload和Response设计

如果你经常使用`Scala`中的`map()`，你就会发现如下的一致性原则：

{% highlight scala %}
T.map(): T
// such as
List[A].map(): List[B]
Future[A].map(): Future[B]
{% endhighlight %}

受这一原则的启发，我在`Bolero`的`RESTful API`设计中，很多时候
`payload`和HTTP Response的数据结构都是一样的，比如，
如下是购物车页面，提交，生成（返回）带`_id`的订单的`RESTful`接口：

{% highlight HTML %}
POST /checkout

// Request
// header: Token for authentication
payload: "Bolero.models.Order"

// Response
data: "Bolero.models.Order"
{% endhighlight %}

这样的设计，让接口的使用变得更简单——只需要记住一个数据结构。

### 限制跨域还是开放跨域

CORS是Cross Origin Resource Sharing [^mdn_cors] 的简写。

最初在设计`Bolero`的时候，我是限制跨域的，我只希望某一个指定的`IP`客户端，才能访问`Bolero`接口。
但是，当我后来需要接入Ping++支付的Webhook的时候，限制跨域就不能同时满足客户端和Ping++的访问了。

因为，`Access-Control-Allow-Origin`
并不支持多域（multiple origin）同时跨域访问 [^w3_cors_multi_issue]：

> In practice the `origin-list-or-null` production is more constrained.
> Rather than allowing a space-separated list of origins,
> **it is either a single origin or the string "null"**.

另外，面对松耦合和多个客户端的实例部署，限制跨域不是一个通用的选择。

如果真的想控制跨域，或者统计HTTP Request的来源，可以选择：

* 在`Bolero`中，使用`Play!`的`Filters`[^play_filter]，
  从HTTP Request中的`origin`信息[^play_rqst_header] 来控制访问源（目前`Bolero`并没有这么做）；
* 在客户端的Ｗeb Server层面，控制访问源，也就是，对于一些异常的高频访问，Web Server
  都不会将该HTTP Request发送给`Bolero`服务。

### 名词、单复数以及排序

`Bolero`在设计`RESTful API`的时候，还有如下几个原则：

* 资源地址（`URL`）中只使用名词，最好使用简单名词，
  不应该出现除反斜线（`/`）以外的其它字符，也不能采用驼峰的命名风格；
* 资源地址（`URL`）中的名词，统一使用单数，就算是返回一个数组，也应该使用单数，比如：

      // get the list of user
      GET /user
      // get a user with specific id
      GET /user/:id

  我们将单个的用户看作一个文件（`:id`），将这些文件都放进一个叫`user`的目录。我们拿单个的文件，或者
  取整个文件夹，都会经过`/user`这个路径，不会一个用`/user`；整体用`/users`。
  所以我们的`URL`中的名词也按照这个原则设计；
* 如果HTTP Response的是一个数组，那么我们是否需要将该数组排序？`Bolero`的HTTP Response排序原则是：
    * 如果HTTP Request指定了排序规则，则按照该规则排序；
    * 如果该接口对应的业务有默认的排序规则，则按照该规则排序；
    * 其它情况，`Bolero`并不保证HTTP Response的有序性。

# 开发代码详解

`Bolero`的源代码见：[scozv/bolero](https://github.com/scozv/bolero)　。

该源代码的文件结构为：

{% highlight sh %}
.
├── app
|   ├── base                // API中的辅助类
|   ├── biz                 // 业务处理，仅仅在这一层做数据库的读写
|   ├── contollers          // MVC 中的控制器
|   └── models              
|       ├── interop         // 第三方接口的models
|       └── model.scala     // Scala建模
|
├── conf                    // Play!的配置文件
|   ├── application.conf
|   ├── play.plugins
|   ├── release.conf
|   └── routes
|
├── project                  // 项目编译配置
|   ├── build.properties
|   └── plugin.sbt
|
├── test                     // 测试脚本
|
└── build.sbt
{% endhighlight %}

## `models`中的几个`trait`解释

### `CanBeHierarchic`，层级类

层级类表示一系列有关联的类。使用并查集的算法，也就是：

* 根节点的`rootId`为其本身；
* 任意两个实例，如果两者的`rootId`相等，则表示这两者是相互关联的。

### `CanBeJsonfied`，`Reads`和`Writes`的通用处理

参考`models.Goods`中使用`CanBeJsonfied`的方式 [^scozv_git_goods]。

### `CanBeMasked`，敏感字段的掩盖

`Bolero`在将数据Response给前端的时候，有些敏感字段，是不应该返回出去的，比如用户`_id`，
或者商品的成本价格。使用`CanBeMasked`接口，在Action那边，统一调用`T.asMasked()`，将敏感信息抹除。

Mask这个命名，受Oracle Data Masking [^oracle_mask] 的启发。

## `OrderOrError`——基于Monad设计的全局规则校验

就拿创建订单来看，通常订单的创建，会有一系列的规则需要校验：

* 该用户是否有权限创建订单；
* 订单中的商品数量是否满足库存；
* 订单中的商品价格是否不小于当前价格；
* 是否满足订单中列明的优惠；
* 等等等等。

`OrderOrError`的思路就是，对于任何一条规则，我们保证校验的结果：

* 要么是原来的订单`order`，当此订单通过了校验；
* 要么是`error`信息

此处，借用了`Scala`对`Try` [^scala_try] 的设计：

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

此处有备注：

> 严格意义上讲，上述的设计并不是Monad模式，因为，它没有实现两个关键的方法 [^scozv_bolero_issue1]：
>
>       ModelOrError[A].map(A => B): ModelOrError[B]
>       ModelOrError[A].flatMap(A => ModelOrError[B]): ModelOrError[B]
>
> 我正在考虑和设计。


## `CanCrossOrigin`——处理`OPTION`以应对跨域

跨域的处理有两个地方，需要实现：

* 定义`OPTION`路由；
* 处理`OPTION`，返回`HTTP 200`。

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

## `CanConnectDB2[T]`——统一处理数据的读写

`CanConnectDB2[T]`是对原先的`CanConnectDB`的改写。
主要的意图是，让开发人员尽可能地少写重复的代码。

具体的代码变更，参考`biz.Can.scala`，也可以访问[代码变更记录](https://github.com/scozv/bolero/commit/b0a5fd3c3ab58159305711e6e0f742786fccc30b)。

目前提供如下的接口实现：

{% highlight scala %}
trait CanConnectDB2[T] {
  // 查询所有的T
  def list(db: DB): Future[Seq[T]] = ???
  // 查询一个指定_id的T
  def one(db: DB, id: String): Future[Option[T]] = ???
  // 查询指定_id的T的一个字段
  def field[B](db: DB, id: String, fieldName: String): Future[Option[B]] = ???
  // 查询一系列T的指定字段的所有值
  def sequence[B](db: DB, selector: JsObject, fieldName: String): Future[Seq[B]] = ???
  // 插入一条T
  def insert(db: DB, document: T): Future[WriteResult] = ???
  // 更新符合selector条件的一系列T
  def update(db: DB, selector: JsObject, update: T): Future[UpdateWriteResult] = ???
  // 更新指定_id的T
  def edit(db: DB, id: String, update: T):Future[UpdateWriteResult] = ???
}
{% endhighlight %}

## 基于Token的用户认证

`Bolero`的所有接口都是无状态的，识别用户的方式，就是通过Authentication Token。
在Google中搜索该名词，可以了解更多，也可以找到`auth0`的帖子 [^auth0_token]。

我正在写一篇关于Token认证的帖子[^scozv_blog_auth_token]，
目前还没有完成，你可以在参考文献中找到该帖子的草稿。

此处有提醒：

> 我对安全认证这一领域，还是很多不了解的地方。`Bolero`对Token认证的实现不能保证100%
> 安全，我还在不断地改进中。

在`Bolero`里面，使用了`Play!`提供的
Action composition [^play_composition] 来完成Token认证。

具体的实现，参考`controllers.CanAuthenticate.scala`。

# 测试代码详解

> **测试非常重要 [^scozv_blog_jira]，完备的测试是重构和持续集成的基础。**
>
> **测试非常重要，完备的测试是重构和持续集成的基础。**
>
> **测试非常重要，完备的测试是重构和持续集成的基础。**

测试的[源代码](https://github.com/scozv/bolero)见`test`目录。

## 测试文件的结构

{% highlight sh %}
.
├── test
|   ├── WithApplication.scala         // 升级至Play 2.4之后，使用旧版的WithApplication
|   ├── CanConnectDB.scala            // 连接到测试数据库
|   ├── CanFakeHTTP.scala             // 伪造HTTP Request
|   └── BoleroApplicationSpec.scala   // 具体的测试脚本，可以将不同的测试逻辑分割成不同的文件

{% endhighlight %}

## 测试的无状态

测试的脚本，要保证在任何库上都能通过，当然，这和测试用例的设计有关。

通常，我们在测试开始时，准备数据，在测试完成之后，清理测试数据。

## `CanFakeHTTP`——不依赖任何客户端的`RESTful`测试

基于松耦合的原则，`RESTful`服务的开发流程中，不应该依赖前端View的开发进程。
所以，我们使用`CanFakeHTTP`模拟HTTP Request。

# 发布和部署介绍

使用`Bolero`的一个生产环境目前部署在`Ubuntu 14.04`上面。

部署脚本，可以参考`deploy.sh`，最好在`Ubuntu 14.04`上运行。该脚本
使用了`sbt-native-packager` [^scala_sbt_native] 作常驻发布。

另外，在实际的使用中`Bolero`的生产配置对开发是不可见的。
我通常会使用多个`git repo`来托管源代码（假定项目代号为`PJ`）：

{% highlight bash %}
pj-docs                 # 文档中心，使用`Markdown`来写项目的所有文档
pj-core-restful         # 本文的主要内容，使用`Bolero`代码模板
pj-core-web             # 核心的Web建模，使用`TypeScript`建模
pj-client-web           # View层，通用的用户访问页面，使用`pj-core-web`
pj-client-device        # View层，App客户端
pj-client-console       # View层，系统的后台管理平台，使用`pj-core-web`
pj-deploy               # 以上所有`repo`的发布配置脚本，对开发不可见
pj-data                 # 生产环境的数据备份，对开发不可见
{% endhighlight %}

# 参考文献

[^play_json]: [`Play!` JSON Reads/Writes/Format Combinators](https://www.playframework.com/documentation/2.5.x/ScalaJsonCombinators)
[^play_json_auto]: [`Play!` JSON automated mapping](https://www.playframework.com/documentation/2.5.x/ScalaJsonAutomated)
[^rest_http_method]: [Using HTTP Methods for RESTful Services](http://www.restapitutorial.com/lessons/httpmethods.html)
[^mdn_cors]: [HTTP access control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
[^w3_cors_multi_issue]: [5.1 Access-Control-Allow-Origin Response Header](https://www.w3.org/TR/cors/#access-control-allow-origin-response-header) from w3.org
[^play_filter]: [`Play!` Filters](https://www.playframework.com/documentation/2.5.x/ScalaHttpFilters)
[^play_rqst_header]: [`play.api.mvc.RequestHeader`](https://www.playframework.com/documentation/2.5.x/api/scala/index.html#play.api.mvc.RequestHeader)
[^auth0_token]: [Cookies vs Tokens. Getting auth right with Angular.JS](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/)
[^scozv_blog_auth_token]: [对登录和基于Token的认证机制的理解（草稿）](https://github.com/scozv/blog/blob/master/_drafts/2016-05-12-understanding-of-login-and-the-token-based-authentication.md)
[^scozv_blog_archi]: [基于低耦合和持续集成的Web架构](https://scozv.github.io/blog/zh/pattern/2016/05/05/a-low-coupling-architecture-of-the-web-solution-with-continuous-integration)
[^oracle_mask]: [Oracle Data Masking and Subsetting Pack](http://www.oracle.com/technetwork/database/options/data-masking-subsetting/overview/index.html)
[^scala_try]: [`scala.util.Try`](http://www.scala-lang.org/api/2.9.3/scala/util/Try.html)
[^play_composition]: [`Play!` Action composition](https://www.playframework.com/documentation/2.5.x/ScalaActionsComposition)
[^scozv_blog_jira]: [Bitbucket Cloud的Issue至JIRA Server的完全迁移指南](https://scozv.github.io/blog/zh/guide/2016/04/05/fully-migrating-from-bitbucket-cloud-issue-system-to-jira-server)
[^scala_sbt_native]: [Debian Plugin]([^scala_sbt_native])
[^scozv_git_goods]: [`models.Goods`](https://github.com/scozv/bolero/blob/master/app/models/Goods.scala#L28)
[^lagom_issue1]: [`Lagom` issue #1 Add Scala API](https://github.com/lagom/lagom/issues/1)
[^scozv_bolero_issue1]: [`Bolero` issue #1 monad ModelOrError needed](https://github.com/scozv/bolero/issues/1)
