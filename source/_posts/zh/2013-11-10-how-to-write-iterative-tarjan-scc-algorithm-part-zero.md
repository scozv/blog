---
layout: post
title: "迭代版本的Tarjan强连通算法（一）"
description: ""
category : "algo"
tags: ["algorithm", "graph", "dfs"]
lang: zh
---
{% include JB/setup %}

> 上个月我完成了迭代版的Tarjan强连通算法（参见 [Tango.js] [1] ） 。这一个系列的文章将解释这一过程和相关代码——包括迭代图遍历、迭代拓扑排序和Kosaraju强连通算法以及最后的迭代Tarjan算法三部分。本文先讲迭代图遍历。
>
> 本文大部分的解释（以及伪代码）需要阅读英文版本。


<!--more-->

<a name="pi">
</a>

<div class="post-content lang zh-cn">

递归在某些程度上来说，很适合理解（只要找出递推公式），写起来也简单（因为它是递归）。我看过Erlang的一些介绍，这门函数式编程语言，在编译器的支持与优化下，很适合用递归。
<br />
<br />
递归的调用需要栈（Call Stack）来维护。碰到一些栈上有容量限制的语言，比如Python、JavaScript等，要么扩大栈的容量，或者如本系列文章这样，尝试将递归转化成迭代。
<br />
<br />
上面提到的深度优先查找（DFS），转化起来比较容易；而在我们第三部分将要提到的Tarjan强连通算法，转化起来就费了不少的心思（参见 <a href="https://github.com/scozv/algo-js/issues/14" target="_blank">issue #14</a>）。
<br />
<br />
当然，我认为，能够用递归的地方应该尽量用，尤其在函数式编程语言中。本系列的递归到迭代的转化，一来解决JavaScript的函数栈的容量问题，二来可以帮助我理解强连通算法。
<br />
<br />
下一篇我会整理一下拓扑排序的迭代转化，并将其应用到Kosaraju强连通算法中。

</div>

<br />

[1]: https://github.com/scozv/tango	"Tango.js"
[2]: http://blog.moertel.com/posts/2013-05-11-recursive-to-iterative.html		"Recursive to Iterative by Tom Moertel"
[3]: https://github.com/scozv/algo-js/issues/8						"Issue 8"
[4]: {% post_url 2013-11-23-how-to-write-iterative-tarjan-scc-algorithm-part-one %} "Tarjan, Part II"
