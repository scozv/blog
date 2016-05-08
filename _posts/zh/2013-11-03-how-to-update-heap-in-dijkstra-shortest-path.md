---
layout: post
title: "使用Heap数据结构将Dijkstra最短路算法的时间复杂度降到O(n ln m)"
description: ""
category : "algo"
tags: ["algorithm", "graph", "Dijkstra", "heap"]
lang: zh
---
{% include JB/setup %}

> 为了将Dijkstra最短路径算法的时间复杂度从 $$O(nm)$$ 降低到 $$O(n \ln m)$$ ，
> 我们可以使用 __heap__ 。不过迭代中的每一次更新heap的过程，我们需要一些技巧来保持heap的有序性。
> 本文就会指出该技巧，并且解释我在算法代码中的一些[变动] [3]。
>
> 本文大部分的解释需要阅读英文版本。

<!--more-->

<a name="pi">
</a>

<div class="post-content lang zh-cn">

简言之，算法的每次迭代，都是用较小的值去更新原来的heap，
所以我们应该调用 <code>heap.swim()</code> 来维持heap的有序性。

</div>

<br />

[1]: http://en.wikipedia.org/wiki/Heap_(data_structure)#Applications	"Wikipedia"
[2]: https://www.coursera.org/course/algo 								"Algorithms: Design and Analysis, Part 1"
[3]: https://goo.gl/NssHNy                                              "Diff of Algo.js"
