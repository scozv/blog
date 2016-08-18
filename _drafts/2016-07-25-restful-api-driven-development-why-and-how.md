---
layout: post
title: "基于RESTful API为导向的软件开发流程"
description: ""
category: "pattern"
tags: ["restful","development"]
lang: zh
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 本文介绍一套基于RESTful API为导向的软件开发流程（以下简称“流程R”），主要的步骤为：
>
> * （假定）需求已经大致确定；
> * 同步进行如下两个步骤：
>   - 测试人员以页面为单位，整理用例（草稿），
>   - 开发人员以页面为单位，按照功能点，整理RESTful接口（1.0）；
> * 尝试整合用例和接口文档，尽量保证测试用例的每一个步骤，都有一个具体的RESTful接口与之对应；
> * 按照功能模块，整合或者重写RESTful接口文档（2.0）；
> * 从RESTful接口文档（2.0）中建立数据模型；
> * 同步进行如下两个步骤：
>   - 逐步实现各个接口，
>   - 同时，按照用例文档编写测试脚本；
> * 前端分析页面，将页面分割成不同的Components；
> * 绘制静态的 Components；
> * 按照功能点，整理页面的事件路由（通过Router来控制事件）文档；
> * 整理和编写前台的事件路由；
> * 尝试按照RESTful 文档（2.0），Mock后台HTTP Response的数据；
> * 联调前后台；
> * 发布与部署。

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# 适用场景

本文介绍一套基于RESTful API为导向的软件开发流程（以下简称“流程R”），先给出流程R适合的场景、假定和局限。

## 松耦合的架构思想

流程R假定项目的框架基于松耦合 [^scozv_blog_archi] 的思想：

* 前后端必须完全分离，数据的交互通过RESTful API进行；
* “完全分离”，意味着，前后端相互之间不需要知道对方的实现细节，数据的交互 **通过而且只能通过** RESTful API进行；

## 开发人员的职能边界

流程R中，假定需求和产品设计已经基本上确定（团队之间适当分工），开发人员按照产品的设计进行架构和开发。
开发人员并不需要考虑

可以使用`Bolero`创建多个服务，不过目前，`Bolero`并不是一个Microservices的框架。
关于微服务，可以关注Lightbend推出的`Lagom`框架，`Lagom`的`Scala`版本正在进行中 [^lagom_issue1]。





# 流程介绍


上述流程中的每一个步骤的耗时可能都不一样，下面挑选几个步骤加以说明。


# 总结

# 参考文献


# 参考文献

[^scozv_blog_auth_token]: [对登录和基于Token的认证机制的理解（草稿）](https://github.com/scozv/blog/blob/master/_drafts/2016-05-12-understanding-of-login-and-the-token-based-authentication.md)
[^scozv_blog_archi]: [基于低耦合和持续集成的Web架构
](https://scozv.github.io/blog/zh/pattern/2016/05/05/a-low-coupling-architecture-of-the-web-solution-with-continuous-integration)
[^scozv_blog_jira]: [Bitbucket Cloud的Issue至JIRA Server的完全迁移指南](https://scozv.github.io/blog/zh/guide/2016/04/05/fully-migrating-from-bitbucket-cloud-issue-system-to-jira-server)
[^lagom_issue1]: [`Lagom` issue #1 Add Scala API](https://github.com/lagom/lagom/issues/1)

本文将介绍一种，基于RESTful API为导向的开发模式。

这种模式，适合：

前后端分离的项目

这种分离，是完全独立的开发，不同的repo不需要知道各自的源代码。
节点之间的沟通，只通过API来交互。

步骤简介（假定产品的设计已经完成，用户页面的设计稿已经出来），则：

分析每个页面，开始设计初步的RESTful API
测试那边同步写各个页面的用例




我们从页面入手，便于开发尽快地进入需求。我们考虑每一个功能点。

