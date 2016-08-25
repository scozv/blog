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

> 本文是《Scala函数编程》系列的第二部分，[第一部分](https://scozv.github.io/blog/zh/guide/2016/08/21/scala-quick-tour-part-i)
> 介绍了函数编程（FP）的基本概念、函数分别可以作为参数和返回值。
>
> 在第二个部分里面，我们将介绍一个非常重要的设计模式——尾递归（Tail Recursion）。之后
> 会通过`Scala`里面的`List[T]`来阐述尾递归在线性集合的应用，包括如下内容：
>
> * 迭代和递归的相互转化；
> * 递归和尾递归的区别；
> * `Scala`中的泛型简介；
> * 使用递归的方式构造一个`List[Int]`；
> * 模式匹配简介（未完成）；
> * `head`、`tail`等方法的尾递归实现（未完成）；
> * `take`、`reverse`等方法的尾递归实现（未完成）；
> * `append`、`prepend`等方法的尾递归实现（未完成）；
> * 遍历映射（`map`）和`reduce`的尾递归实现（未完成）;
> * `Scala`中的`List[T]`源代码分析（未完成）。
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

## `calc(acc, item)`还是`calc(item, acc)`？

使用二叉数，前序和后序遍历来表示两种不同的计算方式。

可以看出`calc(acc, item)`和`calc(item, acc)`的区别。
我们也会在`List[T]`的部分，更多地提到这两者的区别。

{% highlight raw %}
          calc(acc, item)                      calc(item, acc)
            /       \                             /        \
           /   ...   \                           /   ...    \
          /           item_n               item_1            \
        calc()                                             calc()
        /     \                                            /   \
      calc()   item_3                              item_(n-2)  calc()
      /     \                                                /   \
   calc()  item_2                                   item_(n-1)  calc()
   /     \                                                     /   \
init()  item_1                                            item_n   init()

{% endhighlight %}


练习：

> 通过上面的两张图示，阐述`calc(acc, item)`和`calc(item, acc)`的区别。

## 从迭代，到递归

练习：

> 请（用伪代码）写出阶乘计算的递归实现。

写完之后，需要检验如下的Test Case：

{% highlight JavaScript %}
f(-1) = 1
f(0) = 1
f(1) = 1
f(2) = 2
f(5) = 120
{% endhighlight %}

下面给出`Scala`的递归实现：

{% highlight Scala %}
def f(x: Int): Int =
  if (x > 0) x * f(x-1) else 1
{% endhighlight %}


迭代那一小节里面，我们给出了迭代的一般定义，这里
我们将迭代的一般定义，转化为递归的一般定义：

{% highlight Scala %}
def f(x: ItemType): AccumulatorType =
  if (NOT shouldQuit(x)) calc(f(nextItem()), x)
  else init()
{% endhighlight %}

练习（非常重要）：

> 根据上面的递归一般定义，推断出下列函数的函数类型：
>
>      f: ItemType => AccumulatorType
     shouldQuit
     calc
     nextItem
     init

## 递归的Call Stack

练习：

> 根据我们上面定义的阶乘递归函数，Evaluate $$5!$$。

{% highlight Scala %}
def f(x: Int): Int =
  if (x > 0) x * f(x-1) else 1
{% endhighlight %}

{% highlight JavaScript %}
  f(5)
= 5 * f(4)                   
= 5 * 4 * f(3)
= 5 * 4 * 3 * f(2)
= 5 * 4 * 3 * 2 * f(1)
= 5 * 4 * 3 * 2 * (1)
= 5 * 4 * 3 * (2)
= 5 * 4 * (6)
= 5 * (24)
= 120
{% endhighlight %}

我们对上面的Call Stack作如下说明：

* 整个调用堆栈最大耗用长度为5；
* 至少需要5个`push`操作，才能实现状态`5 * 4 * 3 * 2 * f(1)`；
* 至少需要另外5个`pop`、另外5个`push`操作，才能缩短堆栈的长度，最终完成Evaluation。

所以使用递归面临的最大问题就是，Call Stack过长。

# 尾递归（Tail Recursion）

下面我们来看尾递归（Tail Recursion），这是一个非常重要的概念。

## 尾递归初览

我们首先给出尾递归的阶乘实现：

{% highlight Scala %}
def f(x: Int): Int =
  if (x > 0) x * f(x-1) else 1

// Tail Recursion
def f(x: Int): Int = {
  def g(acc: Int, item: Int) =
    if (item > 0) g(item * acc, item-1) else acc

  g(1, x)
}
{% endhighlight %}

我们对上述尾递归的实现，备注如下：

* 当递归终止条件满足时，我们退出递归，返回`acc`，此时，计算已经完成；
* 由于退出递归的时候，Evaluation已经完成，所以理论上，我们连Call Stack都不需要维护；
* 实际上，`Scala`和其它大多数FP一样，会对尾递归作出优化。

## 尾递归的一般形式

回顾一下递归的一般形式：

{% highlight Scala %}
def f(x: ItemType): AccumulatorType =
  if (NOT shouldQuit(x)) calc(f(nextItem()), x)
  else init()
{% endhighlight %}

我们给出尾递归的一般形式：

{% highlight Scala %}
def f(x: ItemType): AccumulatorType = {
  def g(acc: AccumulatorType, item: ItemType) =
    if (NOT shouldQuit(item)) g(calc(acc, item), nextItem())
    else acc

  g(init(), x)
}
{% endhighlight %}

练习（非常重要）：

> 根据上面的尾递归一般形式，推断出下列函数的函数类型：
>
>      f: ItemType => AccumulatorType
     g
     shouldQuit
     calc
     nextItem
     init

## 递归和尾递归的区别

请先完成递归和尾递归一般定义的类型推断的练习题。

在尾递归中，我们通常需要引入一个临时局部函数`g`，实际上，函数`g`才是递归函数。
这样的思想，也非常符合函数编程的思想——函数是Pure，不带状态（Stateless）的。
因为，就递归`g`而言，初始状态`init()`不应该带入函数的实现（Implementation）中。

## 尾递归的练习题

习题1：

> 在`Scala`的REPL中编写尾递归一般形式的严格定义，保证编译通过。

习题2：

## 尾递归对数组求和

到此，尾递归的介绍马上就要告一段落了。我们马上要开始
讲解《Scala函数编程》（二）的另一个重要内容——`List[T]`。

在正式进入`List[T]`的讲解前，我们先来做一个练习：

> 使用尾递归，实现数组的求和。

我给出一个伪代码实现：

{% highlight JavaScript %}
function f(xs) {
  function g(acc, xs) {
    if (xs.length < 1) return acc
    else return g(acc + xs[0], subArray(xs, 1))
  }

  function subArray(xs, startIndex) {
    var res = []
    for (var i = startIndex; i < xs.length; i++) {
      res.push(xs[i])
    }
    return res
  }

  return g(0, acc)
}
{% endhighlight %}

需要注意的是，上述`subArray`的时间复杂度为$$O_{i\in [1,n]}(i)$$，
这将导致整个递归的时间复杂度为$$O(\sum_{i=0}^{n} i) = O(\frac{n(n+1)}{2})=O(n^2)$$。

实际情况是，我们期望的数组求和的时间复杂度必须为$$O(n)$$。

# `List[T]`

## 泛型简介（Type Parameterization）

泛型在某些语言中（比如`C#`）称为“Generic Type”，
在`Scala`的参考书《Programming in Scala》[^scala_progfun_2nd]（Chapter 19 Type Parameterization）中，使用的是“Type Parameterization”。

前者说，泛型是一种“通用”的类型，后者表示泛型是“一种参数化的类型”。

本文使用中文“泛型”，如果涉及到英文，我将采用 “Type Parameterization”。

和大多数语言的泛型定义一样：

* 需要在类或者方法上，声明一个或多个类型参数（Type Parameter）名称，比如

      class Traversable[T] {}
      def field[T](query: String, fieldName: String): T = ???
* 和普通的参数一样，类型参数的名称可以任取，比如：

      class Dictionary[KeyType,ValueType] {}
      def insert[IndexType, ItemType]: List[ItemType] = ???

* 但是，从`Scala`的接口文档[^scala_api_doc]和源代码[^github_scala]可以看出，
  因为是“泛”型，我们的参数类型名称不应该被限定，所以，
  可以使用如下的风格定义参数类型：

      class List[A] {}
      class Map[A, B]{}

## `List[T]`的递归定义

我们按照如下的递归方式，定义一个`List[T]`：

* `List[T]`可以为空，我们称其为`Nil`；
* 任意一个元素`x: T`，可以和任意一个`xs: List[T]`，组成一个新的`List[T]`，我们称
  这个组合动作（function）为`cons`——取"construction"的前四个字母。

## `List[T]`的递归实现

这一小节，我们使用递归定义，实现`List[T]`。
如果有语法上，不明白的地方，请自行搜索相关资料。

有关OOP的内容，我会在之后的部分中重新讲。

建议阅读`List[T]`的`Scala`的源代码 [^github_scala_list_t]。

为了不和`Scala`中的`List[T]`和`Nil`冲突，以下的实现
有意更换了名称。

{% highlight Scala %}
trait GenericList[+T] {
  val isEmpty: Boolean
  def size: Int

  def head: T
  def tail: GenericList[T]
}

case object EmptyList extends GenericList[Nothing] {
  val isEmpty = true
  def size = 0

  def head = throw new NoSuchElementException("head of empty list")
  def tail = throw new UnsupportedOperationException("tail of empty list")
}

case class NonEmptyList[T](head: T, tail: GenericList[T]) extends GenericList[T] {
  def this(x: T) = this(x, EmptyList)

  val isEmpty = false
  def size: Int = {
    def g(acc: Int, xs: GenericList[T]): Int = xs match {
      case EmptyList => acc
      case NonEmptyList(_, ys) => g(acc + 1, ys)
    }

    g(0, this)
  }
}

case object GenericList {
  def apply(): GenericList[Nothing] = EmptyList
  def apply[T](x: T): GenericList[T] = NonEmptyList(x, EmptyList)
  def apply[T](x1: T, x2: T): GenericList[T] = NonEmptyList(x1, GenericList(x2))
  def apply[T](x1: T, x2: T, x3: T): GenericList[T] = NonEmptyList(x1, GenericList(x2, x3))
}

val xs0 = GenericList()
xs0.size
xs0.isEmpty
GenericList("Apple")
GenericList(1.2, 3.5)
val xs1 = GenericList(1, 2, 3)
xs1.size
xs1.isEmpty
{% endhighlight %}

以上的实现，使用了“单向链式列表”这一数据结构，
我认为这些基础的数据结果，是程序员的基本修养，请
自行查阅相关资料。



思考：

> 0. 为什么`head`和`tail`的声明是`def`而不是`val`？
> 0. 为什么`Nil`的继承来自`ListLike[Nothing]`，而非`ListLike[T]`?
> 0. 如果去掉`trait GenericList[+T]`中的`+`号，是否能够编译通过？
> 0. 请问如下代码的输出结果为：
>
        val xs0 = GenericList()
        xs0.size
        xs0.isEmpty
        GenericList("Apple")
        GenericList(1.2, 3.5)
        val xs1 = GenericList(1, 2, 3)
        xs1.size
        xs1.isEmpty
> 0. 请问如下代码的输出结果（请仔细思考）：
>
>
        val xs2 = GenericList(1, 2, 3, 4)
        xs2.size
        xs2.isEmpty      

## `Scala`中的`List[T]`

## 模式匹配简介

## 使用模式匹配和尾递归，实现`List[Int]`的求和

## `map`和`foreach`

## 其它`List[T]`方法的实现

## `map`和`reduce`

## `map`和`flatMap`

# `List[T]`接口文档和源代码分析

实际上`List[T]`的很多实现并没有使用递归，而是使用的迭代。
因为迭代的效率和性能高。

# 综合练习

## 使用指定的一系列函数定义，完成函数的实现

举例：

{% highlight Scala %}
// 已知
def f0(x: Int): Int = ???
def f1(x: Int, y: Int) = ???
// 实现
def f(x: Int): Int = ???
// 参考答案
def f(x: Int): Int = f1(x, f0(x))
{% endhighlight %}

# 练习题参考答案

## 递归一般定义中的函数类型推断

重申一下，我认为这道练习题非常重要，建议先独立完成这道练习题。

给出如下的递归一般定义：

{% highlight Scala %}
def f[ItemType, AccumulatorType](x: ItemType): AccumulatorType =
  if (! shouldQuit(x)) calc(f(nextItem()), x) else init()
{% endhighlight %}

练习：

> 根据上面的递归一般定义，推断出下列函数的函数类型：
>
>      f: ItemType => AccumulatorType
     shouldQuit
     calc
     nextItem
     init

参考答案：

{% highlight Scala %}
def shouldQuit[ItemType](x: ItemType): Boolean = ???
def calc[ItemType, AccumulatorType](acc: AccumulatorType, x: ItemType): AccumulatorType = ???
def nextItem[ItemType](): ItemType = ???
def init[AccumulatorType](): AccumulatorType = ???
{% endhighlight %}

上面的几个函数定义，必须在`Scala`的REPL中编译通过。
这里使用了泛型定义，如果不理解，请尝试阅读
《Programming in Scala》[^scala_progfun_2nd]（Chapter 19 Type Parameterization）。


## 尾递归的一般形式（严格定义）

> 使用匿名函数，代替尾递归一般定义中的临时函数`g`。

{% highlight Scala %}
def f[ItemType, AccumulatorType](x: ItemType): AccumulatorType = {
  def g(acc: AccumulatorType, item: ItemType): AccumulatorType =
    if (! shouldQuit(item)) g(calc(acc, item), nextItem())
    else acc

  g(init(), x)
}
{% endhighlight %}





# 参考文献

[^open_progfun1]: [Functional Programming Principles in Scala](https://www.coursera.org/learn/progfun1) from École Polytechnique Fédérale de Lausanne
[^scala_progfun_2nd]: Martin Odersky, Lex Spoon, Bill Venners. Programming in Scala (Second Edition), Artima Press
[^scala_api_doc]: [Scala API Documentation](http://www.scala-lang.org/api/current/index.html)
[^github_scala]: [Scala on Github](https://github.com/scala/scala)
[^github_scala_list_t]: [`List.scala` Source Code on Github](https://github.com/scala/scala/blob/v2.11.8/src/library/scala/collection/immutable/List.scala)
