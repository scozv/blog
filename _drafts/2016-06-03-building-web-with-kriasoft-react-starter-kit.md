---
layout: post
title: "Building React Web with Universal Relay Boilerplate"
description: ""
category: ""
tags: []
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

# Code from ...
Start with the codefoundries/UniversalRelayBoilerplate at be44ba2

# express-cassandra 9042 error
for error

{% highlight bash %}
All host(s) tried for query failed. First host tried, 127.0.0.1:9042:
Error: connect ECONNREFUSED 127.0.0.1:9042. See innerErrors.
{% endhighlight %}


search source code and locate the error. try to install the cassandra.
