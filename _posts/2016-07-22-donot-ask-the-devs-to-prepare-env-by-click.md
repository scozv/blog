---
layout: post
title: "DO NOT Prepare the Development Environment by Click and Click"
description: ""
category: "pattern"
tags: ["bash","ci"]
lang: en
---
{% include JB/setup %}

# Abstract
{:.no_toc}

> This article will give you an `installation.sh` script, that
> can be used to prepare the development environment. Instead of click and click,
> we just simply run this command in bash：
>
>       wget -qO- path/to/installation.sh | bash
>
>
> This article will describe the process of `installation.sh`, besides, I want to express:
>
>
> * Use code, not mouse,
> * Use git, when we use code,
> * Bring the wonderful Development Experience to developers.
>
> The `installation.sh` will only apply for `Ubuntu 14.04+`.
>
> And, the article will mention `dotfiles` [^dotfiles], but will not cover the details of it。
>
> This article is mainly written in Chinese, you may read the source code [^scozv_dotfiles] for help.

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# `installation.sh`

Read the source of `installation.sh`（[Link](https://github.com/scozv/dotfiles/blob/master/os/ubuntu-server.sh)）。
Or have a try on the VM：

{% highlight bash %}
wget -qO- https://raw.githubusercontent.com/scozv/dotfiles/master/os/ubuntu-server.sh | bash
{% endhighlight %}

Attentions

* Run this script on `Ubuntu 14.04+`,
* Run this script on VM, NOT on your own development environment,
* Read the source before running any unknown `sh` file.

# Bash Scripts, the Basis of CI

Usually, the CI configuration includes:

* Environment preparing
* Tests that will run
* Any release
* Clean

The 1st step is what the `installation.sh` will do.

I almost write script (code) as many places any I could:

* This blog site [^scozv_blog]
* dotfiles [^scozv_dotfiles]
* Notes（LaTeX）
* Deployment script
* API documents [^algo-wiki]
* Internal documents

# References

[^dotfiles]: [Your unofficial guide to dotfiles on GitHub](https://dotfiles.github.io/)
[^nvm]: [Node Version Manager](https://github.com/creationix/nvm)
[^scozv_blog]: https://github.com/scozv/blog
[^scozv_dotfiles]: https://github.com/scozv/dotfiles
[^algo-wiki]: https://github.com/scozv/algo-wiki
[^gitl]: [一套简洁的基于Git的线性分支管理工作流](https://scozv.github.io/blog/zh/pattern/2016/05/18/a-linear-branch-management-with-git)
