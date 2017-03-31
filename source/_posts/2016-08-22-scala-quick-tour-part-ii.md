---
layout: post
title: "Scala Quick Tour Part II"
description: ""
category: "guide"
tags: ["scala"]
lang: en
---

{% include JB/setup %}

# Abstract
{:.no_toc}

> This is the second part of _Scala Quick Tour_,
> in the [previous part](https://scozv.github.io/blog/guide/2016/08/21/scala-quick-tour-part-i),
> we talked about Functional Programming Basis, Functional Type and the Type Inference.
>
> In this article, I will give you a precise introduction of **Tail Recursion**,
> which is a very important conception of Functional Programming.
> After this introduction, I will explain the construction and operations of `List[T]`, using
> Tail Recursion.
>
> Briefly, the part II will cover:
>
> * Iteration to Recursion,
> * Recursion vs Tail Recursion,
> * First Glance of Type Parameterization and Pattern Match,
> * Recursion Construction of `List[T]`,
> * `head` and `tail`,
> * `take` and `reverse`,
> * `append` and `prepend`,
> * `map` and `foreach`,
> * `map` and `reduce`,
> * Read the Source of `List.scala`. 
>
> Currently, This article (Part II) is only written in Chinese.

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

[^blog_bolero]: [Bolero, a RESTful Scaffold with Scala, Play! and ReactiveMongo](https://scozv.github.io/blog/guide/2016/07/27/bolero-a-restful-scaffold-with-scala)
[^github_bolero]: [Bolero, the Source Code](https://github.com/scozv/bolero)
[^open_progfun1]: [Functional Programming Principles in Scala](https://www.coursera.org/learn/progfun1) from École Polytechnique Fédérale de Lausanne
[^sicp]: [ Structure and Interpretation of Computer Programs](https://mitpress.mit.edu/sicp/)
[^scala_spec_exp]: [Scala Specification, Chapter 6 Expressions](http://www.scala-lang.org/files/archive/spec/2.11/06-expressions.html)
[^scala_progfun_2nd]: Martin Odersky, Lex Spoon, Bill Venners. Programming in Scala (Second Edition), Artima Press
[^wiki_formula]: [原子公式](https://zh.wikipedia.org/wiki/%E5%8E%9F%E5%AD%90%E5%85%AC%E5%BC%8F)
[^wiki_connective]: [逻辑运算符](https://zh.wikipedia.org/wiki/%E9%80%BB%E8%BE%91%E8%BF%90%E7%AE%97%E7%AC%A6)
[^fn_if-then]: 可以通过枚举真值表的方式证明，“蕴含”（$$A \rightarrow B$$）等价于复合命题$$\neg A \vee B$$。更一般地，可以证明，一阶谓词逻辑的所有命题，最多只需要“否定”、“或”两个连接词表示。
