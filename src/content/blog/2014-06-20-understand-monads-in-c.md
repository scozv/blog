---
title: "Understand Monads in C#"
slug: monad-in-csharp
pubDatetime: 2014-06-20 09:20:06+08:00
description: "An Short Literature Review on Monads in C#"
category: "pattern"
tags: ["linq", "monad", "scala"]
lang: en
---

# Abstract

{:.no_toc}

> This article is a reading note for _Monads_ [^EL13] by Eric Lippert.
> And the note is mainly written in Chinese.
>
> For me, Monad is a pipe line, transferring the input data,
> including the operator and sending to the next port. Monad will
> calculate the input at the end of this pipe line, and will
> never break this pipe rule, nor throw error out.
>
> For more details, please read the English references.

<!--more-->

Eric Lippert indicates in his article [^EL13-8]：

> You might have noticed that the asynchronous, lazy, on-demand and sequence monads all have an interesting common property: when you apply a function to any of these monads, what you get back is an object that will perform that function in the future. Essentially, the bind function takes an immutable workflow and its subsequent step, and returns you the resulting new workflow. The bind operator does not execute the workflow; it makes a new workflow out of an old one.

The bind operator is call `SelectMany` in `C#`, or `flatMap` in `Scala`.

Wes Dyer also summarized that we need `Unit`, `Bind` and the Three rules [^WD08]:

    static M<T>  Unit<T>(T value);
    static M<R>  Bind<T, R>(M<T>, Func<T, M<R>>)

1.  Left Identity

        Bind(Unit(e), k) = k(e)

2.  Right Identity

        Bind(m, Unit) = m

3.  结合律

        Bind(m, x => Bind(k(x), y => h(y)) = Bind(Bind(m, x => k(x)), y => h(y))

# References

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
[^WL14]: 维基百科. [λ Calculus](https://en.wikipedia.org/wiki/Lambda_calculus)[J/OL] 2014
