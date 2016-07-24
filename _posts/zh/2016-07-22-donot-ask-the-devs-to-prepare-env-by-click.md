---
layout: post
title: "无代码不欢乐——使用统一的Bash脚本搭建开发环境"
description: ""
category: "pattern"
tags: ["bash","ci"]
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

建立`dotfiles`的最初目的是为了配置`bash`环境，之后就把Ubutnu使用过程中遇到的脚本，
都记录下来。简单的脚本记录，并不能取代手动的复制、粘帖与执行。

所以，我逐步地将所有的脚本封装，使得这些脚本能够通过`installation.sh`执行。
也就是：

* 记录各种命名行
* 将常用的命令，设置为`bash_alias`
* 将流程类的脚本（比如配置开发环境、安装JIRA）进可能地封装，让用户使用`wget`命名就能
  轻松地配置好各类环境。


# 编写`installation.sh`需要留意的地方

## 兼容不同的Ubuntu版本

本文提到的脚本，主要在`14.04+`上运行，建议生产环境使用`Ubuntu Server 14.04`。使用脚本可以区分
系统的版本：

{% highlight bash %}
# http://ask.xmodulo.com/find-ubuntu-version-codename-shell-script.html
if [[ `lsb_release --release | cut -f2` > "15.10" ]]; then
  echo "System Upgrade for `lsb_release --release | cut -f2`"
  sudo apt update && sudo apt upgrade
else
  sudo apt-get update && sudo apt-get upgrade
fi
{% endhighlight %}

## 区分Server脚本和Desktop脚本

很多可视化的工具都不需要在`Server`上运行，比如IDE工具等。所以`installation.sh`应该
区分`Server`脚本和`Desktop`脚本。

{% highlight bash %}
wget -qO- https://raw.githubusercontent.com/scozv/dotfiles/master/os/ubuntu-server.sh | bash

wget -qO- https://raw.githubusercontent.com/scozv/dotfiles/master/os/ubuntu-desktop.sh | bash
{% endhighlight %}

查看上面的两个脚本的源代码，`installation.sh`封装的主要思路为：

* 前置命令的配置，比如定义一些通用的方法

      df_echo "define temporary functions"
      . ~/opt/.df/00_define_functions.sh
* 添加常用的PPA源并配置系统

      df_echo "apt sources"
      . ~/opt/.df/03_apt_sources.sh
      df_echo "system configure"
      . ~/opt/.df/05_system_config.sh
* 配置Server，每一个应用都是独立的脚本，便于组合成不同的`installation.sh`
* 配置Desktop
* 清理临时定义的变量和函数

      df_echo "unset and clear"
      . ~/opt/.df/99_unset.sh

## 控制Nodejs的版本

最新的应用版本，并不一定就适合用在生产环境上。尤其是当前的生产环境用的低版本，
最新的应用有可能涉及到重大的变更，比如：

* `babel-5`到`babel-6`
* `jekyll 2`到`jekyll 3`

开发环境也是如此，最好和生产环境保持一致，便于调试。所以，如果生产环境
一直使用的`Nodejs 5`，那就不要轻易地升级到`Nodejs 6`。

在`installation.sh`脚本中，可以控制版本，参考`nodejs-5.sh`（[链接](https://github.com/scozv/dotfiles/blob/master/os/src/10/nodejs-5.sh)）。

## 使用镜像提高下载速度

有些时候，软件包的源地址的访问速度较慢，可以尝试更换较快的镜像。

`npm`、`ruby`以及`scala`等包管理的源地址都有较快的镜像站点。
源代码中列出了一些镜像地址。

## `publi.sh`——让开发人员执行最少的命令

除了将`installation.sh`部署到公共的Git Server上面之气，也可以将其部署到CDN上面。

很多时候，我们的环境脚本要能在新安装的系统上运行，此时，`git`和`ssh`都还没有配置。
我们的脚本运行不能依赖于`git clone`。

在我私有的`dotfiles`中，我写了如下的发布脚本，用来部署`installation.sh`。
其中，我使用了UCloud的CDN，因为它提供了`filemgr-linux64`脚本，可以在`bash`中方便
地使用文件上传接口：

{% highlight bash %}
#!/usr/bin/env bash

echo "将源文件打包"
tar -cjvf ~/repo/dotfiles/dotfiles-sh.tar -C ~/repo/dotfiles/os/src .
echo "上传到UCloud的CDN中"
cd ~/opt/filemgr-linux64.elf
./filemgr-linux64 --action mput --bucket <bucket_name> --key dotfiles/0.tar --file ~/repo/dotfiles/dotfiles-sh.tar
./filemgr-linux64 --action mput --bucket <bucket_name> --key dotfiles/ubuntu-server.sh --file ~/repo/dotfiles/os/ubuntu-server.sh
./filemgr-linux64 --action mput --bucket <bucket_name> --key dotfiles/ubuntu-desktop.sh --file ~/repo/dotfiles/os/ubuntu-desktop.sh
cd ~/repo/dotfiles
{% endhighlight %}


## 使用花括号保证脚本的完整

受`nvm`安装脚本[^nvm]的启发，为了保证`wget`的脚本的完整，使用花括号将所有的
代码包含进入：

{% highlight bash %}
#!/usr/bin/env bash
{
  # code here
}
{% endhighlight %}

# 持续集成的基础——脚本化

`dotfiles`以及`installation.sh`这类的脚本化，我认为是持续集成的基础。
未来如果我大范围地使用`docker`，依然也是一系列的脚本。

## 脚本化的意义，不是为了显摆，而是为了持续集成

大范围的使用脚本，并不是为了显得很`geek`（此处没有褒贬），而是为了更好的持续集成。

通常持续集成的配置文件基本上分为如下步骤：

* 前置的环境配置
* 需要做哪些测试
* 需要发布什么
* 后续有什么收尾

以上所有，都离不开完善的脚本。而第一步“前置的环境配置”就是本文的`installation.sh`。
当然，我们还应该尝试使用`docker`快速地完成环境配置。

## 我有哪些地方都在用代码

* 这个blog [^scozv_blog]
* 我的dotfiles [^scozv_dotfiles]
* 我的所有笔记（LaTeX）
* 部署脚本
* 接口文档 [^algo-wiki]
* 团队内部文档

# 统一的开发流程——脚本化

脚本化，除了作为持续集成的基础之外，还有一个好处，就是统一团队的开发流程。

类似`installation.sh`这样的脚本，可以保证团队的开发环境一致。

类似`gitl` [^gitl] 这样的脚本，就是为了控制统一的开发流程的，比如代码提交这个简单的动作，
我们通过完善的脚本，可以在代码`push`到Git Server之前：

* 强制单元测试
* 和JIRA关联
* 统一的代码风格检查（code hint）
* 其它

开发人员并不需要拿着Checklist去一步一步，人为地检查流程是否做完了。
如此，可以给开发带来更好的体验。

# 参考文献

[^dotfiles]: [Your unofficial guide to dotfiles on GitHub](https://dotfiles.github.io/)
[^nvm]: [Node Version Manager](https://github.com/creationix/nvm)
[^scozv_blog]: https://github.com/scozv/blog
[^scozv_dotfiles]: https://github.com/scozv/dotfiles
[^algo-wiki]: https://github.com/scozv/algo-wiki
[^gitl]: [一套简洁的基于Git的线性分支管理工作流](https://scozv.github.io/blog/zh/pattern/2016/05/18/a-linear-branch-management-with-git)
