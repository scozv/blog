---
title: "How to Update Heap in Dijkstra Shortest Path Algorithm"
slug: heap-update-in-dijkstra-for-nlogn
pubDatetime: 2013-11-03 23:09:10+08:00
description: ""
category: "algo"
tags: ["algorithm", "graph", "dijkstra", "heap"]
lang: en
---

> When we use a **heap** to improve the running time of Dijkstra shortest path algorithm
> from $$O(nm)$$ to $$O(n \ln m)$$, we may find that it is not easy to keep the heap
> in heap order just using insert() or delete().
> This post describes the update of that heap.
>
> I suppose that you might:
>
> - know how to write Dijkstra algorithm with $$O(nm)$$ running time, and
> - know how to use heap.

To speed up the finding minimum length of path in each stage
in Dijkstra shortest path algorithm,
we can use a binary heap to store frontier path, according to many words,
like [_Heap Application_] [1], or Tim Roughgarden's [algorithm course] [2].

```javascript
function dijstra(graph, s) {
  s = s || 1;
  i = 0;

  frontier = new Heap();
  frontier.push([s, 0]);

  while ( !frontier.isEmpty && i < graph.n ) {
    // O(logn) on pop() instead of O(n)
    //   from linear selection of minimum length
    current = frontier.pop();

    graph.edgesOf(current)
     .filter(v => !v.isVisisted)
     .forEach(v =>
        if (frontier.has(v))
          // update path length on v in frontier
        else:
          frontier.push([v, current[1] + weightOf(current, v)]);
    );
  }
}
```

It sounds easy, however the 1st revision of `dijkstra()` in Tango.js
is failed to update heap correctly, where I just update the value of one vertex
without keeping heap order.

```javascript
if (g.__labelAt__(v[0]) === -1) {
  // not visited, update each in frontier
  var updated = frontier.__id__.some(function (x) {
    return (
      x && x[0] === v[0] && ((x[1] = Math.min(x[1], current[1] + v[1])), true)
    );
  });

  if (!updated) {
    frontier.push([v[0], v[1]]);
  }
} // end if, unvisited
```

How to update and keep heap order?

While, when we update the MinHeap,
it means that we may replace the item at that index with a
value **LESS** than the origin one. According to the definition of minimum binary heap,
each parent is less than their children. (see picture from [Wikipedia] [1])

![Min Heap](http://upload.wikimedia.org/wikipedia/commons/6/69/Min-heap.png)

So, if we replace $$17$$ with a **LESS** value called $$x$$.
$$x$$ is still less than its children,
but $$x$$ may be less than $$2$$ (its parent).
As the algorithm of `push()` of heap, we need to exchange $$x$$ with its parent,
great-parent..., until heap is ordered. That is:

**Using `heap.swim()` to update that heap.** (see [diff][3] of revision)

```javascript
var updated = frontier.__id__.some(function (x, k) {
  // return x && x[0] === v[0] && (doUpdate, true)
  return (
    x &&
    x[0] === v[0] &&
    ((function () {
      if (current[1] + v[1] < x[1]) {
        x[1] = current[1] + v[1];
        // swim like push() in heap is important to update heap
        frontier.__swim__(k);
      }
    })(),
    true)
  );
});
```

[1]: http://en.wikipedia.org/wiki/Heap_(data_structure)#Applications "Wikipedia"
[2]: https://www.coursera.org/course/algo "Algorithms: Design and Analysis, Part 1"
[3]: https://github.com/scozv/algo-js/compare/9d86c04...7a5374091a506bee8f599b0345b14207f62e890a "Diff of Tango.js"
