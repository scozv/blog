---
title: "Bolero, Cumulative Update (Sep 04, 2016)"
postSlug: bolero-p2-updates
pubDatetime: 2016-09-05 02:41:16+08:00
description: ""
category: "guide"
tags: ["scala", "scaffold", "project", "architecture", "restful"]
lang: "en"
---

{% include JB/setup %}

# 摘要

{:.no_toc}

> This article gives a short description on cumulative update of `Bolero`.
> For the entire project details, please read previous post [^blog_bolero]。
>
> You may find the source code of `Bolero` on [scozv/bolero](https://github.com/scozv/bolero).

<!--more-->

- Will be replaced with the ToC, excluding the "Contents" header
  {:toc}

# Conventions and Rules

The conventions or rules in `Bolero` may not be the best practice:

- Naming most `trait` with the initial `Can`, in order to state it has some sort of ability,
- `interop` directory was used for inter-operating between 3rd party API, at beginning,
- `_id` means primary key, and it is `String`.

## Uniform HTTP Response

All HTTP Response return uniform `JSON` as below:

{% highlight raw %}
{
ok: Boolean,
data: T,
error: String
}
{% endhighlight %}

## Consistency in payload and Response

Inspired by `map()`, `Bolero` keeps consistence between `payload`
and Response data.

For instance:

{% highlight raw %}
PUT /transaction

// Request
// header: Token for authentication
payload: "Bolero.models.Transaction"

// Response
data: "Bolero.models.Transaction"
{% endhighlight %}

Only difference is `_id` in `payload` is empty, while `_id` in Response
will be generated.

# Refactor and Enhancement

## `CanConnectDB2`

`CanConnectDB2` provides more generic `MongoDB` I/O abilities with `implicit`.

## Separated `CanBeHierarchic`

`Hierarchic` handles the connection relationship with `union-find` algorithm。

`CanBeHierarchic` has been separated into `CanBeHierarchicInstance` and `CanBeHierarchicObject`.

See:

{% highlight raw %}
https://github.com/scozv/bolero/commit/ea24ab2c443a802145488b81c15e2fa7266492ae
{% endhighlight %}

## Global Setting for `Action Not Found`

`Bolero` will return `{ok: false, error: '100'}`
when `Action Not Found`

{% highlight raw %}
https://github.com/scozv/bolero/commit/e8991bc146adeabaf5d5f713f253a2a6fa1fe950
{% endhighlight %}

## Improvement of `ResponseOk`

`Bolero` uses `implicit writes`, in order to avoid
`Json.toJson` manually of parameters.

## Clear `unused import`

`unused import` has been cleared.

# Unsolved Issue

## Compiling Triggered After Service Started

When `output` (`activator run` or from IntelliJ IDEA) said _service has been running on `9000`_,
the refresh compile will still be invoked at the firstly API access.

## Test Failed After Many Codes Changed

When many codes have been changed, test will be failed
unless we `run` a service to trigger a refresh compile.

## Test DB and Development DB

The `FakeHTTPRequest` of `WithApplication` may use the `DB` connection in `application.conf`.
So that we cannot reconfigure the `DB` in our test case.

# References

[^blog_bolero]: [Bolero, a RESTful Scaffold with Scala, Play! and ReactiveMongo](https://scozv.github.io/blog/guide/2016/07/27/bolero-a-restful-scaffold-with-scala)
