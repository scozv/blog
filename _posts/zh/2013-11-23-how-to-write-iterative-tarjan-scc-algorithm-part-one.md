---
layout: post
title: "迭代版本的Tarjan强连通算法（二）"
description: ""
category: "algo"
tags: ["algorithm", "graph", "scc"]
lang: zh
---
{% include JB/setup %}

> 上一次，我们提到了迭代深度优先查找（DFS）——用一个叫frontier的栈来保持访问顺序。今天，我们将看到迭代拓扑排序以及Karasoju强连通算法。
>
>
> 今天的重点在于，我们会增加一个栈，名为head。当父节点的所有后代都访问过之后，应该满足head.peek() === frontier.peek()。
>
> 本文大部分的解释（以及伪代码）需要阅读英文版本。

<!--more-->

<a name="pi">
</a>

<div class="post-content lang zh-cn">
拓扑排序的时候，需要记录当前访问的点，是从哪个父节点下来的。所以我们增加了一个叫head的栈，用来记录这个信息——当两个栈（frontier和head）的peek元素相同时，就意味着，父节点下面已经没有节点可以继续访问了，此时相当于一层递归的DFS结束。
<br />
<br />
需要留意的是，同一个节点可能来自不同的父节点：比如有两条边3 &#8594; 2和5 &#8594; 2。那么节点2可能有两次push进frontier，所以在处理的时候需要留意节点的状态。显而易见地，如果某一个节点已经被标记了拓扑顺序，那么它就不应该再次被标记，也就是说，它就不应该再次进入head栈。
</div>

<br />

[1]: https://www.coursera.org/course/algo          "Online course by Tim Roughgarden"
[2]: https://github.com/scozv/algo-js/issues/20        "Issue 20"
[3]: https://github.com/scozv/tango  "Tango.js"
[4]: {{ BASE_PATH }}{{ LANG_PATH }}{% post_url 2013-11-10-how-to-write-iterative-tarjan-scc-algorithm-part-zero %} "Tarjan, Part I"
