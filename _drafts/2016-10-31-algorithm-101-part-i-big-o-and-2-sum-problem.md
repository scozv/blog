---
layout: post
title: "Algorithm 101 Part I, Big O and 2-SUM Problem"
description: ""
category: "algo"
tags: ["algorithm"]
lang: "zh"
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 我认为数据结构和算法是程序员的基本技能。虽然，目前流行的代码框架，都自带很多数据结构
> 和算法的封装（比如各种线性结构、比如排序），但不是每一个程序员都能熟练的写出单链表、或者排序。
> 并且不借助IDE的智能感知。
>
> 本系列的文章将会讲解一些基本算法和数据结构，包括：
>
> * 时间复杂度Big O
> * 线性数据结构
> * 排序
> * 树、Hash和查找
> * 图和常见图算法
>
> 本系列不是算法竞赛的培训，更严格地说，本系列的难度和算法竞赛相比，差着`1 >> 10`条街。
>
> 尽管如此，建议使用自己熟悉的语言，写一遍基本的数据结构和算法。放到Git中，然后不断的改进。
> 使用完备的用例保证算法的正确性。
>
> 这样对理解基本的算法和数据结构，有很大的帮助。

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# 算法无处不在

我们在面试的时候，会碰到一些问题：

* 二分查找的前提条件是什么；
* 使用合适的数据结构，计算Big Number的和；
* 给定一个数组和一个整数，找出两个数、其和等于该整数；
* 判断表达式中，括号是否匹配。

这些问题都使用了基本的数据结构和方法。也可能会遇到一些稍微复杂的问题：

* 给定一个数组和一个整数，找出两个数、其和等于该整数；
* 如何找出一个数组中的第`K`大的元素；
* 判断两个人之间是否能通过朋友关联起来；
* 警察抓来几个嫌疑人，如果只有一个人说的是真话，谁的嫌疑最大？

诸如此类。



数据结构和算法是一个比较抽象的概念，我认为，就基础而言，我们应该：

* 知道算法背后用什么数据结构、这些数据结构的特点什么；
* 能够写出伪代码；
* 能够用**熟练**的编程语言实现算法；
* 写出来的算法，需要适应各种边界情况。



通常而言，我们认为，正确的算法，应该具备如下特征：

* 有输入、输出；
* 明确可执行，就是通过语言、或者手写计算能够表述，并实现预期的结果（我们在Dijstra最短路径中会更加清楚地看到）；
* 有限时间内可执行。

这里“有限时间”就是我们本文要讲的"Big O"。

# 2-SUM问题

问题描述如下。

* 输入：一个数组`xs`，一个整数`T`
* 输出：数组`xs`中的两个元素`x`、`y`，满足，$$ x + y= T $$

仅上面的条件，还会带来一些极端的情况，比如：

* 数组为空，或者找不到这样的两个元素
* 其它（请作为练习题）



面对这样的问题，你的方法是？

## 最直接的办法

我们可以枚举`xs`中所有的二元序列 $$(x, y)$$，然后遍历这些枚举值，看看哪一组满足
$$x+y=T$$。

{% highlight JavaScript %}
for (i=0;i<len(xs);i++) {
  for (j=i;j<len(xs);j++) {
    if (xs[i] + xs[j] == T) {
      return [xs[i], xs[j]];
    }
  }
}
{% endhighlight %}

## 运行时间估计

我们假定加法运算和等号比较运算的完成时间为$$t$$，我们容易得出，上述计算的完成时间：

$$T(n)=(n-1)t + (n-2)t + \ldots + 2t + t = t\cdot \sum_{i=1}^{n-1} i = t\cdot \frac{(n-1+1)(n-1)}{2}$$

如果`for`循化前后还有一些准备工作的话，我们加上一个常数项：

$$T(n)=\frac{n(n-1)}{2}t + C=\frac{t}{2}n^2 - \frac{t}{2}n + C$$

首先给出一个结论，我们说：

$$T(n) = O(n^2)$$

# Big O 和 Big Theta

## Big O 的正式定义


下面给出Big O的正式定义。

当我们说，随着 $$x \rightarrow \infty $$，若：

$$f(x) = O(g(x))$$

则表示，当且仅当：

$$\exists M > 0, x_0 > 0, \forall x \geq x_0 \rightarrow |f(x)| \leq M |g(x)|$$

## Big O的几个证明题

* 证明  $$T(n)=O(n^2)$$
* 证明  $$T(n)=O(\lambda_0 n^2) \Rightarrow T(n)=O(n^2)$$
* 证明  $$T(n)=O(n^2), G(n)=O(n \ln n) \Rightarrow \exists M > 0, n_0 > 0, \forall n \geq n_0 \rightarrow T(n) \geq M \cdot G(n)$$

下面证明2-SUM问题的时间复杂度：

$$T(n)=\frac{n(n-1)}{2}t + C=\frac{t}{2}n^2 - \frac{t}{2}n + C$$

首先：

$$ T(n)=\frac{t}{2} n^2 - \frac{t}{2}n + C \leq \frac{t}{2} n^2 + C $$

为了找到一个$$M$$，使得：

$$\frac{t}{2}n^2 + C \leq M \cdot n^2 $$

求解该不等式，可得：

$$ n^2 \geq \frac{C}{M-\frac{t}{2}} $$

不妨令$$M=t$$，我们得到$$ n_0^2 = \frac{C}{t-\frac{t}{2}}=\frac{2C}{t} $$：

$$\exists M = t > 0, n_0 = \sqrt{\frac{2C}{t}} > 0, \forall n \geq n_0 \rightarrow |T(n)| \leq M |n^2|$$

所以：$$T(n)=O(n^2)$$

证明完毕。

需要注意的是，第三个证明题，实际上是不成立的。

我们来看看第三个证明题的证明过程，可以根据定义得到：

...

我们可以看到，在Big O定义下面，无法建立起不等式的关联关系。

## Big Theta的正式定义

Big O定义了函数的上限，Big Theta定义了函数的上下限。

下面给出Big Theta的正式定义。

当我们说，随着$$x\rightarrow \infty$$，若：

$$f(x)=\Theta(g(x))$$

则表示，当且仅当：

$$\exists M_1, M_2 > 0, x_0 > 0, \forall x \geq x_0 \rightarrow M_1 |g(x)| \leq |f(x)| \leq M_2 |g(x)|$$


根据这样的定义，我们可以证明刚才的第三个命题：

$$T(n)=\Theta(n^2), G(n)=\Theta(n \ln n) \Rightarrow \exists M > 0, n_0 > 0, \forall n \geq n_0 \rightarrow T(n) \geq M \cdot G(n)$$


## Big Theta的性质

如下的性质可以通过定义证明：

* $$g(x)=O(f(x)) , T(x)=\Theta[f(x)+g(x)] \rightarrow T(x)=\Theta(f(x))$$
* $$T(x)=\Theta(f(x)+C) \rightarrow T(x)=\Theta(f(x))$$
* $$T(x)=\Theta(\lambda \cdot f(x)) \rightarrow T(x)=\Theta(f(x))$$
* $$T(x)=\Theta(\log_2 x)=\Theta(\frac{\ln x}{\ln 2}) \rightarrow T(x)=\Theta(\ln x)$$

## 算法分析中的Big O

算法分析中的Big O，实际上，是上下限的分析。也就是说，我们通常说的某一个算法的时间复杂度为：$$O(n^2)$$，其实指的是$$\Theta(n^2)$$。

**如果没有特殊说明，本站点所有Big O都表示上下限。**


## 几个常见的Big O的差异

常见的Big O如下（从上往下，时间复杂度越小）：

时间复杂度 | 算法举例
:---------------:|:-----------
$$O(n^3)$$ | 矩阵乘法、线性相关系数计算
$$O(n^2)$$ | 冒泡排序、插入排序
$$O(n\ln n)$$ | 比较排序的下限
$$O(n)$$ |  线性查找，找出$$K$$大的元素
$$O(\ln n)$$ | 二分查找、堆（Heap）的操作
$$O(1)$$ | 普通运算，比如整数的加减乘除

# 2-SUM问题的改进算法

2-SUM问题的改进有两个思路：

* 第一个`for`循环找`a`，第二`for`循化找`b`。所以我们得降低我们“找”这个动作复杂度；
* 另一种思路是，我们能从数组的两头查看，并找到满足条件的两个整数

给出一个，源代码，我们来看看它的复杂度。

## 二分查找

二分查找有一个前提条件，并且还有一个注意事项（参考[Java Bug 6412541](http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6412541)）。

## Hash查找

Hash我们会在第三节课讲，它的目的是把一个空间缩小，并映射到另外一各个空间。　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　


## 排序后查找

排序我们会在第二部分讲，我们需要知道的是，通常基于比较的排序，时间复杂度为$$O(n \ln n)$$。


# K-SUM问题

如果2-SUM问题可以解决，那么3-SUM呢？

我们同样可以使用上述的“排序后查找”来解决3-SUM的问题。

并且，我们能够在2-SUM问题上面，写出3-SUM问题。

# 练习

**估计下面的复杂度，并排序**

0. $$N+3$$
0. $$2N^3-10000N^2+N$$
0. $$\frac{\ln(2N)}{\log_2(N)}$$
0. $$\frac{N^{1024}}{2^N}$$


**估计下面程序的时间复杂度**

```
// 1
int sum = 0
for (int a = N; a > 0; a = a / 2) {
  for (int b = 0; b < a; b++) {
    sum = sum + 1
  }
}

// 2
int sum = 0
for (int i = 1; i < N; i = i * 2) {
  for (int j = 0; j < N; j++) {
    sum = sum + 1
  }
}
```
