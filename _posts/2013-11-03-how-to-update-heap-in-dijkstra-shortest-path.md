---
layout: post
title: "How to Update Heap in Dijkstra Shortest Path"
description: ""
category : algo
tags: ["algo.js"]
---
{% include JB/setup %}

__Abstract__

_To improve the runing time of Dijkstra shortest path algorithm from $O(nm)$ to $O(n \ln m)$, we need a heap to trace the minimum path "so far" at each loop. Howerver, it is not easy to keep the heap in heap order just using `insert()` or `delete()`. This post descripts the update of the heap._

_I suppose that you might:_
*	_know how to wirte Dijkstra algorithm with $O(nm)$ running time, and_
*	_know how to use heap_

<!--more-->

__Main__

To speed up the finding minimum length of path in each stage in Dijkstra shortest path algorithm, we can use a binary heap to store frontier path, according to many words, like [_Heap Application_] [1], or Tim Roughgarden's [algorithm course] [2].

{% gist 6200004 %}

It sounds easy, however the 1st revision of `dijkstra()` in Algo.js is failed to update heap correctly.

{% gist 6200035 %}

Where I just update the value of one vertex without keeping heap order.

How to update and keep heap order?

While, when we update the MinHeap, it means that we may replace the item at that index with a value __LESS__ than the origin one. According to the definition of minimum binary heap, each parent is less than their children. (see picture from [Wikipedia] [1])

![Min Heap](http://upload.wikimedia.org/wikipedia/commons/6/69/Min-heap.png)

So, if we replace $17$ with a __LESS__ value called $x$. $x$ is still less than its children, but $x$ may be less than $2$ (its parent). As the algorithm of `push()` of heap, we need to exchange $x$ with its parent, great-parent..., until heap is ordered. (see [diff](https://code.google.com/p/algo-js/source/diff?spec=svn7a5374091a506bee8f599b0345b14207f62e890a&old=9d86c0442743d9a350afcbb5d2f1d6d3a51f5ec7&r=7a5374091a506bee8f599b0345b14207f62e890a&format=unidiff&path=%2Fgraph.path.js) of revision)

{% gist 6200086 %}

[1]: http://en.wikipedia.org/wiki/Heap_(data_structure)#Applications	"Wikipedia"
[2]: https://www.coursera.org/course/algo 								"Algorithms: Design and Analysis, Part 1"
