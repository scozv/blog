---
layout: post
title: "How to Write Iterative Tarjan SCC Algorithm, Part Zero"
description: ""
category : "algo"
tags: ["algorithm", "graph", "stack"]
---
{% include JB/setup %}

> During the work on [Algo.js] [1], I found there is a limitation on recursive stack size of JavaScript. This series posts describe the way to convert recursive Tarjan SCC algorithm to iterative one, containing:
> * Part Zero: Iterative BFS and DFS algorithm on graph;
> * Part One: Iterative topological sort and Kosaraju SCC algorithm on graph;
> * Part Two: Iterative Tarjan SCC algorithm on graph.
>
>
> 上个月我完成了迭代版的Tarjan强连通算法（参见 [Algo.js] [1] ） 。这一个系列的文章将解释这一过程和相关代码——包括迭代图遍历、迭代拓扑排序和Kosaraju强连通算法以及最后的迭代Tarjan算法三部分。本文先讲迭代图遍历。

<!--more-->

## Recursive DFS

It is easy to write down a recursive BFS or DFS algorithm on graph. Take DFS for example:

{% gist 7413740 %}

The call of recursive function is managed by a stack, we may see 'Call Stack', or 'Error Stack' in some IDE tools. Recursive function is brief, and it is easy to understand sometimes. But if there is limitation on stack size, We may try to write it as iterative way.

## Call Stack

Firstly, we see what happen in recursive DFS above, for the graph with only two paths: 

`1 -> 2 -> 3`

`1 -> 4`

we call `DFS(1)`, find `[2, 4]` as adjacent vertex, then we call <code>DFS<sub>1</sub>(2)</code> (notation  <code>DFS<sub>i</sub>(j)</code> means the parent call of `j` in stack is `i`). Next call  <code>DFS<sub>2</sub>(3)</code> finding `[3]` as adjacent vertex of `2` and finish <code>DFS<sub>1</sub>(2)</code>. Finally  call  <code>DFS<sub>1</sub>(4)</code> and finish `DFS(1)`. 

If we have a stack, we push `1` at first, then pop to visit `1`. Push `[4, 2]`, and pop `2`. Next push `[3]` as adjacent vertex of `2` (the stack is `( 4, 3 >` now). Finally pop `3` and `4` to finish search.

Row Index | Recursive Call | Stack Status
:---:|:--------|:--------
 0 | `DFS(1)` | `( 1 >`
 1 | find `[2, 4]` of `1` | `( 4, 2 >`
 2 | <code>DFS<sub>1</sub>(2)</code> | `( 4 >`
 3 | find `[3]` of `2` |  `( 4, 3 >`
 4 | <code>DFS<sub>2</sub>(3)</code> | `( 4 >`
 5 | <code>DFS<sub>1</sub>(4)</code> | `(  >`

(notation `( >` specifies we push and pop from right side)

## Attentions

There are two things we need to pay attentions:
* __Visiting Order__. At row index 1, we push `4` at first, in order to visit graph as same order of recursive call. However this is not very important, I just want to sync the order of iterative way and the order of recursive way. Pushing `4` at first or pushing `2` at first will get correct topological order or SCC, which we are going to find out at following two parts.
* __Vertex Status__. If we have only two paths in graph like: `1 -> 2 -> 3` and `1 -> 3 -> 4`. We have stack like this: 

  Row Index | Recursive Call | Stack Status
  :---:|:---------|:-------- 
  0 | `DFS(1)` | `( 1 >`
  1 | find `[2, 3]` of `1` |  `( 3, 2 >`
  2 | <code>DFS<sub>1</sub>(2)</code> | `( 3 >`
  3 | find `[3]` of `2` |  `( 3, 3 >`
  
  (notation `( >` specifies we push and pop from right side)

  We may notice at row index 3, we push duplicate `3`. So we need a vertex status to mark vertex as being visited or being pushed into stack (see [issue 8] [3]).

## Next

Read code in `graph.search.js` on [Algo.js] [1], and reference [_Recursive to Iterative by Tom Moertel_] [2] for more details on _Recursive to Iterative_. 

Next part of this series, I am going to describe some ideas on iterative topological order algorithm which can be applied on Kosaraju SCC algorithm.

<div class="post-content lang zh-cn">

递归在某些程度上来说，很适合理解（只要找出递推公式），写起来也简单（因为它是递归）。我看过Erlang的一些介绍，这门函数式编程语言，在编译器的支持与优化下，很适合用递归。
<br />
<br />
递归的调用需要栈（Call Stack）来维护。碰到一些栈上有容量限制的语言，比如Python、JavaScript等，要么扩大栈的容量，或者如本系列文章这样，尝试将递归转化成迭代。
<br />
<br />
上面提到的深度优先查找（DFS），转化起来比较容易；而在我们第三部分将要提到的Tarjan强连通算法，转化起来就费了不少的心思（参见 <a href="https://code.google.com/p/algo-js/issues/detail?id=14" target="_blank">issue 14</a>）。
<br />
<br />
当然，我认为，能够用递归的地方应该尽量用，尤其在函数式编程语言中。本系列的递归到迭代的转化，一来解决JavaScript的函数栈的容量问题，二来可以帮助我理解强连通算法。
<br />
<br />
下一篇我会整理一下拓扑排序的迭代转化，并将其应用到Kosaraju强连通算法中。

</div>
 
<br />

[1]: https://code.google.com/p/algo-js											"Algo.js"
[2]: http://blog.moertel.com/posts/2013-05-11-recursive-to-iterative.html		"Recursive to Iterative by Tom Moertel"
[3]:https://code.google.com/p/algo-js/issues/detail?id=8						"Issue 8"
[3]:https://code.google.com/p/algo-js/issues/detail?id=14						"Issue 14"
