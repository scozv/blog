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

> 声明和未来可能出现在毕业论文的潜在重复

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
## 节点

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

以上节点的封装，如下图所示：

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

## 独立的View

## 各个独立部分的测试

## 独立节点的交互

## 独立的程度

UI部分可以部署一个DB节点

# 独立与集成

## 低耦合与持续集成之间的矛盾
## 构造多个独立节点协调性的测试方案

# 完备的持续集成

## 独立节点的完备测试
## 持续的代码提交流程
## 持续的发布流程

# 总结

## 抽象的概念应该先于具体的技术实现

## 技术是一个工具

就如设计模式和语言没有什么关系一样，技术也是概念的一个实现。

## 在低耦合节点中更换技术

## 持续集成保证低耦合节点的交互
