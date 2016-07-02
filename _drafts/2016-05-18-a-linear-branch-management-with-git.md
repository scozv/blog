---
layout: post
title: "A Linear Branch Management with Git"
description: ""
category: "pattern"
tags: ["Git","branch",""]
lang: "zh"
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 本文首先抛开具体的技术，描述了我对“登录”的理解。之后会介绍基于`Token`的认证方式
>
> This article will talk about what the LOGIN really is. And,
> introduce the Token Based Authentication

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# 总体原则

* 简单
* 设计一个可在团队中使用的tool或者命令行
* 类似`git flow publish`那样，是`publish`到`remote`中，与`fork`与否无关
* 文章中提到的release，不包括release的配置文件

# 还没有考虑的部分

* 微服务架构下面，各个服务节点都这样控制分支和版本吗，是否繁琐？

# 术语

## center-repo

用作发布的中心源代码库，一般会被`fork`。
中心库的管理比较严格，通常不接受代码提交，只接受代码的合并（PR Merge）。

## fork-repo

每一个开发人员从中心库`center-repo`那边`fork`代码。

可以尝试建立两个`remote`：

* `origin`，默认的`fork-repo`地址；
* `center`，中心库的地址，用于将中心库的更新`rebase`到开发人员的`fork-repo`上面

## 三种release

可能采取的版本管理（三位版本），从左到右：

* 首位表示阶段开发任务的完成，周期一般为两到三个月，该发布可作public release；
* 次位表示迭代（sprint）的末尾发布，用作内部演示
* 末尾表示发布之后的特定版本的bugfix，通常只有public release的版本才会出现bugfix。
  迭代中发现的internal defect，会在下一个迭代中修复。

我们将三位版本号，从左到右，分别对应三种release：

* public release，对应首位版本号，源代码中保留`branch`，并记录`tags`
* sprint release，对应次位版本号，源代码中不保留`branch`，只记录`tags`
* bugfix release，对应末位版本号，基于某一个特定地public release的后续发布，
  将版本号作为新的`branch`名称，删除上一个`public release`的分支，同时记录`tags`

对于各自的分支而言：

* public release，源代码中保留`branch`，不合并到`master`，该分支只保留bump version等信息
* sprint release，源代码中只保留一个sprint release分支，master的迭代更改，将`rebase`到这个分支上面
* bugfix release，对应末位版本号，基于某一个特定地public release的后续发布，
  将版本号作为新的`branch`名称，删除上一个`public release`的分支，同时记录`tags`

# 想要实现的效果

见图

具体而言，有如下的几个场景：

## 使用tags标记版本

通常每一个release都会有对应的`tag`与之对应。

## 在master上面常规开发

* 开发人员在各自的`fork－repo`上面提交代码，关联JIRA ticket

## 开启实验性质的feature分支

* 默认基于`master`
* 在`center-repo`上开启分支，可用`feature/JIRA-404`命名，或者
* 开发人员在各自的`fork-repo`上开启分支，之后`PR`到`center-repo`
* feature的最终阶段，可以接受或者放弃该分支

如果放弃feature：

* 各个`fork-repo`就该分支`PR`到`center-repo`
* `center-repo`合并各个`PR`
* `center-repo/feature/JIRA-404`设置为只读，或者不再接受`PR` （可选）

如果接受feature：

* 各个`fork-repo`就该分支`PR`到`center-repo`
* `center-repo`合并各个`PR`
* `center-repo`合并当前feature到`master`
* 合并节点标记`tag`，同`branch`名称一致
* `center-repo`删除当前分支

### 在master上面处理常规的bugfix

* 默认基于`master`
* 某位开发在自己的`fork-repo`上面开启bugfix分支，以`bugfix/JIRA-404`格式命名
* 完成修复之后
* 合并bugfix分支到`fork-repo`的master上面， 删除本地的 bugfix分支

## 准备release

如下，介绍三种release的git工作流

### public release

* 默认基于`master`
* 在`center-repo`上开启分支，以待发布版本编号命名分支
* bump version，更新ChangeLog
* 发布，并测试
* `center-repo`合并当前release到`master`
* 在合并节点，使用tag标记版本，以版本编号为tag命名
* 如果是public release，保留该分支，以便未来基于该分支，作特定版本的bugfix修改
* 如果仅仅是迭代release，删除该分支

## 在release的版本上做特定的bugfix

* 默认基于特定的`release`分支
* 在`center-repo`上开启bugfix分支，以JIRA编号命名分支，比如`bugfix/JIRA-404`
* 测试，并确认bugfix状态
* 合并bugfix分支到特定的`release`分支， 删除bugfix分支

按照我们的版本编号规则，基于特定release上面的bugfix，会有后续的release（版本编号第三位）：

* 切换到特定的release版本，令其为`release/n.0.k`
* 注意：此时的release的`HEAD`已经包含了，该特定分支上作过的bugfix了
* 基于原有的release，创建下一个发布的分支，比如`release/n.0.k+1`
* bump version，更新ChangeLog
* 发布，并测试
* `center-repo`合并当前`release/n.0.k+1`到`release/n.0.k`
* 在合并节点，使用tag标记版本，以版本编号（vn.0.k+1）为tag命名
* 删除`release/n.0.k`分支
* 保留`release/n.0.k+1`分支

## 特定版本的bugfix应用到master上面

需要考虑是通过patch的方式，还是rebase的方式将bugfix应用到master上面。

# 使用GitFlow实现上述场景

# 为什么不使用GitFlow

# Pure Git

## 在master上面常规开发

{% highlight bash %}
git checkout master
# coding
git commit -avm 'JIRA-404 regular development'
git push
{% endhighlight %}

## 开启实验性质的feature分支

{% highlight bash %}
git checkout master
git branch feature/JIRA-404
git checkout feature/JIRA-404
# coding
git commit -avm 'JIRA-404 feature development'
git push
# git push --set-upstream origin feature/JIRA-404
{% endhighlight %}

如果放弃feature：

{% highlight bash %}
# 各个`fork-repo`就该分支`PR`到`center-repo`
# `center-repo`合并各个`PR`
# `center-repo/feature/JIRA-404`设置为只读，或者不再接受`PR` （可选）
{% endhighlight %}

如果接受feature：

{% highlight bash %}
# 各个`fork-repo`就该分支`PR`到`center-repo`
# `center-repo`合并各个`PR`
git checkout master
git merge -m 'JIRA-404 accept feature' feature/JIRA-404
git tag -a feature/JIRA-404 -m 'JIRA-404 brief description of this feature'
git branch -d feature/JIRA-404
git push origin :feature/JIRA-404
{% endhighlight %}

## 在master上面处理常规的bugfix

{% highlight bash %}
# 默认基于`master`
# 某位开发在自己的`fork-repo`上面开启bugfix分支，以`bugfix/JIRA-404`格式命名
# 完成修复之后
# 合并bugfix分支到`fork-repo`的master上面， 删除本地的bugfix分支
{% endhighlight %}

## 开始准备release

{% highlight bash %}
git checkout master
git branch release/n.m.0
git checkout release/n.m.0
# bump version, update ChangeLog
# publi.sh
git commit -avm 'JIRA-404 description of n.m.0'
git checkout master
git merge release/n.m.0
git tag -a n.m.0 -m 'JIRA-404 release of n.m.0'
# delete release branch when it is the sprint release
git branch -d release/n.m.0
git push origin :release/n.m.0
{% endhighlight %}

## 在release的版本上做特定的bugfix

{% highlight bash %}
git checkout release/n.m.k
git branch bugfix/JIRA-404
git checkout bugfix/JIRA-404z
# fix and test
git checkout checkout release/n.m.k
git merge bugfix/JIRA-404
git branch -d bugfix/JIRA-404
git push origin :bugfix/JIRA-404
{% endhighlight %}

按照我们的版本编号规则，基于特定release上面的bugfix，会有后续的release（版本编号第三位）：

{% highlight bash %}
git checkout release/n.0.k
git branch release/n.0.k+1
git checkout release/n.0.k+1
# bump version，更新ChangeLog
# 发布，并测试

{% endhighlight %}

* 切换到特定的release版本，令其为`release/n.0.k`
* 注意：此时的release的`HEAD`已经包含了，该特定分支上作过的bugfix了
* 基于原有的release，创建下一个发布的分支，比如`release/n.0.k+1`
* bump version，更新ChangeLog
* 发布，并测试
* `center-repo`合并当前`release/n.0.k+1`到`release/n.0.k`
* 在合并节点，使用tag标记版本，以版本编号（vn.0.k+1）为tag命名
* 删除`release/n.0.k`分支
* 保留`release/n.0.k+1`分支

## 特定版本的bugfix应用到master上面

需要考虑是通过patch的方式，还是rebase的方式将bugfix应用到master上面。

# 封装，取名叫gitl

# 和CI集成

## 提交并测试
## 提交并发布

# 总结
