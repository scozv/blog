---
layout: post
title: "Scala函数编程、一"
description: ""
category: "guide"
tags: ["scala"]
lang: zh
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 接下来的一系列《Scala函数编程》，得益于公开课《Functional Programming Principles in Scala》[^open_progfun1]。
> 我整理了函数编程中的重要概念，并加入了我两年Scala开发的心得体会。
>
> 为了便于理解，部分名词、专有术语，我直接使用英文，不作任何翻译。
>
> 《Scala函数编程》这一系列，不单纯只是原公开课的笔记整理。
> 我也加入了一些练习题，供加深理解。
> 但我依然建议去听原版公开课，并完成所有的Assignment。另外，还要多写代码。
>
> 本文包括如下内容：
>
> * 函数编程初览；
> * Evaluation：CBN和CBV；
> * 函数的类型（Type）；
> * 尾递归（Tail Recusive）。

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# 函数编程初览

## 常用的术语

为了便于理解，部分名词、专有术语，我直接使用英文，不作任何翻译。

如下先来看一些术语：

* Immutable，如果一个变量（对象）在构造之后，不能重新赋值，我们称其为不可变。
  其对应的反义词mutable（可变）表示一个变量（对象）可以多次被赋值。
* Type，类型包括：
  - 基本类型（Primative）：比如整数、数组，布尔等；
  - 类或者接口；
  - 函数类型，过会儿会详细解释。
* 表达式，精确的表达式定义可参考Scala Specification [^scala_spec_exp]。
* Evaluation：将一个表达式的最终值给计算出来，我们称之为Evaluation。
* FP：Functional Programming，函数式编程（语言），简称FP。


## 命令式和声明式

我们通常把编程 Paradime 分成如下两种（参考C#讲座的PPT，公开课提到了三种）：

命令式 | 声明式
:-----|:-----
mutable | immutable
赋值 | 定义之后不能再赋值
if-else，循环等 | 模式匹配，递归

命令式的编程，通常关注实现细节——怎么做（How），比如我们常见的自上而下的程序化
编程语言，使用`for-loop`去控制实现的细节。

对应地，声明式的编程，通常关注最后的目标——做什么（What），比如我们写如下的`SQL`语句：

{% highlight SQL %}
SELECT _id, name, age
FROM person
WHERE class_id = 3
;
{% endhighlight %}

我们“声明”了三个指令：

* 从`person`表中；
* 筛选班级编号为`3`的人；
* 输出`_id`、`name`和`age`三个字段（Property）；

我们没有使用`for-loop`去“命令”数据库，如何去实现筛选的：

{% highlight JavaScript %}
res = []
for (i = 0; i < person.length; i++) {
  if (person[i].class_id == 3) {
    res.push({person[i]._id, person[i].name, person[i].age})
  }
} // end loop

return res
{% endhighlight %}

## 运算法则（Theroy）并没有定义Mutable

我们有如下的加法结合律：

$$ (a + b) + c = a + (b + c)  $$

我们把这个结合律，分解成如下几个赋值的步骤：

{% highlight JavaScript %}
x = a + b
y = c
r1 = x + y
x = a
y = b + c
r2 = x + y

Assert.equals(r1, r2)
{% endhighlight %}

上述的赋值，意味着各个变量都是可变的（Mutable）。

但是，这个结合律里面，实际上，我们只定义了一个加法运算，
如果我们把一个加法运算提炼成一个函数，那么，这个函数
接收两个Number类型的参数，并返回它们的和：

$$ f(x, y) \triangleq x + y $$

上述的结合律，其实对应了如下的函数调用：

$$ f(f(a, b), c) == f(a, f(b, c)) $$

也就是说，加法结合律，这一个运算法则并没有定义任何的Mutable变量。

## 历史和定义

函数编程早期的语言是`Lisp`，与其相关的语言是`Scheme`。
在`Scheme`论坛里面，有一本称之为“The Bible”的书叫
《Structure and Interpretation of Computer Programs (SICP)》[^sicp]。

随后出现的函数式编程语言还有`Erlang`、`Haskell`。

运行在`.NET`上的FP是`F#`，而运行在`JVM`上的FP是`Scala`。

通常的，我们将函数式编程定义为：

* immutable；
* 没有赋值；
* 没有`if-else`、循环；
* 函数是Pure的；
* 函数和其它Type处在同一地位：可作参数、可作返回值。

# 两种Evaluation的方式

## REPL

我们可以在REPL下面执行`Scala`语句，REPL全称为：Read-Evaluation-Print-Loop，
表示：

* 读取输入的表达式；
* 求值；
* 输出结果；
* 重复第一步。

其中E就是Evaluation的意思——计算表达式的值。

## 表达式

精确的表达式定义可参考Scala Specification [^scala_spec_exp]，规格文档中，
采用了递归定义的方式。

为了便于理解，什么是递归定义，此处引用一阶谓词逻辑的“命题”的定义 [^wiki_formula]：

* 一个简单的句子是一个命题，比如“天是蓝色的”、“我是人”，在这些句子中，“是”是一个一阶谓词；
* 任意的一个命题$$A$$，它的否定形式也是一个命题 $$\neg A$$；
* 更一般地，对于任意一个命题$$A$$，使用任意一个一元操作符$$\otimes$$，也能称之为命题$$\otimes A$$；
* 任意两个命题$$A$$、$$B$$，使用任意一个二元操作符 [^wiki_connective]$$\otimes$$，也称之为命题$$A \otimes B$$。
  在谓词逻辑中，常见的二元操作符有“与”、“或”和“蕴含” [^fn_if-then]；
* 任意一个命题$$A$$，使用括号之后，依然是一个命题$$(A)$$，其真值表和原命题相同，并享有最高优先级。

## Call By-Value，CBV

我们来看第一种Evaluation的方式，定义如下两个函数：

函数一，求和：

$$f(x, y) = x + y$$

函数二，计算平方：

$$g(x) = x^2$$

对于复合函数平方和计算，我们有：

$$h(x, y) = x^2+y^2 = f(x^2, y^2) = f\left[ g(x), g(y) \right]$$

下面我们给出$$h(3, f(4,1))$$的求值过程：

{% highlight JavaScript %}
  h(3, f(4, 1))
= h(3, 4+1)

= h(3, 5)
= f(g(3), g(5)) = f(3*3, g(5)) = f(9, g(5))
= f(9, 5*5)

= f(9, 25)
= 9 + 25
= 34
{% endhighlight %}

在上面的Evaluation过程中，我们优先将“值”应用（Apply）到
表达式中的各个参数上，比如第一步里面，我们先计算出第二个参数$$f(4,1)$$
的最终值，再带入函数$$h(3,5)$$中做后续的计算。

这样的模式，我们称为Application模式。
并将这种模式下面的Evaluation，称为Call By-Value，简写为CBV。

## Call By-Name，CBN

同样上面的函数定义，我们来看第二种Evaluation的方式：

{% highlight JavaScript %}
  h(3, f(4, 1))
= f[g(3), g( f(4, 1) )]
= g(3) + g[f(4, 1)]
= 3*3 + g[f(4, 1)]          // A

= 9 + g[f(4, 1)]
= 9 + f(4, 1) * f(4, 1)     // B
= 9 + (4 + 1) * f(4, 1)

= 9 + 5 * f(4, 1)           
= 9 + 5 * (4 + 1)           // C
= 9 + 5 * 5
= 9 + 25
= 34
{% endhighlight %}

上面的Evalution过程，我们作如下备注。

步骤A的备注：

* 要想求得两个数相加的和，必须先Evaluate左边的值；
* 此时，对于二元操作符“加”而言，左边的表达式可以求值了，我们得到$$3*3=9$$；
* 加号右边的表达式是一个复合函数；
* 我们还可以继续将参数$$f(4, 1)$$替换（Substitute）进函数$$g(x)=x^2$$中；
* 替换（Substitute）得到步骤B的表达式$$g(f(4,1)) = \left[ f(4,1) \right]^2$$。

步骤B的备注：

* 对于表达式$$f(4, 1) * f(4, 1)$$这样一个乘法运算；
* 我们首先计算乘号左边的值；
* 替换（Substitute）得到$$(4 + 1) * f(4, 1)$$；
* 计算得到$$5 * f(4, 1)$$；
* 此时，乘号左边的值已经确定，我们“不得不”去Evaluate乘号右边的表达式$$f(4, 1)$$。

步骤C的备注：

* 既然已经求得第一个$$f(4,1)=5$$了，为什么不在同一时刻代入乘号右边的$$f(4,1)$$？
* 如果我们先后调用了两次$$f(4,1)$$，如何保证两次调用，最终Evaluate的值是一样的？
* 上面两个问题，包含函数编程的两个重要思想：Immutable和Pure，以后再解释。

上面的步骤，我们优先尝试将参数最原始的状态替代（Substitute）进入表达式。
直到，表达式没有参数可以替代了，“不得不”去计算一个原始状态，我们才调用加号、或者乘号求值。

这样的模式，我们称为Substitution模式。
并将这种模式下面的Evaluation，称为Call By-Name，简写为CBN。

## 收敛

如果一个Evaluation的过程，在有限的时间内，可以终止（Terminate）计算。
我们称该Evaluation是收敛的。

我们作如下的定义：

> 表达式$$A$$收敛，表示为$$\Lambda(A)$$，意味着：
>
> 在有限的时间内，存在一个值$$a$$，使得$$\Lambda(A) = a$$；
>
> 同时，我们将CBV下的收敛，简写为$$\Lambda_{\text{CBV}}(A)$$，
> 将CBN下的收敛，简写为$$\Lambda_{\text{CBN}}(A)$$


我们可得如下结论：

> 如果$$\Lambda_{\text{CBV}}(A)$$，则一定有$$\Lambda_{\text{CBN}}(A)$$；
>
> 反之未必。

练习：

> 举出一个“反之未必”的例子；
> 基于一阶谓词逻辑的命题定义，证明上述结论。

# 练习题参考答案

## 举出一个“反之未必”的例子

## 基于一阶谓词逻辑的命题定义的证明过程

# 参考文献

[^open_progfun1]: [Functional Programming Principles in Scala](https://www.coursera.org/learn/progfun1) from École Polytechnique Fédérale de Lausanne
[^sicp]: [ Structure and Interpretation of Computer Programs](https://mitpress.mit.edu/sicp/)
[^scala_spec_exp]: [Scala Specification, Chapter 6 Expressions](http://www.scala-lang.org/files/archive/spec/2.11/06-expressions.html)
[^wiki_formula]: [原子公式](https://zh.wikipedia.org/wiki/%E5%8E%9F%E5%AD%90%E5%85%AC%E5%BC%8F)
[^wiki_connective]: [逻辑运算符](https://zh.wikipedia.org/wiki/%E9%80%BB%E8%BE%91%E8%BF%90%E7%AE%97%E7%AC%A6)
[^fn_if-then]: 可以通过枚举真值表的方式证明，“蕴含”（$$A \rightarrow B$$）等价于复合命题$$\neg A \vee B$$。更一般地，可以证明，一阶谓词逻辑的所有命题，最多只需要“否定”、“或”两个连接词表示。
