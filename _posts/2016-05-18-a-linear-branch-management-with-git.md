---
layout: post
title: "一套简洁的基于Git的线性分支管理工作流"
description: ""
category: "pattern"
tags: ["Git","branch","rebase","merge","version"]
lang: "en"
---
{% include JB/setup %}

# Abstract
{:.no_toc}

>
> This article raises a Git branch management workflow, that is brief and linear,
> inspired by `GitFlow` [^gitflow] and `Anti-GitFlow` [^gitflow_anti_01] [^gitflow_anti_02].
>
> The `gitl`, that has not been implemented yet, is not just interface-simplified,
> but also manages the underlying branches simply.
>
> This article is mainly

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# 总体原则

* 工作流背后的分支管理简洁明了
* 设计一个可在团队中使用的tool或者命令行
* 该命令行的接口简单
* 文章中提到的release，不包括release的配置文件
* 该工作流包含了一套默认的版本命名规则，这样命令行的接口不需要手动指定版本

# 分支的最终效果图

我们想实现的版本管理效果如图，右边同步的一个分支`/release/3.2.0`叫做`sprint release`
（见 **术语** 中对此的解释），
在将来的讨论中，可能会取消这个分支：

{% highlight raw %}

                             ^
                             |
                             |
                             |                    
                             |
                             |                                                ^
      ^   OR abort feature   |                                                |
      | XXXXXXXXXXXXXXXXXXX> |                                                |
      |                      |                                                |
      |                      |  /release/3.0.0                                |
      |                      +------------------->                            |
      |                      |                                                |
      |                      |                                                |
      |  /feature/JIRA-404   |                                                |
      +----------------------+                                                |
                             |                                                |
                             |             /release/2.0.1                     |
                             |                   ^                            |
                             |                   |                            |
                             |                   |                            |
                             |                   |                            |
                             |                   | bugfix                     |
                             |                   | on /2.0.0                  |
      ^   accept feature     |                   | release                    |
      | +------------------> |                   |                            |
      |                      |  /release/2.0.0   |                            |
      |                      +-------------------+                            |
      |                      |                                                |
      |  /feature/JIRA-200   |                                                |
      +----------------------+                                                |
                             |                                                |
                             |                                                |
                             |                                                |
                             |                                                |
                             |  /release/1.0.0                                |
                             +-------------------+                            +

                          /master                                 /release/3.2.0
                                                            [will explain later]
{% endhighlight %}


# 不同的场景

## 术语

### center-repo

用作发布的中心源代码库，一般会被`fork`。
中心库的管理比较严格，通常不接受代码提交，只接受代码的合并（PR Merge）。

### fork-repo

每一个开发人员从中心库`center-repo`那边`fork`代码。

可以尝试建立两个`remote`：

* `origin`，默认的`fork-repo`地址；
* `center`，中心库的地址，用于将中心库的更新`rebase`到开发人员的`fork-repo`上面

### 三种release

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

对于各自的分支而言（待完善，通过图形来表示，见笔记本）：

* public release，源代码中保留`branch`，不合并到`master`，该分支只保留bump version等信息
* sprint release，源代码中只保留一个sprint release分支，master的迭代更改，将`rebase`到这个分支上面
* bugfix release，对应末位版本号，基于某一个特定地public release的后续发布，
  将版本号作为新的`branch`名称，删除上一个`public release`的分支，同时记录`tags`

## 场景解释

具体而言，有如下的几个场景：

### 在master上面常规开发

* 开发人员在各自的`fork－repo`上面提交代码，关联JIRA ticket

### 开启实验性质的feature分支

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

### public release

我们保留每一个public release的分支，具体步骤为：

* 默认基于`master`
* 在`center-repo`上开启分支，以待发布版本编号命名分支
* bump version，更新ChangeLog
* 发布，并测试
* 使用tag标记版本，以版本编号为tag命名
* `center-repo`将当前release更改rebase到`master`
* 保留release分支

### sprint release

我们只保留一个sprint release的分支，具体步骤为：

* 将master的更改rebase到上一个sprint release分支，比如release/n.m.0
* 基于release/n.m.0，创建分支release/n.m+1.0
* 在新分支上面，bump version等
* 发布，并测试
* 使用tag标记版本，以版本编号为tag命名
* `center-repo`将当前release更改rebase到`master`
* 删除`release/n.m.0`分支
* 保留`release/n.m+1.0`分支

sprint release分支，是分别命名，还是统一命名为`release/sprint`——待定。

### bugfix release

仅在public release的版本上做特定的bugfix，具体步骤为：

* 默认基于特定的public release分支
* 在`center-repo`上开启bugfix分支，以JIRA编号命名分支，比如`bugfix/JIRA-404`
* 测试，并确认bugfix状态
* 合并bugfix分支到特定的`release`分支， 删除bugfix分支

按照我们的版本编号规则，基于特定release上面的bugfix，会有后续的release（版本编号第三位）：

* 切换到特定的release版本，令其为`release/n.0.k`
* 注意：此时的release的`HEAD`已经包含了，该特定分支上作过的bugfix了
* 基于原有的release，创建下一个发布的分支，比如`release/n.0.k+1`
* bump version，更新ChangeLog
* 发布，并测试
* 使用tag标记版本，以版本编号为tag命名
* `center-repo`将当前release更改rebase到`master`
* 删除`release/n.0.k`分支
* 保留`release/n.0.k+1`分支

### 特定版本的bugfix应用到master上面

需要考虑是通过patch的方式，还是rebase的方式将bugfix应用到master上面。

## GitFlow or Anti-GitFlow

### 使用GitFlow实现上述场景

### 为什么不使用GitFlow

## 不同场景的原始Git命令

### 在master上面常规开发

{% highlight bash %}
git checkout master
# coding
git commit -avm 'JIRA-404 regular development'
git push
{% endhighlight %}

### 开启实验性质的feature分支

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

### 在master上面处理常规的bugfix

{% highlight bash %}
# 默认基于`master`
# 某位开发在自己的`fork-repo`上面开启bugfix分支，以`bugfix/JIRA-404`格式命名
# 完成修复之后
# 合并bugfix分支到`fork-repo`的master上面， 删除本地的bugfix分支
{% endhighlight %}

### public release

{% highlight bash %}
git checkout master
git branch release/n.m.0
git checkout release/n.m.0
# bump version, update ChangeLog
# publi.sh
git commit -avm 'JIRA-404 description of n.m.0'
git tag -a n.m.0 -m 'JIRA-404 release of n.m.0'
git checkout master
git rebase release/n.m.0
{% endhighlight %}

###  sprint release

{% highlight bash %}
git checkout release/n.m.0
git rebase master
git branch release/n.m+1.0
git checkout release/n.m+1.0
# bump version, update ChangeLog
# publi.sh
git commit -avm 'JIRA-404 description of n.m+1.0'
git tag -a n.m+1.0 -m 'JIRA-404 release of n.m.0'
git checkout master
git rebase release/n.m+1.0
git branch -d release/n.m.0
git push origin :release/n.m.0
{% endhighlight %}

### bugfix release

{% highlight bash %}
git checkout release/n.m.k
git branch bugfix/JIRA-404
git checkout bugfix/JIRA-404
# fix and test
git checkout release/n.m.k
git merge bugfix/JIRA-404
git branch -d bugfix/JIRA-404
git push origin :bugfix/JIRA-404
{% endhighlight %}

按照我们的版本编号规则，基于特定release上面的bugfix，会有后续的release（版本编号第三位）：

{% highlight bash %}
git checkout release/n.0.k
git branch release/n.0.k+1
git checkout release/n.0.k+1
# bump version, update ChangeLog
# publi.sh
git commit -avm 'JIRA-404 description of n.0.k+1'
git tag -a n.0.k+1 -m 'JIRA-404 release of n.0.k+1'
git checkout master
git rebase release/n.0.k+1
git branch -d release/n.0.k
git push origin :release/n.0.k
{% endhighlight %}

### 特定版本的bugfix应用到master上面

需要考虑是通过patch的方式，还是rebase的方式将bugfix应用到master上面。

# 以`gitl`为名封装此套工作流

计划用gitl命名上述工作流，接口如下，参考了`GitFlow`的接口风格。

未来实现该接口之后，将会开源。

## `gitl develop` 在master上面常规开发

{% highlight bash %}
gitl develop { nil | start }
{% endhighlight %}

## `gitl feature` 处理实验性质的feature分支

定义了开始、放弃和接受feature。

{% highlight bash %}
gitl feature start [feature_name] { master | [branch_based_on] }
gitl feature abort [feature_name]
gitl feature finish [feature_name]
{% endhighlight %}

## `gitl bugfix` 在master或release分支上处理bugfix

{% highlight bash %}
gitl bugfix start [bugfix_name] { master | [branch_based_on] }
gitl bugfix abort [bugfix_name]
gitl bugfix finish [bugfix_name]
{% endhighlight %}

## `gitl release` 准备release

该接口需要控制权限。

如果`[release_number]`为空，则基于默认的版本命名规则。

不建议传递版本编号，建议使用默认的版本命名规则。

{% highlight bash %}
gitl release { -P | -S | -B } start { [release_number] }
gitl release { -P | -S | -B } abort { [release_number] }
gitl release { -P | -S | -B } finish { [release_number] }
{% endhighlight %}

# 和CI集成

## 提交并测试

## 提交并发布

# 总结

这些问题还需要继续思考：

* 微服务架构下面，各个服务节点都这样控制分支和版本吗，是否繁琐？
* 本文在未来的实践过程中，可能会更改。
* 本文提到的工作流，是否和`fork`冲突，参考Atlassian的 _Comparing Workflows_ [^atl_comp_workf] ？

# 参考文献

[^gitflow]: [A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/) by Vincent Driessen, Jan 05, 2010
[^gitflow_anti_01]: [http://endoflineblog.com/gitflow-considered-harmful](http://endoflineblog.com/gitflow-considered-harmful) by Adam Ruka, May 03, 2015
[^gitflow_anti_02]: [Follow-up to 'GitFlow considered harmful'](http://endoflineblog.com/follow-up-to-gitflow-considered-harmful) by Adam Ruka, Jun 20, 2015
[^atl_comp_workf]: [Comparing Workflows](https://www.atlassian.com/git/tutorials/comparing-workflows/) by Atlassian
