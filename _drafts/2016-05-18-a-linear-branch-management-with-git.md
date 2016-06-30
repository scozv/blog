---
layout: post
title: "A Linear Branch Management with Git"
description: ""
category: "pattern"
tags: ["Git","branch",""]
lang: "zh"
---
{% include JB/setup %}


# 总体原则

* 简单
* 设计一个可在团队中使用的tool或者命令行
* 类似`git flow publish`那样，是`publish`到`remote`中，与`fork`与否无关

# 术语

## center-repo

用作发布的中心源代码库，一般会被`fork`。
中心库的管理比较严格，通常不接受代码提交，只接受代码的合并（PR Merge）。

## fork-repo

每一个开发人员从中心库`center-repo`那边`fork`代码。

可以尝试建立两个`remote`：

* `origin`，默认的`fork-repo`地址；
* `center`，中心库的地址，用于将中心库的更新`rebase`到开发人员的`fork-repo`上面

# 想要实现的效果

见图

具体而言，有如下的几个场景：

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

## 开始准备release

* 默认基于`master`
* 在`center-repo`上开启分支，以待发布版本编号命名分支
* bump version，更新ChangeLog
* 发布，并测试
* `center-repo`合并当前release到`master`
* 在合并节点，使用tag标记版本，以版本编号为tag命名
* 如果是public release，保留该分支，以便未来基于该分支，作特定版本的bugfix修改
* 如果是

可能采取的版本管理（三位版本），从左到右：

* 首位表示阶段开发任务的完成，周期一般为两到三个月，该发布可作public release；
* 次位表示迭代（sprint）的末尾发布，用作内部演示
* 末尾表示发布之后的特定版本的bugfix，通常只有public release的版本才会出现bugfix。
  迭代中发现的internal defect，会在下一个迭代中修复。

## 使用tags标记版本

＊release节点需要tags

## 在master上面处理常规的bugfix

* 默认基于`master`
* 某位开发在自己的`fork-repo`上面开启bugfix分支，以`bugfix/JIRA-404`格式命名
* 完成修复之后
* 合并bugfix分支到`fork-repo`的master上面， 删除本地的 bugfix分支

## 在release的版本上做特定的bugfix

* 默认基于特定的`release`分支
* 在`center-repo`上开启bugfix分支，以JIRA编号命名分支，比如`bugfix/JIRA-404`
* 测试，并确认bugfix状态
* 合并bugfix分支到特定的`release`分支， 删除bugfix分支

按照我们的版本编号规则，基于特定release上面的bugfix，会有后续的release（版本编号第三位）：

* 切换到特定的release版本，
* 注意：此时的release的`HEAD`已经指向了

# 使用GitFlow实现上述场景

# 为什么不使用GitFlow

# Pure Git

# 封装，取名叫gitl

# 和CI集成

## 提交并测试
## 提交并发布

# 总结
