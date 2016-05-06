---
layout: post
title: "A Low Coupling Architecture of the Web Solution with Continuous Integration"
description: ""
category: "help"
tags: ["CI", "architecture"]
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 本文将要解释，我目前以及未来在项目实践中，将会一直实践的两个概念：低耦合与持续集成
>
> 本文还没有完全的写完。
>
>
> This article will discuss two core ideas for a Architecture of the Web Solution,
> that is Low Coupling and Continuous Integration.
>
> This article is still on the writing.

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# 两个核心概念：低耦合与持续集成

低耦合与持续集成这两个概念，是我目前以及未来在项目实践中，
会应用，而且必须应用的两个核心概念。

简单地讲：

* 低耦合：将系统中的各个**节点**（参看术语），分别独立起来，相互之间无所依赖，
  不需要关心对方的具体实现方式
＊持续集成：节点相互独立之后，如何保证：
   0. 各个节点本身的功能正常
   0. （系统全局而言）节点之间如何交互，进而协同工作

# 完全独立的低耦合
## 节点的定义

为了便于阅读，我定了“节点”这个概念：

节点可以是一个抽象的概念，比如`MVC`中的`View`；
节点也可以是一个物理的部署，比如一个物理部署的数据库服务。


节点的封装，没有固定的模式，主要取决于系统层面的宏观考量（后面的章节会详细阐述）。
比如，就`MVC`的三个部分而言，我们可以：

0. 将`MVC`整体放到一个节点中去实现，比如利用`ASP .NET MVC`，将数据库和整个Web服务部署在一起；
0. 将`MC`和数据库放到一个节点中去，将视图`View`放到另外的节点。
   前面的那个节点，可以做成`RESTful API`，后面的那个节点，可以用静态页面，或者移动`App`来绘制；
0. 我们还可以将数据库独立成第三个节点，比如购买一个`PaaS`的数据库实例；
0. 我们还可以将数据库拆分为二，一个数据库节点用来存储核心数据，另外一个用来存储用户行为分析的数据；
0. 我们甚至可以将用户行为分析的数据库和`View`组成一个节点。

以上节点的封装，如下图所示（使用[ASCIIFlow Infinity](http://asciiflow.com/)绘制）：

```
####################################  scenario 01, entire node

+------------+              +-----------------+
| you and me |              | IIS / tomcat    |
| Chromium   +------------> | ASP .NET MVC    |
|            |              | Database        |
| mobile     |              |                 |
| device     |              |                 |
+------------+              +-----------------+


####################################  scenario 02, separating View from MV+C

+------------+              +-----------------+                      +--------------------+
| you and me |              | View            |    HTTP Request      | RESTful API        |
| Chromium   +------------> | React.js        +--------------------> | http://spray.io/   |
|            |              | static HTML page|                      |                    |
| mobile     |              | mobile App      |                      | Database           |
| device     |              |                 |                      |                    |
|            |              |                 | <--------------------+                    |
+------------+              +-----------------+    HTTP Response     +--------------------+


####################################  scenario 03, separating Database from MV

+------------+              +-----------------+                      +--------------------+
| you and me |              | View            |    HTTP Request      | RESTful API        |
| Chromium   +------------> | React.js        +--------------------> | http://spray.io/   |
|            |              | static HTML page|                      |                    |
| mobile     |              | mobile App      |                      |                    |
| device     |              |                 |                      |                    |
|            |              |                 | <--------------------+                    |
+------------+              +-----------------+    HTTP Response     +-+------------------+
                                                                       |
                                                                       |
                                                                       |
                                                                       |  connection
                                                                       |  string
                                                                       |
                                                                       |
                                                                     +-+------------------+
                                                                     | PaaS               |
                                                                     | Database+aaS       |
                                                                     |                    |
                                                                     |                    |
                                                                     |                    |
                                                                     |                    |
                                                                     +--------------------+


####################################  scenario 04, multiple Databases

+-------------+             +-----------------+                      +--------------------+              +--------------------+
| you and me  |             | View            |    HTTP Request      | RESTful API        |              | PaaS               |
| Chromium    +-----------> | React.js        +--------------------> | http://spray.io/   +--------------+ Database+aaS       |
|             |             | static HTML page|                      |                    |  connection  |                    |
| mobile      |             | mobile App      |                      |                    |  string      | Core Business      |
| device      |             |                 |                      |                    |              |                    |
|             |             |                 | <--------------------+                    |              |                    |
+-------------+             +-----------------+    HTTP Response     +-+------------------+              +--------------------+
                                                                       |
                                                                       |
                                                                       |
                                                                       |  connection
                                                                       |  string
                                                                       |
                                                                       |
                                                                     +-+------------------+
                                                                     | PaaS               |
                                                                     | Database+aaS       |
                                                                     |                    |
                                                                     | user agent data    |
                                                                     |                    |
                                                                     |                    |
                                                                     +--------------------+


####################################  scenario 05, separating and combination

+------------+              +-----------------+                      +--------------------+              +--------------------+
| you and me |              | View            |    HTTP Request      | RESTful API        |              | PaaS               |
| Chromium   +------------> | React.js        +--------------------> | http://spray.io/   +--------------+ Database+aaS       |
|            |              | static HTML page|                      |                    |  connection  |                    |
| mobile     |              | mobile App      |                      |                    |  string      | Core Business      |
| device     |              |                 |                      |                    |              |                    |
|            |              |                 | <--------------------+                    |              |                    |
+------------+              +-----------------+    HTTP Response     +--------------------+              +--------------------+
                            | Database        |
                            |                 |
                            | user agent data |
                            |                 |
                            |                 |
                            |                 |
                            +-----------------+

```

## 独立的Server

我们将业务的处理，独立成一个`RESTful API`的`Server`。

## 独立的View

我们将用户页面的展示独立出来。

## 各个独立部分的测试

`RESTful API`的测试可以`mock` 一系列的`HTTP Request`进行，从而
不依赖于用户页面的实现方式。

反之，用户页面的测试，可以`mock`  一系列的`HTTP Response`，从而不依赖于服务的实现方式。

## 独立节点的交互

不同节点的交互，需要有一个统一的接口文档，比如一份`RESTful API`的接口文档。
每一个接口需要指定如下的接口信息：

* HTTP Method，比如`GET`、 `POST` 、`DELETE` 、`PUT`等
* URL
* Payload ，需要传递给Server的数据，
* HTTP Response，返回给Client的数据
* HTTP Header，可选

接口文档是不同节点交互的唯一桥梁，节点之间不需要了解对方节点具体实现的细节。

## 独立的程度

节点的独立程度，取决于系统整体的考量，从上面的几个scenario可以看出，
我们既可以把数据库放在某一个节点之内，也可以把他独立出来。

# 独立与集成

## 低耦合与持续集成之间的矛盾

低耦合将节点独立开来，为了让节点之间能够协同工作，
我们需要保证：

* 节点本身是功能正常的
* 节点完全参照接口文档

## 构造多个独立节点协调性的测试方案

参照接口文档，各个节点可以`mock`需要获得的数据，比如，

* `RESTful API`的测试可以`mock` 一系列的`HTTP Request`
* View的测试，可以`mock`  一系列的`HTTP Response`

# 完备的持续集成

## 独立节点的完备测试

[之前的文章](http://scotv.github.io/help/2016/04/05/fully-migrating-from-bitbucket-cloud-issue-system-to-jira-server#continuous-integration)中也提到：

* 需要完成单元测试
* 需要`mock`，从而完成一系列的BDD测试
* 核心建模的测试覆盖率需要达到100%
* 尽可能地引入UI测试

## 持续的代码提交流程

[之前的文章](http://scotv.github.io/help/2016/04/05/fully-migrating-from-bitbucket-cloud-issue-system-to-jira-server#continuous-integration)中也提到：

* commit 和 issue需要相互关联，以便追溯
* 关闭的issue，不再接受commit
* 每一次commit，需要被测试验证

## 持续的发布流程

# 总结

## 抽象的概念应该先于具体的技术实现

当我们提到`MVC`的时候，不能一味的把`MVC`看成一个不可分割的整体。这三个字母只是一个概念。

具体的技术实现是在其之后的。如果将具体的技术实现放到第一位，往往会限制我们的思想。

## 技术是一个工具

就如设计模式和语言没有什么关系一样（[参考文章](http://coolshell.cn/articles/8961.html)），
技术也是概念的一个实现。

当然，技术作为工具，在实现某一个抽象的概念的时候，有的可以更加便利的实现。

## 在低耦合节点中更换技术

独立的节点，允许，节点本身更换，具体的技术，因为，对于其它节点而言，本身只需要按照接口文档去实现就好了。

## 持续集成保证低耦合节点的交互
