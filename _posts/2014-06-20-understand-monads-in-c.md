---
layout: post
title: "Understand Monads in C#"
description: "An Short Literature Review on Monads in C#"
category: "pattern"
tags: ["LINQ", "C#", "monad", "Scala"]
---

{% include JB/setup %}


# 摘要
{:.no_toc}

> 本文主要对几篇讨论Monad的文献进行综述，文中的大部分代码都来自参考文献（我会指明参考来源）。本文有几处地方提出了几个思考题，这些思考题也来自参考文献，建议先尝试写写这些思考题，再去阅读参考文献。这一份综述尝试抛开函数编程的背景，去看看我们平时已经在使用但却没有留意的一些Monad。文章主要涉及到C#这门语言，但是不同的语言背景并不会有太多的影响。
> 
> 我推荐阅读参考文献中的英文原文。虽然中文意合英文形合[^G08]，但是本文的综述将使用中文，除了部分程序代码，和一些术语、人名 that 我不打算翻译的。
> 
> 本文对Haskell和.NET中异步Task的理解不够，如果需要了解Task这个Monad的话，请参考Stephen Toub的文章[^ST13]。另外，本文对Monad的综述都建立在强类型系统的基础上，关于JavaScript中的Monad，请观看Douglas Crockford的演讲。Douglas说“假如你理解了Monad，你就失去了用语言来解释它的能力”[^DC13]。

<!--more-->


* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# 一个略微复杂的思考题
假如我们有如下这样一个委托，称其为K：

	delegate Answer K<T,Answer>(Func<T,Answer> k);

其中，T、Answer都是泛型类型。这个委托等价于：

	Func<Func<T, Answer>, Answer> K;

也就是说，K这个类型是一类函数签名，这类函数返回一个值Answer，接收一个参数，而接收的参数又是一类函数Func<T, Answer\>。

另外，给出K的构造方法：

	public static K<T, Answer> ToContinuation<T, Answer>(this T value)
	{
		return (Func<T, Answer> solve) => solve(value);
	}

现在的问题是，参考K的构造方法，如何实现下面这个方法，保证它能够编译通过，即方法的返回类型和方法签名匹配？

	public static K<U, Answer> SelectMany<T, U, Answer>(this K<T, Answer> m, Func<T, K<U, Answer>> k)

这个问题来自Wes Dyer文章的最后一部分[^WD08]，我认为，如果能在看懂题意的基础上，尝试写一写内部实现，将有助于理解Monad。如果对题目有些费解，请先往下看。本文的最后会再次提到这个题目。

# 身边的几个泛型类
Eric Lippert在他的Monad系列[^EL13]中，给出了如下几个泛型类，并借助这几个泛型类，由浅入深地揭示了Monad的性质。

	Nullable<T>
	IEnumerable<T>
	Lazy<T>
	OnDemand<T>
	Task<T>

其中，OnDemand<T\>本质上是Func<T\>，指的是一类无参有返回值的函数，Eric这样做，是为了和更一般的Func<V, U\>加以区别。

这几个泛型类的特点是，它们都赋予了T新的能力：

* Nullable<T\> 使得T可空；
* IEnumerable<T\> 使得T可以被遍历；
* Lazy<T\> 使得T只在第一次需要的时候才计算，之后都从cache中获取；
* OnDemand<T\> 使得T只有在需要的时候才被调用；
* Task<T\> 使得...

因为这些泛型类扩展了T的能力，所以，我们称它们为Amplifier，对于这一类扩展后的类型，我们统一用M<T\>来表示。

# 数学理论中的复合映射
抛开计算机语言或者函数编程的思维，我们先来回顾一下高等数学中复合函数的概念。为了和计算机程序设计中的函数加以区别，我们使用映射这个术语。

给定如下两个映射：

$g(x) =  x^2-4x, f(x) = \ln (x+4)$
 
令复合映射：

$p(x) = f(g(x)) $

符号计算得知：

$ p(x)= \ln (x^2-4x+4) = \ln [(x-2)^2] = 2 \ln (x-2) $

我们可以看到，复合映射之后，新的映射计算过程被重新组合，我们并不需要先计算出$$x^2-4x$$的值，再代入第二层函数。
  
我们思考，假如：

0. 令$$x=e+2=4.718281828459045$$，我们是计算$$(4.718281828459045)^2-4*4.718281828459045$$容易呢，还是计算$$2 \ln (e+2-2)=2\ln e = 2$$容易？
1. 或者，运算器不支持平方运算，却有一张对数表，那么我们通过符号运算化简得到$$p(x)$$，才能计算出结果；
2. 又或者，在程序语言中，传入的参数是Int.MaxValue，平方运算很可能超出存储的范围，那么我们也最好到最后再去用新的映射加以计算。

所以，有些事儿不要急着去处理。后面我们还会看到这句话。
  
# 从复合映射到复合函数
Wes Dyer在他的文章中用程序语言的方式来描述复合映射这样的概念[^WD08]，Wes Dyer首先给出对一般类型T的函数复合：

	public static Func<T, V> Compose<T, U, V>(this Func<U, V> f, Func<T, U> g)
	{
	    return x => f(g(x));
	}

在前面的小节里，我们提到，诸如Nullable<T\>这些泛型类，它们扩展了T的能力，对于这一类扩展后的类型，我们统一用M<T>来表示。

如果我们用M<V\>和M<U\>来替换上面的签名，比如用Nullable<V\>和Nullable<U\>来替换：

	public static Func<T, Nullable<V>> Compose<T, U, V>(this Func<U, Nullable<V>> f, Func<T, Nullable<U>> g)
	{
	    return x => f(g(x)); // 编译错误，g(x)返回一个Nullable<U>，但是f只接收U作为传入参数
	}

简单的替换导致编译错误，因此Wes Dyer在文中引入了一个中间函数Bind，用来解决值域属于M<T\>复合函数的绑定：

	public static M<V> Bind<U, V>(this M<U> m, Func<U, M<V>> k);
	
	public static Func<T, M<V>> Compose<T, U, V>(this Func<U, M<V>> f, Func<T, M<U>> g)
	{
	    return x => Bind(g(x), f);
	}

那么，前文提到的那些M<T\>：Nullable<T\>, Lazy<T\>, OnDemand<T\>, Task<T\>, IEnumerable<T\>，这些类型的Bind函数分别应该如何实现呢？

# 一个简单的加法运算

扩展了一个T之后，我们现在有了增强版的类型M<T\>。一个类型，总会有一些动态的行为。Eric Lippert在他的Monads系列中的第三部分，为上述的一些M<int\>增加了一个加法运算[^EL13-3]：

	static Nullable<int> AddOne(Nullable<int> nullable)
	{ 
	  if (nullable.HasValue)
	  {
	    int unwrapped = nullable.Value;
	    int result = unwrapped + 1;
	    return CreateSimpleNullable(result);
	  }
	  else  
	    return new Nullable<int>();
	}

以及OnDemand<T\>的加法运算：

	static OnDemand<int> AddOne(OnDemand<int> onDemand)
	{ 
	  return ()=>
	  {
	    int unwrapped = onDemand();
	    int result = unwrapped + 1;
	    return result;
	  };
	}

注意，我们前面提到，有些事儿不要着急去处理，OnDemand<int\>的加法运算为什么不这样写呢？

	// 不要采用这样的实现方式
	static OnDemand<int> AddOne(OnDemand<int> onDemand)
	{
	  int unwrapped = onDemand();
	  int result = unwrapped + 1;
	  return ()=>{return result;}
	}

因为我们过早地计算了最初的onDemand承载的值。

现在，参考上面两个实现，请写出其它M<T\>的加法运算：

	static Lazy<int> AddOne(Lazy<int> lazy)
	static IEnumerable<int> AddOne(IEnumerable<int> sequence)
	async static Task<int> AddOne(Task<int> task)

答案在Eric的Monads系列中，请阅读参考文献。

# 更一般化的加法运算
如何我们仔细地阅读上面的两个加法运算，我们会发现，加法这个操作，只出现在一个地方：

	int result = unwrapped + 1;

Eric在他的Monads系列的第四部分，将加法运算更一般化了[^EL13-4]：

	static Nullable<R> ApplyFunction<A, R>(Nullable<A> nullable, Func<A, R> function)
	{
	  if (nullable.HasValue)
	  {
	    A unwrapped = nullable.Value;
	    R result = function(unwrapped);
	    return new Nullable<R>(result);
	  }
	  else
	    return new Nullable<R>();
	}
	
    // 使用ApplyFunction构造具体的复合函数
	static Nullable<int> AddOne(Nullable<int> nullable)
	{
	  return ApplyFunction(nullable, (int x) => x + 1);
	}

我们可以看到，加法运算只是ApplyFunction的一个特例。

同样的，参考上面的实现，请思考其它几个M<T\>的ApplyFunction应该如何实现：

	static Lazy<R> ApplyFunction<A, R>(Lazy<A> lazy, Func<A, R> function);
	static OnDemand<R> ApplyFunction<A, R>(OnDemand<A> onDemand, Func<A, R> function);
	static IEnumerable<R> ApplyFunction<A, R>(IEnumerable<A> sequence, Func<A, R> function);
	async static Task<R> ApplyFunction<A, R>(Task<A> sequence, Func<A, R> function);

# 平面化
设想，我们有如下一个方法，它计算一个整数的对数，当x小于零的时候，$$\log$$函数没有意义，将返回一个空：

    Nullable<int> SaftLog(int x) {return x > 0 ? Math.Log(x) : null;}

如果把这个函数传给上一节给出的ApplyFunction，会有什么问题呢？

    static Nullable<R> ApplyFunction<A, R>(Nullable<A> nullable, Func<A, R> function);

通过依次比对类型签名，我们发现，R对应的是Nullable<int\>，也就是说，ApplyFunction返回的类型是：

    Nullable<Nullable<int>>

首先，这在C#是不合法的，Nullable只能用在值类型上面。其次，就算合法，但也过多嵌套。同样的，Lazy<Lazy<int\>\>，OnDemand<OnDemand<T\>\>等都是不合适的。我们需要将其平面化。

Eric在他Monads系列的第五部分给出了新的一个函数签名[^EL13-5]：

    static Nullable<R> ApplySpecialFunction<A, R>(Nullable<A> nullable, Func<A, Nullable<R>> function)

回忆，在复合函数那一小节，Wes Dyer给出了如下的函数签名：

    public static M<V> Bind<U, V>(this M<U> m, Func<U, M<V>> k);

我们看到，这两个签名本质上是相同的。

同样的，作为辅助思考的练习，请写出如下签名的实现：

    static Nullable<R> ApplySpecialFunction<A, R>(Nullable<A> nullable, Func<A, Nullable<R>> function);
    static OnDemand<R> ApplySpecialFunction<A, R>(OnDemand<A> onDemand, Func<A, OnDemand<R>> function);
    static Lazy<R> ApplySpecialFunction<A, R>(Lazy<A> lazy, Func<A, Lazy<R>> function);
    static async Task<R> ApplySpecialFunction<A, R>(Task<A> task, Func<A, Task<R>> function);
    static IEnumerable<R> ApplySpecialFunction<A, R>(IEnumerable<A> sequence, Func<A, IEnumerable<R>> function);

# Monad的历史
Wes Dyer在他的文章中简述了Monad的历史[^WD08]。他指出，Monad这个概念来自理论数学的范畴论，Eugenio Moggi在其文章《Notions of computation and monads》将Monad引入了计算机科学领域。Philip Wadler在其著作《The essence of functional programming》探讨了Monad的应用。Haskell中更是大量的使用了Monad。

这样一来，使得我们一说到Moand就和函数编程扯上关系。就好比面向对象、UML的特性容易表达设计模式那样，我们常常一说到设计模式，就往OOP上面靠[^CH13]。

要知道，函数编程里面的匿名函数λ表达式，也是从理论数学中发展过来的[^WL14]。Eric也多次提及LINQ的设计者之一Erik Meijer正式Haskell的设计参与者，比如他在StackOverflow上对LINQ与Haskell关系的回答[^EL11]。

# Monad的性质
Eric指出Monad是类型（Type）的一种设计模式，是对现有Type的能力的一种放大（amplifier），或者是对T的一种wrapper，借助之前提到的几个M<T\>，我们很容易地设计出一种“asynchronously-computed sequence of nullable bytes”[^EL13-2]类型：

    Task<IEnumerable<Nullable<int>>>

所以我们需要一个构造器将T转化为M<T\>，这就是下面我们会看到的Unit。

另外，Moanded类型还需要定义一个操作，用来复合函数。该放大器不会改变底层（Underlying）类型的原有特性。更重要的是，诸如OnDemand的复合，我们只有在最后invoke函数的时候，才去计算，不能过早。诸如IEnumerable<T\>的复合，只有最终需要内部元素的时候，才去遍历，不能过早。诸如IQueryable<T\>，只有最终需要拿回查询结果的时候，再去连接数据源，也不能过早。

一个直观的例子就是：
    
    // C#
    IEnumerabe<T>.Select().Where().FirstOrDefault();
    // Scala
    Seq[T].map().filter().firstOrDefault();

我们可以看到，在这样一条复合运算中，最终只需要一个值，如果数组很长，映射的运算非常耗时，过早地遍历数组显然不是明智之举。是的，LINQ的延迟运算，就是基于这样的思想。

Eric在文中提出[^EL13-8]：

> You might have noticed that the asynchronous, lazy, on-demand and sequence monads all have an interesting common property: when you apply a function to any of these monads, what you get back is an object that will perform that function in the future. Essentially, the bind function takes an immutable workflow and its subsequent step, and returns you the resulting new workflow. The bind operator does not execute the workflow; it makes a new workflow out of an old one.

这个复合操作就是我们下面看到的Bind，在C#中，对应的函数名为SelectMany，在Scala中，对应的叫flatMap。

Wes Dyer表明，如果放大用Unit来构造，复合用Bind来表示的话，我们需要如下两个签名[^WD08]：

    static M<T>  Unit<T>(T value);
    static M<R>  Bind<T, R>(M<T>, Func<T, M<R>>)

并满足如下的三个法则：

1.  Left Identity

     Bind(Unit(e), k) = k(e)

2.  Right Identity

     Bind(m, Unit) = m

3.  结合律

     Bind(m, x => Bind(k(x), y => h(y)) = Bind(Bind(m, x => k(x)), y => h(y))


# 开头的思考题

文章开头的练习题来自Wes Dyer的文献，那道题让我们习惯函数的返回值也是一个函数。

接下来，让我们来看Eric给出的思考题，这个思考题让我们尝试去设计一个Monad。

正如上一节所说，C#的Bind取名为SelectMany，给定实现[^EL13-10]：

    static IEnumerable<R> SelectMany<A, R>(this IEnumerable<A> sequence, Func<A, IEnumerable<R>> function)
    { 
      foreach(A outerItem in sequence) 
        foreach(R innerItem in function(outerItem)) 
          yield return innerItem; 
    }

使用SelectMany，请设计如下的实现：

    static IEnumerable<A> Where(this IEnumerable<A> source, Func<A, boolean> prediction);
    static IEnumerable<R> Selcect(this IEnumerable<A> source, Func<A, R> map);

借助SelectMany、Where和Select，我们可以实现更复杂的Join操作，请练习（暂时不要考虑时间复杂度效率的问题）：

    public static IEnumerable<TResult> Join<TOuter, TInner, TKey, TResult>(
        this IEnumerable<TOuter> outer,
        IEnumerable<TInner> inner,
        Func<TOuter, TKey> outerKeySelector,
        Func<TInner, TKey> innerKeySelector,
        Func<TOuter, TInner, TResult> resultSelector,
        IEqualityComparer<TKey> comparer
    )

我强烈建议在查阅文献之前，动手写写这三个实现，对我们理解Monad有很大的帮助。我自己也尝试写过一遍，你可以参考我的Gist。

# 总结
Monad是一种类型的设计模式，用来放大现有Type的能力。需要满足一些法则，并且向Monad上面添加操作流的时候，我们不要提早运行，而丢失了Monad特性。

添加操作类的过程，在Haskell中叫Bind，在C#中叫SelectMany，在Scala中叫flatMap。这样，对于凡是实现了这些签名的类，就可以在For Comperhensoin中使用了，Eric在Monad系列的第十二部分，对此有详细的阐述，同时还讨论了如何解决SelectMany多重嵌套导致的效率低下问题。

正如Eric指出的那样，Monad是类型的一种设计模式。所以Scala的Try[T]类，Rx库（rx.codeplex.com）中的IObservable<T\>，还有LINQ，都是基于这样的设计模式。

最后，再次推荐阅读参考文献的英文原文。

# 参考文献

[^EL13]: Eric Lippert. [Monads](http://ericlippert.com/category/monads)[J/OL] 2013

[^EL13-2]: Eric Lippert. [Monads, Part 2](http://ericlippert.com/2013/02/25/monads-part-two/)[J/OL] 2013.02.25

[^EL13-3]: Eric Lippert. [Monads, Part 3](http://ericlippert.com/2013/02/28/monads-part-three/)[J/OL] 2013.02.28

[^EL13-4]: Eric Lippert. [Monads, Part 4](http://ericlippert.com/2013/03/04/monads-part-four/)[J/OL] 2013.03.04

[^EL13-5]: Eric Lippert. [Monads, Part 5](http://ericlippert.com/2013/03/07/monads-part-five/)[J/OL] 2013.03.07

[^EL13-8]: Eric Lippert. [Monads, Part 8](http://ericlippert.com/2013/03/18/monads-part-eight/)[J/OL] 2013.03.18

[^EL13-10]: Eric Lippert. [Monads, Part 10](http://ericlippert.com/2013/03/25/monads-part-ten/)[J/OL] 2013.03.25

[^EL11]: Eric Lippert. [Answer to _Are there any connections between Haskell and LINQ?_](http://stackoverflow.com/a/4683716)[EB/OL]. StackOverflow.com 2011.01.13

[^WD08]: Wes Dyer. [The Marvels of Monads](http://blogs.msdn.com/b/wesdyer/archive/2008/01/11/the-marvels-of-monads.aspx)[J/OL] 2008

[^DC13]: Douglas Crockford. Monads and Gonads, in the Speech named _JavaScript the Good Parts_

[^ST13]: Stephen Toub. [Tasks, Monads, and LINQ](http://blogs.msdn.com/b/pfxteam/archive/2013/04/03/tasks-monads-and-linq.aspx)[J/OL] 2013

[^CH13]: 陈浩. [从面向对象的设计模式看软件设计](http://coolshell.cn/articles/8961.html)[J/OL] 2013

[^WL14]: 维基百科. [λ演算](https://en.wikipedia.org/wiki/Lambda_calculus)[J/OL] 2014

[^G08]: 郭富强. 意合形合的汉英对比研究[D]. 华东师范大学 2006
