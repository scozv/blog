---
layout: post
title: "Bolero，累积更新说明（2016-09-04）"
description: ""
category: "guide"
tags: ["scala","scaffold","project","architecture","restful"]
lang: "zh"
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 本文是对`Bolero`代码模板的累积更新的说明和解释。
> 有关`Bolero`的整体介绍，请参考早期的文章[^blog_bolero]。
>
>
> `Bolero`的源代码参见 [scozv/bolero](https://github.com/scozv/bolero)。

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# 约定和规范

`Bolero`中的一些命名规则，并不一定是最佳的实践。

* `trait`大部分使用`Can`做前缀，表示具备某一中能力；
* `interop`文件夹最初用来存放一些用于第三方交互的类，目前这个含义已经有些淡化了；
* `_id`表示主键，并使用`String`类型

# 几处重构和增强

## 升级的`CanConnectDB2`

使用了一些`implicit`，完成更加通用的数据库读写操作。同时
限定了一些泛型方法的返回值。

具体请参见源代码。

## 拆分`CanBeHierarchic`

`Hierarchic`在未来，可以使用并查集维护关联关系。

目前拆分成两个`trait`，分别对应静态属性和实例属性。

参考：

{% highlight raw %}
https://github.com/scozv/bolero/commit/ea24ab2c443a802145488b81c15e2fa7266492ae
{% endhighlight %}

## 全局的`Action Not Found`处理

将`Action Not Found`的异常，统一交给`ResponseError`类处理。

{% highlight raw %}
https://github.com/scozv/bolero/commit/e8991bc146adeabaf5d5f713f253a2a6fa1fe950
{% endhighlight %}

## 增强了`ResponseOk`的功能

使用`implicit writes`，避免了参数传入`ResponseOk`
之前，还要手动`Json.toJson`的问题。

## 清理`unused import`

清理了多处`unused import`。

# 未能解决的问题

## 服务启动之后的编译

我发现，不管通过`activator run`还是IntelliJ IDEA启动`Play!`，
命令行提示，服务已经在`9000`端口开启了。

但是初次访问接口，依然会触发新的编译。

## `routes`更新之后，需要`run`过，才能测试

`routes`变更，或者代码变更很多，直接跑测试，可能没有触发最新的编译。
建议，后台常驻启动一个`9000`端口的`run`。

## 测试和调式数据库没有分离

目前发现，`WithApplication`里面的模拟HTTP Request将使用`application.conf`
的配置。导致，没法另外指定测试数据库。

# 参考文献

[^blog_bolero]: [Bolero——基于Scala、Play!和ReactiveMongo的RESTful代码模板](https://scozv.github.io/blog/zh/guide/2016/07/27/bolero-a-restful-scaffold-with-scala)
