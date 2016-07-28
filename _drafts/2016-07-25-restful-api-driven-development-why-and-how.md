---
layout: post
title: "基于RESTful API为导向的开发模式"
description: ""
category: "pattern"
tags: ["restful","development"]
---
{% include JB/setup %}

本文将介绍一种，基于RESTful API为导向的开发模式。

这种模式，适合：

前后端分离的项目

这种分离，是完全独立的开发，不同的repo不需要知道各自的源代码。
节点之间的沟通，只通过API来交互。

步骤简介（假定产品的设计已经完成，用户页面的设计稿已经出来），则：

分析每个页面，开始设计初步的RESTful API
测试那边同步写各个页面的用例




我们从页面入手，便于开发尽快地进入需求。我们考虑每一个功能点。

