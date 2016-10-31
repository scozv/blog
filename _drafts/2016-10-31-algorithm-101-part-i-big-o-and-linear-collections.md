---
layout: post
title: "Algorithm 101 Part I, Big O and Linear Collections"
description: ""
category: "algo"
tags: ["algorithm"]
lang: "zh"
---
{% include JB/setup %}

# 摘要
{:.no_toc}

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# 算法无处不在

如果我们想解决如下的问题，我们需要想出一个可行的方法：

* 给定一个数组和一个整数，找出两个数、其和等于该整数
* 找出一段时间代码中，哪次提交影响了程序？
* 判断两个人之间是否能通过朋友关联起来
* 警察抓来几个嫌疑人，如果只有一个人说的是真话，谁的嫌疑最大？
* 快速地统计出频次最高的前五个单词
* 给定一个文件，快速定位到某个文件夹

诸如此类。

通常而言，我们认为，我们选用的这个方法，具备如下特征：

* 有输入、输出
* 明确可执行，就是通过语言、或者手写计算能够表述，并实现预期的结果（我们在Dijstra最短路径中会更加清楚地看到）
* 有限时间内可执行

这里“有限时间”就是我们本文要讲的"Big O"。

# Two Sum问题

问题描述如下。

* 输入：一个数组`xs`，一个整数`T`
* 输出：数组`xs`中的两个元素`x`、`y`，满足，$$ x + y  = T $$

仅上面的条件，还会带来一些极端的情况，比如：

* 数组为空，或者找不到这样的两个元素
* 其它（请作为练习题）

## 最直接的办法

我们可以枚举`xs`中所有的二元序列 $$(x, y)$$，然后遍历这些枚举值，看看哪一组满足
$$x+y=T$$。

{% highlight JavaScript linenos%}
for (i=0;i<len(xs);i++) {
  for (j=i;j<len(xs);j++) {
    if (xs[i] + xs[j] == T)
      return [xs[i], xs[j]]
  }
}
{% endhighlight %}

## 运行时间估计

我们假定加法运算和等号比较运算的完成时间为$$t$$，我们容易得出，上述计算的完成时间：

$$T(n)=(n-1)t + (n-2)t + \ldots + 2t + t = t\cdot \sum_{i=1}^{n-1} i = t\cdot \frac{(n-1+1)(n-1)}{2}$$

如果`for`循化前后还有一些准备工作的话，我们加上一个常数项：

$$T(n)=\frac{n(n-1)}{2}t + C=\frac{t}{2}n^2 - \frac{t}{2}n + C$$

首先给出一个结论，我们说：

$$T(n) \in O(n^2)$$

## Big O 的正式定义
　
