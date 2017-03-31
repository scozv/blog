---
layout: post
title: "纠结于具体的代码实现，不妨准备更完备的测试用例"
description: ""
category: "algo"
tags: ["algorithm","regex","string","pattern"]
lang: "zh"
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 如果我们有如下的一个需求：
>
> * 在数据库中存储带有通配符的匹配规则，比如`*a.com`，
> * 该规则可以匹配出，`s1.a.com`，但是不应该匹配出`a.com`。
>
> 本文将简单介绍两种可行的方法，但是更想强调，在这样的情况下，完备的测试
> 比具体的实现细节更重要。


<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# 需求描述

假如想支持如下四种通配规则（按照规则的先后执行）：

{% highlight bash %}
a.*       -> 1
a-*       -> 2
*.a.com   -> 3
*.a.*     -> 4
{% endhighlight %}

箭头左边的表示通配规则，右边表示，当一个域名（输入参数）匹配的时候，
应该返回什么。

比如，如下两个匹配的例子：

{% highlight bash %}
z.a.com   -> 3
z.a.io    -> 4
{% endhighlight %}

# 两种实现方式

因为有通配符的存在，直接使用`substring`的方式并不可行。

我们可以尝试想把输入参数中的关键字符串（比如 `a`）提取出来，
再构造出匹配规则，最后和数据库相匹配。

## 使用`InternetDomainName`查找关键字符串

因为是域名的匹配，可以使用`InternetDomainName` [^_guava_int_dn]先
提取出根域名。总之，我们假定，我们能找到一个方法，从一个域名里面提出
根域名。

定义该方法为：

{% highlight JavaScript %}
function getRootDomain(domain) {
  // ...
}
{% endhighlight %}

## 构造出匹配规则

已知四种匹配规则，并且也知道了根域名。我们可以拼接成精确的匹配字符串。

示例代码如下：

{% highlight raw %}
function matchAndGetResult(domain) {
  var rootDomain = getRootDomain(domain)
  // rule 1
  if (db.find(`$rootDomain.*`)) return 1
  if (db.find(`$rootDomain-*`)) return 2
  if (db.find(`*.$rootDomain.com`)) return 3
  if (db.find(`*.$rootDomain.*`)) return 4
}
{% endhighlight %}

如果我们适当地写几个测试用例，就会发现，上面的代码是有问题的，比如
如下的测试用例：

{% highlight JavaScript %}
matchAndGetResult('z.a.com') should equal to 3
{% endhighlight %}

但实际上，返回的值确是`1`。

所以我们想了想，又匆匆忙忙得改改代码：

{% highlight raw %}
function matchAndGetResult(domain) {
  var rootDomain = getRootDomain(domain)
  // rule 1
  if (db.find(`$rootDomain.*`) && domain.startWith(`$rootDomain.`))
    return 1
  // ...
}
{% endhighlight %}

这样的方法是可行的，但是会发现两个不足的地方：

* 部分匹配规则需要使用`startWith`，部分匹配规则需要使用`contains()`。
* 如果匹配规则多的话，`if-return` 的次数也会增多。


## 使用正则

对于上面的两个不足，可以总结为：

* 如何判断，字符串匹配的时候，是发生在“开始”，还是“中间”？
* 如何在还原匹配规则的时候，可以匹配更多的情况，减少`if-return`的分支？

我们可以使用正则，因为：

* 正则可以判断字符串匹配的位置；
* 也可以匹配多种情况。

一种实现方式，可以参考如下的示例代码：

{% highlight raw %}
function matchAndGetResult(domain) {
  var rootDomain = getRootDomain(domain)

  if (var dbResult = db.find(`$rootDomain.*`)) {
    // build the regex
    var regex = dbResult
      .string
      .replace('*', '[\\S]*')
      .replace('.', '\\.')

    if (/^$regex/g).test(domain) {
      return dbResult.value
    }
  }
}
{% endhighlight %}

# 优先考虑测试用例的完善

除了以上两种实现，应该还有更好的代码实现。

但本文想要表达的意思是：“有的情况下，完备的测试用例，比代码的具体实现方式（细节）更加的重要”。

我认为本文属于这样的情况：

一来，需求有清晰直观的输入输出值。本文的需求拿到之后，已经可以直接写出一系列的输入输出了。
具体的代码实现，反而需要思考不同的情况。

再者，代码的实现，通常是私有的，内部的方法，而且代码量并不大。不需要过度纠结实现的细节。

最后，代码的实现方式也有很多种，不同的人，有不同的思路，代码的可读性也不同。
该谁做，就用谁的思路。

只要保证，满足所有的测试用例就行了。因此，适当的测试驱动开发，是合理的。


# 总结

上面提到的，代码细节不重要，有一定的限定条件：

* 在某些情况下；
* “不重要”不代表，完全不遵从社区、或者团队之间的开发规范

在这样的限定下，在开发过程中，还有很多优先级，可以排在“精益求精”的代码细节之前的：

* 正确的实现；
* 尽快地实现功能；
* 完备的测试可供检查和重构；
* 等等等等。

# 参考文献

[^_guava_int_dn]: [Explanation of `InternetDomainName`](https://github.com/google/guava/wiki/InternetDomainNameExplained)
