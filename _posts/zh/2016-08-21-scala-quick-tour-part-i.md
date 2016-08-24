---
layout: post
title: "Scala函数编程（一）"
description: ""
category: "guide"
tags: ["scala"]
lang: zh
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 接下来的一系列《Scala函数编程》，得益于公开课《Functional Programming Principles in Scala》[^open_progfun1]。
> 我整理了函数编程中的重要概念，并加入了我两年Scala开发的心得体会 [^blog_bolero]。
>
> 为了便于理解，部分名词、专有术语，我直接使用英文，不作任何翻译。
>
> 《Scala函数编程》这一系列，不单纯只是原公开课的笔记整理。
> 我也加入了自己的理解、一些理论化的表述和一些练习题，供加深理解。
> 但我依然建议去听原版公开课，并完成所有的Assignment。另外，还要多写代码。
>
> 这一系列的文章，将按照如下顺序来写：
>
> * 一、函数编程的基本概念、函数类型和类型推断
> * 二、尾递归（Tail Recursion）和`List`
> * 三、OOP在`Scala`中的体现
> * 四、模式匹配
> * 五、其它线性数据结构类型介绍
> * 六、延迟执行和Monad、`map`和`flatMap`
> * 七、`Future[T]`、For Comprehension
> * 八、`Bolero`代码模板 [^github_bolero] 详解
>
> 本文是第一部分，包括如下内容：
>
> * 函数编程初览；
> * Evaluation：CBN和CBV；
> * 函数的类型（Type）；
> * 类型推断和类型匹配。

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

我们通常把编程 Paradigm 分成如下两种（参考C#讲座[^c9_lang_future]，公开课提到了三种）：

命令式 | 声明式
:-----|:-----
mutable | immutable
赋值 | 定义之后不能再赋值
if-else，循环等 | 模式匹配，递归等

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

* Immutable；
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

可以在命令行中输入`scala`，开启`Scala`语言的REPL页面：

{% highlight bash %}
$ scala
Welcome to Scala version 2.11.6 (OpenJDK 64-Bit Server VM, Java 1.8.0_91).
Type in expressions to have them evaluated.
Type :help for more information.

scala>
{% endhighlight %}

## 表达式

精确的表达式定义可参考Scala Specification [^scala_spec_exp]，规格文档中，
采用了递归定义的方式。

为了便于理解，什么是递归定义，此处引用一阶谓词逻辑的“命题”的定义 [^wiki_formula]：

* 一个简单的句子是一个命题，比如“天是蓝色的”、“我是人”，在这些句子中，“是”是一个一阶谓词；
* 任意的一个命题$$A$$，它的否定形式也是一个命题 $$\neg A$$；
* 更一般地，对于任意一个命题$$A$$，使用任意一个一元操作符$$\otimes$$，也能称之为命题$$\otimes A$$；
* 任意两个命题$$A$$、$$B$$，使用任意一个二元操作符 [^wiki_connective]$$\otimes$$，也称之为命题$$A \otimes B$$。
  在谓词逻辑中，常见的二元操作符有“与”、“或”和“蕴含” [^fn_if-then]；
* 任意一个命题$$A$$，使用括号之后，依然是一个命题$$(A)$$，其真值表和原命题相同，并在表达式中享有计算的最高优先级。

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
的最终值，再代入（Apply）函数$$h(3,5)$$中做后续的计算。

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

上面的Evalution过程，我们作如下解释。

步骤A的解释：

* 要想求得两个数相加的和，必须先Evaluate左边的值；
* 此时，对于二元操作符“加”而言，左边的表达式可以求值了，我们得到$$3*3=9$$；
* 加号右边的表达式是一个复合函数；
* 我们还可以继续将参数$$f(4, 1)$$替换（Substitute）进函数$$g(x)=x^2$$中；
* 替换（Substitute）得到步骤B的表达式$$g(f(4,1)) = \left[ f(4,1) \right]^2$$。

步骤B的解释：

* 对于表达式$$f(4, 1) * f(4, 1)$$这样一个乘法运算；
* 我们首先计算乘号左边的值；
* 替换（Substitute）得到$$(4 + 1) * f(4, 1)$$；
* 计算得到$$5 * f(4, 1)$$；
* 此时，乘号左边的值已经确定，我们“不得不”去Evaluate乘号右边的表达式$$f(4, 1)$$。

步骤C的解释：

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
> 同时，我们记$$\overline{\Lambda(A)}$$，表示为表达式$$A$$不收敛。
>
> 我们将CBV下的收敛，简写为$$\Lambda_{\text{CBV}}(A)$$，
> 将CBN下的收敛，简写为$$\Lambda_{\text{CBN}}(A)$$


我们可得如下结论：

> 如果$$\Lambda_{\text{CBV}}(A)$$，则一定有$$\Lambda_{\text{CBN}}(A)$$；
>
> 反之未必。

练习：

> 举出一个“反之未必”的例子；
>
> 基于一阶谓词逻辑的命题定义，证明上述结论：$$\Lambda_{\text{CBV}}(A) \rightarrow \Lambda_{\text{CBN}}(A)$$。

# 函数的基础知识

本小节不会介绍`Scala`中的基本Data Type，这些基础知识，可以在`Scala`的官方文档或者
《Programming in Scala》[^scala_progfun_2nd]（Chapter 5 Basic Types and Operations）中找到。

本小节，暂时不会涉及到泛型相关的话题。

## 通常的函数定义

{% highlight Scala %}
scala> def sum(x: Int, y: Int): Int = x + y
sum: (x: Int, y: Int)Int

scala> def square(x: Int): Int = x * x
square: (x: Int)Int
{% endhighlight %}

完整的函数定义规格文档参考官方文档（引用），如下做简要说明，通常的函数定义从左到右依次为：

* `def`关键字，表示开始定义一个函数；
* 函数名称，如上面的`sum`和`square`；
* 函数参数定义列表，由一个括号包围，定义如下：
    - 函数可以不接受任何参数，此时参数列表为空，括号可以省略；
    - 函数只有一个参数定义，包含参数名称、冒号和参数类型（Type）；
    - 函数如果有多个参数，则使用逗号分割；
* 函数的返回类型定义，由冒号和类型（Type）组成；
* 函数的函数体，由等号和表达式组成。

## 函数调用

`Scala`中函数调用和大多数语言一样，唯一的不同在于，如果函数接收空参数，那么
调用时，括号可以省略：

{% highlight Scala %}
scala> sum(1, 2)
res6: Int = 3

scala> def random(): Int = scala.util.Random.nextInt(5)
random: ()Int

scala> random()
res8: Int = 4

scala> random
res9: Int = 1
{% endhighlight %}

此处有备注：

> 有关随机函数是否为Pure的讨论，可以参考StackOverflow中的讨论：
>
> stackoverflow.com/questions/31818787


## Scope

使用花括号包围的一个Block，构成了一个局部的Scope。

在`Scala`中，一个Block也是一个表达式，它的值就是这个Block中，最后一个表达式的值。

练习：

> 请问`result`的值是多少？
>   
>     val x = 0
    def f(x: Int) = x + 1
    val result = {
      val x = f(1)
      x * x
    } + x


正因为一个Block也是一个表达式，我们也说过，函数体是由等号和表达式构成的，所以
函数的定义也可以包含一个Block：

{% highlight Scala %}
scala> def f(x: Int): Int = {
         val y = x + 1
         y
       }

f: (x: Int)Int

scala> f(3)
res10: Int = 4

{% endhighlight %}

## 匿名函数

我们可以定义一个匿名函数：

{% highlight Scala %}
scala> (x: Int, y: Int) => x + y
res19: (Int, Int) => Int = <function2>

scala> res19(1, 2)
res20: Int = 3
{% endhighlight %}

上述的匿名函数，等价于一个Block：

{% highlight Scala %}
{
  def res19(x: Int, y: Int): Int = x + y
  res19
}
{% endhighlight %}

# 函数类型

仔细留意`Scala`的REPL输出值（Print）。
类型
对于具名函数的定义：

{% highlight Scala %}
scala> def sum(x: Int, y: Int): Int = x + y
sum: (x: Int, y: Int)Int
{% endhighlight %}

对于匿名函数的定义：

{% highlight Scala %}
scala> (x: Int, y: Int) => x + y
res19: (Int, Int) => Int = <function2>
{% endhighlight %}


我们称，`(Int, Int) => Int`是一个函数类型，它是一个无穷集合，该集合：

* 每一个元素都是一个函数；
* 任意一个函数满足：
    - 接收两个参数；
    - 第一个参数是`Int`类型；
    - 第二个参数是`Int`类型；
    - 函数返回一个`Int`类型；
* 不满足如上条件的函数定义，不能成为该集合的一个元素。

如果函数不需要参数，则它对应的函数类型为：`() => ?`，比如：

{% highlight Scala %}
scala> () => 1
res24: () => Int = <function0>
{% endhighlight %}

## 函数作为参数

函数类型（Type）类似于其它普通类型——比如`Int`——可以作为参数传递：

{% highlight Scala %}
scala> def sumBy(x: Int, y: Int, by: Int => Int) = by(x) + by(y)
sumBy: (x: Int, y: Int, by: Int => Int)Int

scala> sumBy(1, 2, x => x * x)
res27: Int = 5
{% endhighlight %}

`sumBy`中的第三个参数`by`是一个函数类型，它表示：

* `by`这个参数接收一个函数；
     - 这个函数接收一个`Int`作为参数；
     - 并返回一个`Int`；
* 不满足`Int => Int`类型的，都无法传递给`by`这个参数。

上述`sumBy`对应的函数类型为：

{% highlight Scala %}
(Int, Int, Int => Int) => Int
{% endhighlight %}

## 函数作为返回值

同样地，函数类型（Type）类似于其它普通类型——比如`Int`——可以作为值返回：

{% highlight Scala %}
scala> def g(step: Int) = (x: Int) => step + x
g: (step: Int)Int => Int

scala> val s1 = g(1)
s1: Int => Int = <function1>

scala> val s3 = g(3)
s3: Int => Int = <function1>

scala> s1(2)
res28: Int = 3

scala> s3(2)
res29: Int = 5
{% endhighlight %}

上述`g`的定义等价于：

{% highlight Scala %}
def g(step: Int): Int => Int = {
  def f(x: Int) = step + x

  f
}
{% endhighlight %}

对应的函数类型为：

{% highlight Scala %}
Int => Int => Int
{% endhighlight %}

在函数类型的表示中，默认从右向左看，所以如下两个定义是等价的：

{% highlight Scala %}
Int => Int => Int
Int => (Int => Int)
{% endhighlight %}

表示：

* 使用一个`Int`参数；
* 可以返回（构造出）一个函数；
* 构造出来的函数接收一个`Int`参数；
* 构造出来的函数最终返回一个`Int`值。

所以，上述的函数类型，有别于如下的函数类型：

{% highlight Scala %}
(Int => Int) => Int
{% endhighlight %}

`(Int => Int) => Int`，表示为：

* 首先接收一个函数作为参数；
* 这个函数参数将`Int`映射成一个`Int`；
* 整个函数，最终返回一个`Int`。

练习：

> 定义一个函数，使其函数类型满足`(Int => Int) => Int`。

## 类型推断

我们可以让`Scala`编译器，来推断函数的返回值，比如：

{% highlight Scala %}
scala> def f(x: Int, y: Int) = x + y
f: (x: Int, y: Int)Int
{% endhighlight %}

应用在两个`Int`上的加法运算，得到的结果也是一个 `Int`。
这就是类型推断的结果，帮助我们简化了函数定义。

类型推断，也可以推出函数类型：

{% highlight Scala %}
scala> def g(step: Int) = (x: Int) => step + x
g: (step: Int)Int => Int
{% endhighlight %}

如果编译器的类型推断和函数定义的返回类型一致，则称该函数的定义合法。

## 类型匹配

函数的调用需要进行类型匹配，先来看基本类型的匹配：

{% highlight Scala %}
scala> def f(x: Int, y: Double) = x + y
f: (x: Int, y: Double)Double

scala> f(1, 2)
res34: Double = 3.0

scala> f(1.0, 2.0)
<console>:9: error: type mismatch;
 found   : Double(1.0)
 required: Int
              f(1.0, 2.0)
                ^
{% endhighlight %}


函数类型（Type）类似于其它普通类型——比如`Int`——调用包含函数参数的函数，也
需要进行类型匹配：

{% highlight Scala %}
scala> def sumBy(x: Int, y: Int, by: Int => Int) = by(x) + by(y)
sumBy: (x: Int, y: Int, by: Int => Int)Int

scala> sumBy(1, 2, 3)
<console>:9: error: type mismatch;
 found   : Int(3)
 required: Int => Int
              sumBy(1, 2, 3)
                          ^

scala> sumBy(1, 2, x => x*x)
res37: Int = 5

scala> def f(x: Int) = x + 1
f: (x: Int)Int

scala> sumBy(1, 2, f)
res38: Int = 5
{% endhighlight %}

我们将参数列表数量相同，并且类型匹配的函数调用，称为合法的函数调用。

## 函数的返回值不要过度依赖类型推断

不要过度依赖类型推断，在设计复杂类（尤其存在泛型）的时候，显式地定义函数返回类型，
可以保证函数的逻辑正确，如果不显式定义返回类型的话， `Bolero`中常用的如下的类型，很容易混淆：

{% highlight Scala %}
Future[T]
Future[Option[T]]
Future[Future[T]]
Future[Seq[T]]
Seq[Future[T]]
// 未来的章节，会提到这些类型
{% endhighlight %}

## `Scala`语言中如何定义Call By-Value

使用`val`可以定义一个CBV的表达式，在定义的那一刻就完成Evaluation。

## `Scala`语言中如何定义Call By-Name

使用`def`可以定义一个CBN的表达式，只有在“不得不”的时候，才会Evaluate。

## 函数参数中的CBV和CBN

通常的，所有函数参数都是CBV的，可以按照如下方式，定义一个CBN：

{% highlight Scala %}
def f(x: Int, y: => Int) =
  if (x > 0) x else y
{% endhighlight %}


可以改写为：

{% highlight Scala %}
def f(x: Int, y: () => Int) =
  if (x > 0) x else y()
{% endhighlight %}

# 综合练习

## 根据函数定义，写出它们对应的函数类型

举例：

{% highlight Scala %}
def f(x: Int): Int = x + 1
// 对应的函数类型为：Int => Int
{% endhighlight %}


题目：

{% highlight Scala %}
def f(x: Int, y: Int, z: Int): Int = x + y - z
def f(x: Int, y: Int, z: Int) = x * (y / z)
def f(x: Int, y: Int, z: Int) = (x * 1.0) * (y + z)

def f(x: Int): Int => Int = {
  def g(y: Int) = x + y
  g
}
def f(x: Int) = y => x + y

def f(x: Int, y: () => Int) = x + y()
def f(x: Int, y: (Int, Int) => Int) = y(x, x+1)

def f(x: Int) = (y: Int) => x + y

def f(x: Int, y: () => Int) = (z: Int) => x + y() + z
def f(x: Int) = (y: Int, z: Int) => x + y + z

def f(x: Int, y: () => Int) = x + (() => y())()
{% endhighlight %}

## 判断下列的函数定义，是否合法

举例：

{% highlight Scala %}
def f(x: Int): Int = x + 1
// 该函数定义合法，因为当x是整数的时候，(x + 1) 也是一个整数；
// 类型推断符合函数返回类型

def f(x: Int): String = x + 1
// 该函数定义不合法，因为(x + 1)是一个整数，但是函数需要一个String作返回值；
// 类型推断不符合函数的返回类型
{% endhighlight %}

题目：

{% highlight Scala %}
def f(x: Int): Int = x
def f(x: Int): Double = x
def f(x: Int): Double = x + 0.0

def f(x: Int, y: Double, z: String): Int = x + y - z.length
def f(x: Int, y: Double, z: String): Int = z

def f(x: Int, y: () => Int): Int = x + y()
def f(x: Int, y: () => Int): Int = y

def f(x: Int, y: Int => Int): Int = y(x)
def f(x: Int, y: Int => Int): Int = (z: Int) => y(x) + z
{% endhighlight %}

## 判断下列的函数调用，是否合法

举例：

{% highlight Scala %}
def f(x: Double): Double = x + 1.0
f()         // 调用不合法，因为参数列表的数量不匹配
f(1.0)      // 调用合法，参数列表的数量、类型都匹配
f(1)        // 调用合法，参数列表的数量相同，Int类型可以隐式转换为Double类型
{% endhighlight %}

题目：

{% highlight Scala %}
def f(x: Int, y: Double, z: String): Int = x + y - z.length
f(1, 2, 3)
f(1, 2, "3")
f(1.0, 2.0, "3.0")

def f(x: Int, y: () => Int) = x + y()
def g: Int = 2
def h() = 2
f(1, 2)
f(1, () => 2)
f(1, (x: Int) => 2)
f(1, g)
f(1, g())
f(1, h)
f(1, h())

def f(x: Int, y: Int => Int) = y(x)
f(1, 2)
f(1, x => x)
f(1, (x: Int) => x)
f(1, (x: Int, y: Int) => x)
{% endhighlight %}

## 根据函数类型，定义一个满足该类型的函数

尽量使用匿名表达式定义如下函数。

举例：

{% highlight Scala %}
// 对于函数类型：Int => Double，可定义
def f(x: Int) = x * 1.0
// 对应的匿名表达式为
(x: Int) => x * 1.0
{% endhighlight %}


题目：

{% highlight Scala %}
() => Int
Int => Int

(Int, Int) => Int

Int => Int => Int
Int => (Int => Int)

(Int, Int => Int) => Int
(Int, Int => Int) => Int => Int

Int => Int => Int => Int

Int => (Int => Int) => Int
{% endhighlight %}

## 将包含CBN参数的函数，改写成类似的普通函数

举例参考正文中的例子。

题目：

{% highlight Scala %}
def f(x: Int, y: => Int) = x + y

def f(x: Int, y: => Int) =
  if (x > 0) x else y

def f(x: Int, y: => Int) =
  (z: Int) => x + y + z
{% endhighlight %}

## 设计一个布尔类型

（略）

注意CBV和CBN的使用。

# 练习题参考答案

## 举出一个“反之未必”的例子

定义两个函数：

函数一，永久循环累加：

$$f(x) = x + (x+1) + (x+2) + \ldots + \infty = \sum_{t=x}^{\infty} t$$


函数二，有条件地返回第一个参数：

$$g(x, y) =  (x > 0) \; ? \;x : y $$

则：

$$\Lambda_{\text{CBN}}\left( g[1, f(0)]\right) = 1$$，但是$$\overline{\Lambda_{\text{CBV}}(g[1, f(0)])}$$


## 基于一阶谓词逻辑的命题定义的证明过程

题目：

> 基于一阶谓词逻辑的命题定义，证明：$$\Lambda_{\text{CBV}}(A) \rightarrow \Lambda_{\text{CBN}}(A)$$

证明：

根据一阶谓词逻辑下，对“命题”的递归定义，使用归纳法证明：

首先考虑命题$$A$$、$$B$$是一个简单句，此时$$\Lambda_{\text{CBV}}(A)$$等同于$$\Lambda_{\text{CBN}}(A)$$。

于是不难证明，当$$A$$是一个简单句时：

* (1)，$$\Lambda_{\text{CBV}}(A) \rightarrow \Lambda_{\text{CBN}}(A)$$；
* (2)，$$\Lambda_{\text{CBV}}(\neg A) \rightarrow \Lambda_{\text{CBN}}(\neg A)$$，该结论使用反证法可得；
* (3)，$$\Lambda_{\text{CBV}}[(A)] \rightarrow \Lambda_{\text{CBN}}[(A)]$$，该结论使用反证法可得；

下面证明，当命题$$A$$、$$B$$是一个简单句，对于任意的二元操作符$$\otimes$$，同样满足：

$$\Lambda_{\text{CBV}}(A \otimes B) \rightarrow \Lambda_{\text{CBN}}(A \otimes B) $$

先看蕴含式的左边，我们可得：

$$\Lambda_{\text{CBV}}(A \otimes B) \rightarrow \Lambda_{\text{CBV}}(A) \wedge \Lambda_{\text{CBV}}(B) $$

因为（反证法），在CBV的情况下，若$$A$$和$$B$$中存在任意一个无法Evaluation的情况，二元操作符$$\otimes$$都不能执行，最终
导致$$\overline{\Lambda_{\text{CBV}}(A \otimes B)}$$，和题目本意矛盾。

于是，我们证明了，当命题$$A$$、$$B$$是一个简单句，对于任意的二元操作符$$\otimes$$，如果
$$\Lambda_{\text{CBV}}(A \otimes B)$$，则在有限的时间内：

* (4)，$$\exists a \rightarrow \Lambda_{\text{CBV}}(A) = a$$；
* (5)，$$\exists b \rightarrow \Lambda_{\text{CBV}}(B) = b$$；

进而，

$$\Lambda_{\text{CBN}}(A \otimes B)  \;{\tiny\begin{matrix}\\ \normalsize = \\ ^{\scriptsize (4)}\end{matrix}}\; \Lambda_{\text{CBN}}(a \otimes B)  \;{\tiny\begin{matrix}\\ \normalsize = \\ ^{\scriptsize (5)}\end{matrix}}\; \Lambda_{\text{CBN}}(a \otimes b) = a\otimes b$$

之后，使用递归，对复杂命题同理证明。


（略）

# 参考文献

[^c9_lang_future]: [TechDays 2010 Keynote by Anders Hejlsberg: Trends and future directions in programming languages](https://channel9.msdn.com/blogs/adebruyn/techdays-2010-developer-keynote-by-anders-hejlsberg)
[^blog_bolero]: [Bolero——基于Scala、Play!和ReactiveMongo的RESTful代码模板](https://scozv.github.io/blog/zh/guide/2016/07/27/bolero-a-restful-scaffold-with-scala)
[^github_bolero]: [Bolero, 源代码](https://github.com/scozv/bolero)
[^open_progfun1]: [Functional Programming Principles in Scala](https://www.coursera.org/learn/progfun1) from École Polytechnique Fédérale de Lausanne
[^sicp]: [ Structure and Interpretation of Computer Programs](https://mitpress.mit.edu/sicp/)
[^scala_spec_exp]: [Scala Specification, Chapter 6 Expressions](http://www.scala-lang.org/files/archive/spec/2.11/06-expressions.html)
[^scala_progfun_2nd]: Martin Odersky, Lex Spoon, Bill Venners. Programming in Scala (Second Edition), Artima Press
[^wiki_formula]: [原子公式](https://zh.wikipedia.org/wiki/%E5%8E%9F%E5%AD%90%E5%85%AC%E5%BC%8F)
[^wiki_connective]: [逻辑运算符](https://zh.wikipedia.org/wiki/%E9%80%BB%E8%BE%91%E8%BF%90%E7%AE%97%E7%AC%A6)
[^fn_if-then]: 可以通过枚举真值表的方式证明，“蕴含”（$$A \rightarrow B$$）等价于复合命题$$\neg A \vee B$$。更一般地，可以证明，一阶谓词逻辑的所有命题，最多只需要“否定”、“或”两个连接词表示。
