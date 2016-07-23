---
layout: post
title: "无代码不欢乐——使用统一的Bash脚本搭建开发环境"
description: ""
category: ""
tags: []
lang: zh
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 本文最终会给出一段脚本，执行类似如下的语句：
>
>       wget -qO- path/to/installation.sh | bash
>
> 将会在Ubuntu系统上面配置好所有的开发环境。
>
> 本文会讲解如何写出并部署`installation.sh`这样的脚本，和一些建议。
>
> 除此之外，本文更愿意表达如下几个意思：
>
> * 能用代码的，就别用鼠标；
> * 既然用了代码，就纳入版本控制（Git）；
> * 使用脚本（`installation.sh`），开发人员可以方便地配置统一的开发环境；
> * 给开发人员更好的开发体验。
>
> 本文的脚本只运行在`Ubuntu 14.04+`上面，暂（JI）时（BEN）不考虑其它操作系统。
>
> 本文会提到`dotfiles` [^dotfiles] 这个概念，但不会详细解释它。

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# `installation.sh`初览

你可以在`github`中看到安装脚本的源代码（[链接](https://github.com/scozv/dotfiles/blob/master/os/ubuntu-server.sh)）。
或者，你也可以在虚拟机中执行如下命令：

{% highlight bash %}
wget -qO- https://raw.githubusercontent.com/scozv/dotfiles/master/os/ubuntu-server.sh | bash
{% endhighlight %}

请注意：

* 在`Ubuntu 14.04+`上执行以上脚本
* 最好在虚拟机上尝试这段脚本，因为这段脚本配置的`Nodejs`、`MongoDB`的版本可能和你使用的版本不一样
* 不要轻易地执行未知脚本

# 成为`installation.sh`之前

我从2014年就在`github`中托管我的`dotfiles`（[链接](https://github.com/scozv/dotfiles)）了。
于2015年将`dotfiles`转为私有。截至到本文发表，`dotfiles`的源代码统计如下：

meta | data
:----| :---
Project name | dotfiles
Generated | 2016-07-23 11:37:11 (in 0 seconds)
Generator | [GitStats](http://gitstats.sourceforge.net/) (version 2015.10.03), git version 2.8.2, gnuplot 4.6 patchlevel 6
Report Period | 2014-03-08 17:51:29 to 2016-07-21 18:14:15
Age | 867 days, 67 active days (7.73%)
Total Files | 70
Total Lines of Code | 2187 (2835 added, 648 removed)
Total Commits | 137 (average 2.0 commits per active day, 0.2 per all days)

# `installation.sh`需要留意的地方

## 兼容不同的Ubuntu版本（14.04+）

## 区分Server脚本和Desktop脚本

## 控制Nodejs的版本

## 使用镜像提高下载速度

## `publi.sh`——让开发人员执行最少的命令

# 持续集成的基础——脚本化

## 脚本化的意义，不是为了显摆，而是为了持续集成

## 我有哪些地方都在用代码

这个blog
我的所有笔记（LaTeX）
开发
部署
团队文档

# 统一的开发流程——脚本化

类似`installation.sh`这样的脚本
类似`gitl`这样的脚本，就是为了控制统一的开发流程的

# 总结

无代码不欢乐

为了更好的开发体验

# 参考文献

[^dotfiles]: [Your unofficial guide to dotfiles on GitHub](https://dotfiles.github.io/)
