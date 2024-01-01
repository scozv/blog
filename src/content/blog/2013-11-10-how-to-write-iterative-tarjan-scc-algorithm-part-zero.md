---
title: "How to Write Iterative Tarjan SCC Algorithm, Part I"
slug: iterative-tarjan-scc-p1
pubDatetime: 2013-11-12 23:57:11+08:00
description: ""
category: "algo"
tags: ["algorithm", "graph", "dfs"]
lang: en
---

> During the work on [Tango.js] [1],
> I found there is a limitation on recursive stack size of JavaScript.
> This series posts describe the way to
> convert recursive Tarjan SCC algorithm to iterative one, containing:
>
> - Part I: Iterative BFS and DFS algorithm on graph;
> - [Part II] [4]: Iterative topological sort and Kosaraju SCC algorithm on graph;
> - Part III: Iterative Tarjan SCC algorithm on graph.

## Recursive DFS

It is easy to write down a recursive BFS or DFS algorithm on graph. Take DFS for example:

```javascript
function DFS(graph, node) {
  // do something on this node and mark it as visited

  (for x in graph.getAdjacentVertex(node)) {
    // then we DFS on each adjacent vertex of this node
    if (!graph.isVisited(x)) {
        DFS(graph, x)
    }
  }

  graph.markVisited(node);
}
```

The call of recursive function is managed by a stack,
we may see 'Call Stack', or 'Error Stack' in some IDE tools.
Recursive function is brief, and it is easy to understand sometimes.
But if there is limitation on stack size, We may try to write it as iterative way.

## Call Stack

Firstly, we see what happen in recursive DFS above, for the graph with only two paths:

```
1 → 2 → 3
1 → 4
```

we call `DFS(1)`, find `{2, 4}` as adjacent vertex, then we call <code>DFS<sub>1</sub>(2)</code>
(notation <code>DFS<sub>i</sub>(j)</code> means the parent call of `j` in stack is `i`).
Next call <code>DFS<sub>2</sub>(3)</code> finding `{3}` as adjacent vertex of `2`
and finish <code>DFS<sub>1</sub>(2)</code>.
Finally call <code>DFS<sub>1</sub>(4)</code> and finish `DFS(1)`.

## Stack Frontier

If we have a stack named `frontier`, we push `1` at first,
then pop to visit `1`. Push `[4, 2]`, and pop `2`.
Next push `[3]` as adjacent vertex of `2` (the stack is `( 4, 3 >` now).
Finally pop `3` and `4` to finish search.

| Row Index | Current `v` | Action                                  | `frontier` |
| :-------: | :---------: | :-------------------------------------- | :--------- |
|     0     |      1      | initial call                            | ( 1 >      |
|     1     |      1      | find `{2, 4}` as adjacent vertex of `1` | ( 4, 2 >   |
|     2     |      2      | pop `2` to visit                        | ( 4 >      |
|     3     |      2      | find `{3}` of `2`                       | ( 4, 3 >   |
|     4     |      3      | pop `3` to visit                        | ( 4 >      |
|     5     |      4      | pop `4` to visit                        | empty      |

(notation `( >` specifies we push and pop from right side)

## Attentions

There are two things we need to pay attentions:

- **Visiting Order**. At row index 1, we push `4` at first,
  in order to visit graph as same order of recursive call.
  However this is not very important,
  I just want to sync the order of iterative way and the order of recursive way.
  Pushing `4` at first or pushing `2` at first will get correct topological order or SCC,
  which we are going to find out at following two parts.
- **Vertex Status**. If we have only two paths in graph like: `1 → 2 → 3` and `1 → 3 → 4`.
  We have stack like this:

  | Row Index | Current `v` | Action                                  | `frontier` |
  | :-------: | :---------: | :-------------------------------------- | :--------- |
  |     0     |      1      | initial call                            | ( 1 >      |
  |     1     |      1      | find `{2, 3}` as adjacent vertex of `1` | ( 3, 2 >   |
  |     2     |      2      | pop `2` to visit                        | ( 3 >      |
  |     3     |      2      | find `{3}` of `2`                       | ( 3, 3 >   |

  (notation `( >` specifies we push and pop from right side)

  We may notice at row index 3, we push duplicate `3` into frontier.
  So we need a vertex status to mark vertex as being visited
  or being pushed into stack (see [issue #8] [3]).

## Running Time

Here is simplified code of iterative DFS:

```javascript
function f() {
  // 0. initialize stack, O(1)

  // 1. for all vertex, O(|V|)
  while (not frontier.isEmpty()) {
    // 1.0 visit current vertex, O(1)

    // 1.1 process all vertex out from the current
    (for x in graph.getAdjacentVertex(current)) {
      frontier.push(x);
      // process each adjacent vertex of the current one
    }
  }
}
```

In our code (comment 1.1) below, for each vertex, we process its adjacent vertex,
which we find from outgoing edges of current vertex.
We let the number of outgoing edges of vertex $$i$$ is $$e_i$$,
and $$n=\|V\|, m=\|E\|$$ as the number of vertex and number of edges respectively,
so we write the running time as following:

$$T = O(1) + \sum_{i=1}^{n} \left [ O(1) + e_i \right ] $$

$$= O(1) + \sum_{i=1}^{n}O(1) + \sum_{i=1}^{n}e_i$$

And notice that the sum of outgoing edges of all vertex is the the number of all edges,
that is $$\sum_{i=1}^{n}e_i=\left \|E \right \|=m$$, so we have:

$$T=O(1)+O(n)+O(m)=O(n+m)$$

## Next

Read code in `graph.search.js` on [Tango.js] [1],
and reference [this series of posts] [2] by Tom Moertel
for more details on _Recursive to Iterative_.

[Next] [4] part of this series, I am going to describe some ideas on
iterative topological order algorithm which can be applied on Kosaraju SCC algorithm.

[1]: https://github.com/scozv/tango "Tango.js"
[2]: http://blog.moertel.com/posts/2013-05-11-recursive-to-iterative.html "Recursive to Iterative by Tom Moertel"
[3]: https://github.com/scozv/algo-js/issues/8 "Issue 8"

[4]: {{ BASE_PATH }}{{ LANG_PATH }}{% post_url 2013-11-23-how-to-write-iterative-tarjan-scc-algorithm-part-one %} "Tarjan, Part II"
