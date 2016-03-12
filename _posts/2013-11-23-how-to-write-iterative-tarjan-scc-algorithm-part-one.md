---
layout: post
title: "How to Write Iterative Tarjan SCC Algorithm, Part II"
description: ""
category: "algo"
tags: ["algorithm", "graph", "SCC"]
---
{% include JB/setup %}

> In [previous part] [4], we talked about iterative DFS, where we use a stack named  __frontier__ to keep the visiting order. This time, we are going to look at the iterative topological sort and Karasoju SCC algorithm.
>
>
> The key idea of my iterative topological sort is use another stack named __head__ to track when we finish visiting all descendant vertex of the head vertex.
>
>
> 上一次，我们提到了迭代深度优先查找（DFS）——用一个叫frontier的栈来保持访问顺序。今天，我们将看到迭代拓扑排序以及Karasoju强连通算法。
>
>
> 今天的重点在于，我们会增加一个栈，名为head。当父节点的所有后代都访问过之后，应该满足head.peek() === frontier.peek()。

<!--more-->

<a name="pi">
</a>

## Recursive Topological Sort
In the beginning, we introduce the code of recursive topological sort:

        function topologicalSortRec(graph) {
          var n = graph.numberOfVertex,
          order = [],

          DFS= function(g, i) {
            // recursive search graph g,
            // from the initial node i
            (for x in g.getAdjacentVertex(i)) {
              if (not g.isVisited(x)) {
                DFS(g, x);
              }
            };

            order[i] = n--;
            graph.markVisited(i);
          };

          (for 1 <= i <= n) {
            if (not graph.isVisited(i)) {
              DFS(graph, i);
            }
          }

          return order;
        }

As we notice, we get the topological order from recursive DFS. The proof of correctness will be found at Wikipedia or online course [_Algorithms: Design and Analysis, Part 1_] [1]

## Call Stack

Take a directed graph represented by adjacency list below for instance.

  1: [2, 4]
  2: [3]
  3: [5]
  4: [3, 5]

(Please draw this simple graph on the paper to help understand. `1: [2, 4]` means there are only two edges from vertex 1, that are 1 → 2 and 1 → 4.)

Here is the call stack of recursive topological sort. In each loop at current `v`, we list its parent vertex in column titled __P__. If all of descendant vertex of `v` which we list in column titled `v.c()` have been visited, we set the `order(v)`.

P | `v` | `v.c()` | Action
:---:|:---:|:---|:---
<span></span>| 1 | {2, 4} | initial call
 1 | 2 | {3} |<span></span>
 2 | 3 | {5} |<span></span>
 3 | 5 | empty | order(5) = 5, back to __p__arent `v#3`
 2 | 3 | empty | order(3) = 4, back to __p__arent `v#2`
 1 | 2 | empty | order(2) = 3, back to __p__arent `v#1`
 <span></span>| 1 | {4} |<span></span>
 1 | 4 | empty  | order(4) = 2, back to __p__arent `v#1` (initial call)
 <span></span>| 1 | empty  | order(1) = 1

## Inspiration

According to _Part Zero_, we add `frontier` to call stack table as below.

P | `v` | `v.c()` | `frontier` | Action
:---:|:---:|:---|:---|:---
<span></span>| 1 | {2, 4} | (1, 4, 2> | initial call
 1 | 2 | {3} | (1, 4, 2, 3> |<span></span>
 2 | 3 | {5} | (1, 4, 2, 3, 5> |<span></span>
 3 | 5 | empty | (1, 4, 2, 3, 5> | order(5) = 5, back to __p__arent `v#3`, pop frontier
 2 | 3 | empty | (1, 4, 2, 3> | order(3) = 4, back to __p__arent `v#2`, pop frontier
 1 | 2 | empty | (1, 4, 2>  | order(2) = 3, back to __p__arent `v#1`, pop frontier
<span></span>| 1 | {4} | (1, 4> |<span></span>
 1 | 4 | empty  |  (1, 4> | order(4) = 2, back to __p__arent `v#1` (initial call), pop frontier
<span></span>| 1 | empty  | (1> | order(1) = 1, pop frontier, then frontier is empty

If we look into the `frontier` and the time when descendant vertex array is empty, we may notice the top of `frontier` is the vertex we visit currently.

## Stack Head

So we introduce a stack named `head` to track the time when we finish visiting all descendant vertex of the head vertex (current `v`).

        function iterTopologicalSort(graph) {
          var frontier = new Stack(),
              head = new Stack(),
              n = graph.numberOfVertex,
              order = [];

          frontier.push(1);
            while (not frontier.isEmpty()) {
              current = frontier.peek();
              if (current === head.peek() /*head may be empty here*/) {
                  // we hit the time to set order
                  frontier.pop();
                  head.pop();
                  order[current] = n--;
                  graph.markVisited(current);
              } else {
                  // current is just a child of some v
                  head.push(current);
                  (for x in graph.getAdjacentVertex(current)) {
                    if (not graph.isVisited(x)) {
                      frontier.push(x);
                    }
                  };  // end for
              } // end else
            } // end while
        }

Running the iterative code, we update the stack table:

`v` | `head` | `frontier` | Action
:---:|:---|:---|:---
 1 | (1> | (1, 4, 2> | initial call
 2 | (1, 2> | (1, 4, 2, 3> |<span></span>
 3 | (1, 2, 3> | (1, 4, 2, 3, 5> |<span></span>
 5 | (1, 2, 3, 5> |(1, 4, 2, 3, 5> | `peek()` eqauls, set order(5), pop two stacks
 3 | (1, 2, 3> | (1, 4, 2, 3> | `peek()` eqauls, set order(3), pop two stacks
 2 | (1, 2> | (1, 4, 2>  | `peek()` eqauls, set order(2), pop two stacks
 1 | (1> | (1, 4> |<span></span>
 4 | (1, 4> | (1, 4> | `peek()` eqauls, set order(4), pop two stacks
 1 | (1> | (1> | `peek()` eqauls, set order(1), pop two stacks

 As we see, The time of finishing visit all descendant of current `v`, and to set order(current) is when `peek()` eqauls, i.e. `head.peek() == frontier.peek()`.

## Attention
* __Empty Head__. At line 10, `head.peek()` may throw an exception if `head.isEmpty()`. We can check it before each `peek()`, or we can push `-1` (whatever bottom item) to make sure head is always contains item(s) before `frontier.isEmpty()`.
* __Vertex Status__. Same issue may be occurred similarly as in iterative DFS we mentioned in last part. (see [issue #20] [2])

## Kosaraju SCC
Kosaraju SCC algorithm, which runs DFS twice, finds some kind of visiting order in the first DFS. So we can find topological sort order as in the first DFS, then use the order for the second DFS.

## Running Time
Roughly speaking, the running time of iterarive topological sort is same as time of DFS.
The time of Kosaraju SCC which runs DFS twice, is still $$O(m+n)$$.

## Next
See code on details in `graph.search.js` of [Algo.js] [3]. And next post, I am going to explain iterative Tarjan SCC algorithm, which cost me a few time.

<div class="post-content lang zh-cn">
拓扑排序的时候，需要记录当前访问的点，是从哪个父节点下来的。所以我们增加了一个叫head的栈，用来记录这个信息——当两个栈（frontier和head）的peek元素相同时，就意味着，父节点下面已经没有节点可以继续访问了，此时相当于一层递归的DFS结束。
<br />
<br />
需要留意的是，同一个节点可能来自不同的父节点：比如有两条边3 &#8594; 2和5 &#8594; 2。那么节点2可能有两次push进frontier，所以在处理的时候需要留意节点的状态。显而易见地，如果某一个节点已经被标记了拓扑顺序，那么它就不应该再次被标记，也就是说，它就不应该再次进入head栈。
</div>

<br />

[1]: https://www.coursera.org/course/algo          "Online course by Tim Roughgarden"
[2]: https://github.com/scotv/algo-js/issues/20        "Issue 20"
[3]: https://github.com/scotv/algo-js            "Algo.js"
[4]: {% post_url 2013-11-10-how-to-write-iterative-tarjan-scc-algorithm-part-zero %} "Tarjan, Part I"
