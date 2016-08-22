---
layout: post
title: "Scala函数编程（二）"
description: ""
category: "guide"
tags: ["scala"]
lang: zh
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 本文是《Scala函数编程》系列的第二部分，[第一部分](/guide/2016/08/22/scala-quick-tour-part-ii)
> 介绍了函数编程（FP）的基本概念、函数分别可以作为参数和返回值。
>
> 在第二个部分里面，我们将介绍一个非常重要的设计模式——尾递归（Tail Recursion）。之后
> 会通过`Scala`里面的`List[T]`来阐述尾递归在线性集合的应用，包括如下内容：
>
> * 迭代和递归的相互转化；
> * 递归和尾递归的区别；
> * `Scala`中的泛型简介；
> * 使用递归的方式构造一个`List[Int]`；
> * 模式匹配简介；
> * `head`、`tail`等方法的尾递归实现；
> * `take`、`reverse`等方法的尾递归实现；
> * `append`、`prepend`等方法的尾递归实现；
> * 遍历映射（`map`）和`reduce`的尾递归实现。
>
> 为了便于理解，部分名词、专有术语，我直接使用英文，不作任何翻译。
>
> 我依然建议去听原版公开课[^open_progfun1]，并完成所有的Assignment。另外，还要多写代码。

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}


# 迭代和递归

考虑正整数的阶乘（Factorial）函数：

$$f(x) = x! = \Pi_{i=1}^{x} i = x \cdot (x-1) \cdot (x-2) \cdot \ldots \cdot 2 \cdot 1 $$

其中我们约定$$x$$为正整数：

$$x \in \mathbb{Z}^{+}$$

## 阶乘函数的迭代计算

本文中的迭代计算，使用`JavaScript`语言，因为，你可以直接在浏览器中（F12进入调试面板）运行这段脚本：

{% highlight JavaScript %}
function f(x) {
  var acc = 1;
  for (var i = x; i > 0; i--) {
    acc = acc * i;
  }  // end for-loop

  return acc;
}
{% endhighlight %}

以上代码，等价于：

{% highlight JavaScript %}
function f(x) {
  var acc = 1, i = x;
  while (i > 0) {
    acc = acc * i;
    i--;
  }

  return acc;
}
{% endhighlight %}

## 迭代计算的一般定义

从上面的阶乘迭代，可以总结出迭代的几个组成要素：

* 迭代的退出条件，比如，当`i > 0`不满足的时候，迭代退出；
* 迭代的累积器（Accumulator），比如上面的`acc`变量，未来，我们将使用`acc`表示累积器。需要注意的是，
  这里“累积”的“积”不是“乘积”的意思（只是碰巧，我们在此使用乘法而已）。Accumulator这个单词，很好地
  解释了“累积”的含义；
* `acc`的初始值，此处我们是乘法，所以初始值设置为`1`，如果是加法，我们的初始值可以使用`0`；
* 每一次迭代，`acc`将会和一个元素发生运算，运算结果会重复赋值给`acc`；
* 迭代进入下一个元素，我们将这些元素成为`item`；
* 注意到，迭代版本中，`acc`会被重复赋值，并在循环退出之后，按值返回（`return`）。

根据这几个要素，我们给出迭代的一般定义：

{% highlight JavaScript %}
var acc = init()

while (NOT shouldQuit(item)) {
  acc = calc(acc, item)
  item = nextItem()
}

return acc
{% endhighlight %}

## `calc(acc, item)`和`calc(item, acc)`的补充说明

使用二叉数，前序和后序遍历来表示两种不同的计算方式。

画图。

# 参考文献

[^open_progfun1]: [Functional Programming Principles in Scala](https://www.coursera.org/learn/progfun1) from École Polytechnique Fédérale de Lausanne
