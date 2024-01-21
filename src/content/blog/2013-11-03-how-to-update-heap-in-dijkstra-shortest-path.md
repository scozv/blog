---
title: "How to Update the Heap in Dijkstra's Shortest Path Algorithm"
slug: heap-update-in-dijkstra-for-nlogn
pubDatetime: 2013-11-03 23:09:10+08:00
modDatetime: 2024-01-21T13:42:21.249Z
description: "Learn how to maintain the heap order in Dijkstra's algorithm for optimal performance."
category: "algo"
tags: ["algorithm", "graph", "dijkstra", "heap"]
lang: en
---

> Replacing the list with a **heap** reduces the time complexity
> of Dijkstra's shortest path algorithm
> from $$O(nm)$$ to $$O(n \ln m)$$.
> However, when implementing the algorithm with a `heap` [^heap_swim_diff],
> I noticed the `heap` order was destroyed right after using `insert()` or `delete()`.
> This post describes using the `swim()` to reorder the `heap`.
>
> Prerequisites: 1) understanding the $$O(nm)$$ version of
> Dijkstra's algorithm, 2) basic knowledge of the `heap` data structure.

Dijkstra's shortest path algorithm is a method for finding the shortest
paths between nodes in a graph, employing a greedy strategy by iteratively
selecting the node with the smallest tentative distance
from a source node to update the distances of its neighboring nodes. [^chatgpt]

In the algorithm,
a binary `heap` can be used to store the frontier path [^wiki_heap] [^coursera_algo_p1].
In each iteration, only $$O(\ln m)$$ search cost is needed to find the
next exploration (named `currentVertex`).
This reduces the total time complexity from $$O(nm)$$ to $$O(n \ln m)$$.

```javascript
function dijkstra(graph, startVertex = 1) {
  i = 0;

  frontier = new Heap();
  frontier.push([startVertex, 0]);

  while ( frontier.nonEmpty && i < graph.size ) {
    // O(logn) on pop() instead of O(n)
    // for smallest tentative distance selection
    currentVertex = frontier.pop();

    graph.edgesOf(currentVertex)
     .filter(neighborVertex => ! neighborVertex.isVisited)
     .forEach(neighborVertex =>
        // update the distance in frontier list
    );
  }
}
```

In each exploration, examine all the neighbors from `currentVertex`.
For all `neighborVertex`, if it exists in the `frontier` list, update the smallest tentative distance
by comparing the distance from the start to `neighborVertex` recorded in the `frontier` list
and the distance from the start to `neighborVertex`, with a stop at `currentVertex`
(named `distanceViaCurrentVertex`).
Otherwise, push the `neighborVertex` into the `frontier` list with `distanceViaCurrentVertex`.

Note: `frontier.distance[v]` in the pseudocode below represents
the total distance from the start vertex to `v` that is recorded in the `frontier` list
so far (smallest tentative distance).

```javascript
graph.edgesOf(currentVertex)
.filter(neighborVertex => ! neighborVertex.isVisited)
.forEach(neighborVertex =>
    // get the distance from start to neighborVertex
    // via currentVertex
    distanceViaCurrentVertex =
        frontier.distance[currentVertex] + distanceOf(currentVertex, neighborVertex);

    // update the distance in frontier list
    if (frontier.hasVertex(neighborVertex)) {
        frontier.distance[neighborVertex] = Math.min(
            frontier.distance[neighborVertex],
            distanceViaCurrentVertex
        );
    } else {
        frontier.push([neighborVertex, distanceViaCurrentVertex]);
    }
);
```

In my earlier JavaScript implementation of `dijkstra()` in Tango.js [^heap_swim_diff],
I missed one important step after updating the distance in the `frontier` list,
which is keeping the `heap` in order.

```javascript
frontier.distance[neighborVertex] = Math.min(
  frontier.distance[neighborVertex],
  distanceViaCurrentVertex
);
// frontier is unsorted
```

How to update and maintain the heap order?

When updating the `frontier` list, presented using `MinHeap`,
we may only update the distance with a
value **LESS** than the original one.
According to the definition of a minimum binary heap, the value of
the parent node is less than the value in its children. [^wiki_heap]

![Min Heap](http://upload.wikimedia.org/wikipedia/commons/6/69/Min-heap.png)

So, if we replace $$17$$ with a **SMALLER** value called $$x$$.
$$x$$ is still less than its children,
but $$x$$ may also be less than $$2$$ (its parent).
To maintain the `MinHeap` order,
we need to exchange $$x$$ with its parent,
grand-parent..., until the heap is ordered.
This exchanging with parents is what the `heap.swim()` does [^swim_function].

Hence, we proceed with
**using `heap.swim()` to maintain the heap order** (see this diff [^heap_swim_diff] of git revision).

```javascript
// update the distance in frontier list
if (frontier.hasVertex(neighborVertex)) {
  frontier.distance[neighborVertex] = Math.min(
    frontier.distance[neighborVertex],
    distanceViaCurrentVertex
  );
  // swim like push() in heap is important to update heap
  frontier.__swim__(frontier.indexOf[neighborVertex]);
} else {
  frontier.push([neighborVertex, distanceViaCurrentVertex]);
}
```

[^chatgpt]: Paragraph summarized by ChatGPT 3.5
[^wiki_heap]: [Wikipedia: Heap#Application](<http://en.wikipedia.org/wiki/Heap_(data_structure)#Applications>)
[^coursera_algo_p1]: [Algorithms: Design and Analysis, Part 1](https://www.coursera.org/course/algo)
[^heap_swim_diff]: [Diff of Tango.js](https://github.com/scozv/algo-js/compare/9d86c04...7a5374091a506bee8f599b0345b14207f62e890a)
[^swim_function]: [`heap.swim()` in Tango.js](https://github.com/scozv/algo-js/blob/7a5374091a506bee8f599b0345b14207f62e890a/t.heap.js#L18)
