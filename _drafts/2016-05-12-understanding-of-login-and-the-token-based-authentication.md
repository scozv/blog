---
layout: post
title: "对登录和基于Token的认证机制的理解"
description: ""
category: "pattern"
tags: [auth, algo, token, security]
lang: zh
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 本文首先抛开具体的技术，描述了我对“登录”的理解。之后会介绍基于`Token`的认证方式
>
> This article will talk about what the LOGIN really is. And,
> introduce the Token Based Authentication

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# 对登录的理解

## 房屋租赁

我们首先来看看，房屋租赁这个事情。通常而言，确定好了租房这个事情之后，
我们需要做两件事：

* 和房东签订租赁合同；
* 拿到钥匙

通常而言，租赁合同有一定的期限，超过之后，我们得续租，或者退租。而，我们拿到的钥匙，
就是未来打开房门的通行证。

{% highlight raw linenos %}
+-----------+                         +------------+
|           | need a appartment rent  |            |
|   Guest   +-----------------------> |    Host    |
|           |                         |            |
|           | <-----------------------+ Appartment |
|           | Ok, we make a deal and, |            |
+-----------+ here is the KEY to door +------------+


+-----------+                         +------------+
|           | I can use THE KYE to    |            |
|   Guest   |       open THE door     | Appartment |
|           +-----------------------> |            |
|           |                         |            |
|           |                         |            |
+-----------+                         +----------+-+
                                                 |
                           He or she has THE KEY |
                                                 |
                                      +----------+-+
                                      |            |
                                      |    Host    |
                                      |            |
                                      |            |
                                      |            |
                                      +------------+

{% endhighlight %}


需要注意的是，如果钥匙丢了，或者租客被恶意劫持了，这把钥匙还是能够正常的
开启房门。


## 登录和房屋租赁的关系

一个登录过程，和房屋租赁的过程类似。

参考该文献[^A0_140107]的图示[^A0_140107_a1]。


## 无状态

要知道，房屋那边没有记录用户的相貌，没有记录用户的作息时间。只要钥匙能打开房门，
我们就认为，持钥匙的人是合法的用户。

我们称之为无状态。

# 对安全的讨论



# 参考文献

在房屋租赁那个小节，我们说：

> 如果钥匙丢了，或者租客被恶意劫持了，这把钥匙还是能够正常的
开启房门。

我们的措施是：……

[^A0_140107]: [Cookies vs Tokens. Getting auth right with Angular.JS](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/) by Alberto Pose [OL]
[^A0_140107_a1]: [Cookie-based Auth vs Token-based Auth](https://docs.google.com/drawings/d/1wtiF_UK2e4sZVorvfBUZh2UCaZq9sTCGoaDojSdwp7I/edit?pref=2&pli=1)
