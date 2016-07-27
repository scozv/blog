---
layout: post
title: "Bolero——基于Scala、Play!、ReactMongo的RESTful代码模板"
description: ""
category: "guide"
tags: ["scala","scaffold","project","architecture","restful"]
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 本文介绍一套`RESTful`的代码模板（代号：`Bolero`）——使用`Scala`语言，基于`Play!`库以及`ReactMongo`。
>
> 除了基本的HTTP Request和Response处理、MongoDB的异步读写之外，`Bolero`还包含如下功能：
>
> * `Model`的几个建议；
> * `RESTful API`设计的几个建议；
> * `CORS`跨域配置；
> * 基于`Token`认证的Request处理；
> * 全局范围内设计的一套Monad规则：`HTTPResponseOrError`；
> * 接收Webhook；
> * 基于`Specs2`的`FakeApplication`集成测试；
> * 基于`sbt-native`的发布脚本。
>
> 本文（尤其是阅读源代码）需要有一定的`Scala`语言基础，需要对Monad有初步的理解。
> 最好能够（熟练地）使用`Future[T]`。
>
> `Bolero`目前主要基于`Play!`框架，但是不包含任何View的部分，所有的Action都返回`JSON`对象。
> 我计划用`Spary.io`代替`Play!`。
>
> `Bolero`的源代码参见 https://github.com/scozv/bolero

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# `Bolero`设计的基本理念

本文介绍的这一套`RESTful`的代码模板，代号为`Bolero`，以下就将该套模板
称为`Bolero`。`Bolero`的源代码参见：

https://github.com/scozv/bolero

先来看`Bolero`设计的一些基本理念。

## 松耦合的架构思想

`Bolero`基于松耦合（参考）的思想，就前后端分离而言：

* `Bolero`只负责后端，我没有使用`Play!`提供的`View`引擎，并且计划使用`Spary.io`代替`Play!`；
* 作为后台服务，`Bolero`保证所有的HTTP Response都是`JSON`格式，都使用`RESTful`的方式呈现。

可以使用`Bolero`创建多个服务，不过目前，`Bolero`并不是一个Microservices的框架。
关于微服务，可以关注Lightbend推出的`Lagom`框架，`Lagom`的`Scala`版本正在进行中（参考）。

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


## `RESTful API`设计的几个建议

### `RESTful API`的几个要素
### 一致的Payload和Response设计

受到`Scala.map()`的启发

### 限制跨域还是开放跨域

### 名词、排序以及单复数

# 开发代码详解

# 测试代码详解

## 测试的无状态

在任何库上都能通过，当然，这和测试用例有关。

清理测试数据。

# 发布和部署介绍

## 生产环境的配置对开发者不可见

目前的`repo`架构通常是：

# 参考文献

[^play_json]: [JSON Reads/Writes/Format Combinators](https://www.playframework.com/documentation/2.6.x/ScalaJsonCombinators)
