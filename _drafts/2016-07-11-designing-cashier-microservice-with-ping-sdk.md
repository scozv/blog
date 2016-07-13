---
layout: post
title: "使用Ping++设计可供集中收银的微服务"
description: ""
category: "pattern"
tags: ["ping++","microservice","scala"]
lang: "zh"
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 使用Ping++可以快速接入不同的支付渠道。
> 通常情况下，每一个应用需要在Ping++后台系统中，对应地创建一个应用，
> 用来调用Ping++的接口。
>
> 本文尝试设计这样的解决方案——该方案仅有一个Ping++应用，但同时满足多个（独立）应用的支付场景。
> 本文提到的解决方案，目前处在设计阶段。
>
> 本文将提到如下话题：
>
> * 使用Ping++完成一般的支付流程
> * 来自百货大楼购物的启发
> * 设计可供集中收银的微服务
>
> 本文的不足之处在于：
>
> * 对微服务的理解还停留在概念阶段
> * 暂时还未涉及退款、提现流程

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}


# 术语和总则

为了便于阅读和理解，我解释一下文中将会出现的如下名词：

## 应用

应用是一个很抽象的名词，可以是一个功能简单的计算器软件，也可以是一个
功能丰富的个人财务管理软件：小到一个程序，大到一个系统。

应用也有不同的表现形式，可以是一个可执行文件、一个Web，或者是一个安装在智能手机（设备）
上的App。

本文的应用，通常：

* 具有完整业务流程的一个系统
* 它有`View`表现页面
* 它有后台服务
* 不同的应用，在业务上没有重合的地方

## 应用的`View`层

我在之前的文章（参考）提到：`View`和后台服务应该完全独立（代码、开发、部署都要独立），
这里的`View`就是应用的表现形式，在下面的文章中：

* 用户的操作，都在`View`层进行
* 客户端，通常就是指`View`层

## 应用的后台服务：`RESTful Server`

我建议应用的所有后台服务，都应该封装成`RESTful API`的形式，在下面的文章中，
如下的名词，应该都是指应用的后台服务：

* 服务端
* `RESTful Server`
* 后台服务

## Ping++应用

可以在Ping++管理平台创建一个或者多个Ping++应用，每一个Ping++应用，都有一个`app_id`。
每一个Ping++应用里面，可以配置独立的支付渠道。

## 集中收银

本文想要设计的集中收银解决方案，最终创建一个Ping++应用，
完成多个独立应用的支付需求。

# 使用Ping++完成一般购物的支付流程

可以先去阅读官方的[支付流程说明](https://www.pingxx.com/docs/overview/flow/charge)。

## 支付流程示意图

如下的示例图，将以购物为例，更详细地解释支付流程。

## 将购物流程一般化

上面的示意图流程，整理为：

0. 客户端选择一系列（数组）的购买商品
0. 客户端向RESTful Server申请订单
0. RESTful Server向客户端Response返回带有订单编号的订单数据
0. 客户端使用订单数据向RESTful Server申请Ping++的支付票据（Charge对象）
0. RESTful Server向Ping++服务器，请求Charge对象
0. RESTful Server收到Ping++服务器的Response，同时将Charge对象传递给客户端
0. 客户端拿到Charge对象，调用Ping++ Client SDK开始支付
0. （以下为异步流程）
0. Ping++服务器确认支付结果之后，向RESTful Server发送一个POST请求，告知结果
0. RESTful Server接收到这个Webhook之后，修改订单的支付状态

两点要说明的：

0. 对于任何的支付流程，我们都可以尝试包装成上述的流程，比如在电子阅读平台，“支付并阅读”这个按钮，
是没有挑选商品到购物车流程的，我们可以将上述流程中的一系列变换为“包含一个元素的数组”。参考下面的
订单类的设计
0. RESTful Server可以按照功能，拆分成不同的服务，参考下面的收银微服务的设计

## 订单类的设计

目前在用的设计如下，只列出重要的属性（Property），从最上层订单类到所购商品：

{% highlight scala %}

class Order {
  cart: List[CartItem]
}

class CartItem {
  purchasedProducts: GenericProduct
  quantity: Int
}

interface GenericProduct {
  productTitle: String
  price: Double
}

{% endhighlight %}


对于上面提到的“支付并阅读”这类的流程，
最终的`Order`实例满足`cart`数组只有一个元素：

{% highlight scala %}

singleItemOrder should be instanceOf Order
singleItemOrder.cart shoule be size(1)

{% endhighlight %}

# 设计可供集中收银的微服务

## 来自百货大楼购物流程的启发

百货大楼购物，通常都在收银台付款，而非店铺中，流程可以整理为：

0. 用户在店铺购物，确认购物车
0. 用户使用购物车，在店铺开具购物小票
0. 用户凭店铺的购物小票前往收银台
0. 用户支付并得到支付成功的凭证
0. 用户使用支付凭证，回到店铺完成购物

启发就是：

* 将百货大楼的每一个店铺看作一个应用
* 将唯一的一个收银台，设计成微服务，用来和Ping++联系
* 将支付模块，从应用上面独立出来

## 一个微服务并不是微服务（参考）

一个微服务并不能形成一个完整的系统（应用），设计的收银台微服务，
还需要和其它模块、其它的微服务相互交互，就购物支付流程而言，我们至少还需要：

* 基础服务，比如`GET /products`等基本信息
* 订单服务，用来生成订单编号、控制订单的状态等

## 收银中心的微服务设计

## 微服务设计示意图

## `RESTful API`接口设计
