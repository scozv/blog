---
layout: post
title: "Algorithm 101 Part II, Recursion and Sorting"
description: ""
category: "algo"
tags: ["algorithm"]
lang: "zh"
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 本次将递归和排序。

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## 回顾

上一个部分，我们提到了Big O，比较了一些常见的Big O的差异。作为回顾，我们先来看这样一个问题：

> 给定一组人员名单、如果部分人员已经加入了一个聊天室，请问哪些人没有在聊天室中？

最直接的做法，依然是循环和遍历，如果写出源代码，应该很容易看到，这是一个$$O(n^2)$$的复杂度。

需要留意的是，我们在这个算法里面，有一个“判断”的动作——也就是比较（Comparision）。
比较这个动作，是一个非常常见的操作，它的复杂度通常为$$O(1)$$。
除非这个Comparision需要耗费更长的时间，比如数组、字符串的比较。

再回到这个$$O(n^2)$$的比较，那我们可以做得更好吗？

递归实现BinarySearch
尾递归实现BinarySearch
