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

> 本文介绍一套`基于RESTful API为导向的软件开发流程，主要的步骤为：
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

# 适用场景介绍



本文将介绍一种，基于RESTful API为导向的开发模式。

这种模式，适合：

前后端分离的项目

这种分离，是完全独立的开发，不同的repo不需要知道各自的源代码。
节点之间的沟通，只通过API来交互。

步骤简介（假定产品的设计已经完成，用户页面的设计稿已经出来），则：

分析每个页面，开始设计初步的RESTful API
测试那边同步写各个页面的用例




我们从页面入手，便于开发尽快地进入需求。我们考虑每一个功能点。
