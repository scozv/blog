---
layout: post
title: "A Version Controlled Project Workflow for Requirement, Coding and Continuous Integration"
description: ""
category: "help"
tags: ["latex","markdown","CI","git"]
---
{% include JB/setup %}


# 摘要
{:.no_toc}
> 开发团队中，使用Word或者PDF文档，或者邮件来描述需求，可能导致同样内容的文档出现在不同成员的电脑上，进而可能导致
> 版本不一致。另外两次版本的需求更改，很难进行差异比较（Word和PDF文档不是简单的文本文件）。
> 一种解决方案是，使用文本文件（比如Markdown或者LaTeX）来描述需求，并将所有的文件纳入源代码管理。
> 所以，本文描述的这个工作流，将所有的文档纳入源代码管理。同时还将提到：
> 
> * 使用Issue来跟踪需求、变更和问题解决
> * 产品、测试和开发等不同角色如何便捷的使用Bitbucket来提出并跟踪任务
>

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# 环境准备
本文提到的“环境”，不是开发环境，而是对每个成员都是适用的基本工作环境。

本文提到的“源代码”，不仅仅是开发代码，而是团队运行过程中所有的文档，包括：

* 需求文档及附件
* 团队工作流程
* 统一的开发风格文档
* 其它所有和团队有关，并需要记录的文档

所有输出的成品，比如编译生成的PDF文件，不应该纳入源代码管理。


## 注册Bitbucket
首先注册一个[bitbucket.org](https://bitbucket.org)账号，bitbucket是一个在线的源代码管理系统，支持多个私有库，
默认每个库支持5位成员协同工作。

进入bitbucket页面之后，左侧导航栏常用的菜单为：

* 提交（commits）：用来查看所有的版本信息
* 问题（issues）：所有的问题列表，可对每一个问题进行讨论，并跟踪当前问题的处理进度
* 下载（downloads）：可以将每一个阶段的文档整理成PDF文件，存放到“下载”表中，以便向团队之外人展示

Bitbucket支持在线编辑和预览Markdown文档。

## 安装Git环境
当团队成员获得了某一个源代码仓库（repo）的访问权限之后，需要安装Git环境，用来提交和查看不是时期的源代码。

<!--* Linux用户建议在`Bash`环境下使用Git-->
<!--* Mac用户可以通过-->
<!--* Windows用户可以安装[TortoiseGit] [1]或者[Git for Windows] [2]-->

建议在`Bash`环境下使用Git。

Git的仓库（repo）有三类：

* 服务器上的中心库，指的是托管在bitbucket.org上的库，每一位成员需要不时地从服务器上获取最新的源代码，同时也要将自己的
  更改提交保存到服务器上
* 其他成员电脑上的库，只有当其他成员将他们的更改提交到了服务器上，我们才能获取更新，看到这些更改
* 本地自己的库，同样的，只有我们将自己的更改提交到服务器，团队其他成员才能获取我们的更新

一般而言，Git环境的基本流程是：

0. 克隆或更新本地库，将服务器上的变更，更新到本地
        
        git pull
0. 修改、编辑源代码，标记变更的文件，并为本次变更添加一个描述
        
        git add file_changed.txt
        git commit -m '本次变更的描述信息'
0. 可以重复上一个步骤，多次变更文件
0. 一并提交本地的所有的更新到服务器上
        
        git push
  
## 编辑文本文档

文本文档的编辑，可以使用

* 记事本，建议安装`notepad2`或者`notepad++`，务必将文件设置为`UTF-8`编码
* 直接在bitbucket.org上进行在线文档编辑

## 移动端的访问
`iOS`上使用[CodeBucket](https://itunes.apple.com/cn/app/codebucket-bitbucket-for-ios/id551531422?)访问源代码库。

`Android`平台使用[Bitbeaker](http://www.coolapk.com/apk/fi.iki.kuitsi.bitbeaker)。

移动端通常可用于问题的讨论。


# 不同角色的工作流程

## 产品和需求的变更
需求最开始可以在问题（issue） 列表中讨论，逐步反映到需求文档中，具体而言：

0. 新增一个问题（issue）
0. 团队成员在每一个问题的评论中讨论
0. 编写对应的需求文档，并在提交的时候，关联问题编号（使用英文字符井号`#`）

       git commit -m '新增某某需求，参考问题 #1'


# 附录

## 全局规则

* 所有的文件名称只包含英文字母、数字和下划线，比如：

        requirement_001_user_login.md
* 所有的文本文件，比如`.md`，都设置为`UTF-8`编码，以免中文字体出现乱码
* 所有的图片编号，并以简短的文件名描述图片内容，并在文档中注明

## Markdown基本语法介绍
bitbucket中可以直接编辑和预览文件。
详细的语法说明，可以参考：https://bitbucket.org/tutorials/markdowndemo/overview

常用的语法有如下：

* 目录
  使用`[TOC]`来自动生成文章的目录
* 章节1

  使用一个井号，来表示章节1，比如
  
        # Heading 1
* 章节1.1

  使用两个井号，来表示第二级章节，比如
  
        ## Heading 1.1
* 可以向下一直写到第五级，即

        ##### Heading 1.1.1.1.1
* 粗体和斜体

  用两个星号包围需要加粗的字体：
  
        ** 粗体 **
  
  用一个星号包围需要倾斜的字体：
  
        * 斜体 *
* 超链接

  通常的超链接语法如下：
  
        [超链接名称](www.bitbucket.org)
* 列表

  使用一个井号，标记列表中的元素，比如
    
        * Item one
        * Item two
        * Item three
        
* 表格
    
        First Header  | Second Header
        ------------- | -------------
        Content Cell  | Content Cell
        Content Cell  | Content Cell
 
  注意，短横线只需要使用一个就够了
  
## LaTeX基本语法介绍

## 常用的Git场景
本小节主要参考文献[Chacon and Straub, 2014] [^pro_git2]。

下列的代码段中，以`$`打头的命令需要在`bash`中执行。其余的为命令执行的结果。

### 如何修改最近一次commit的备注[^gb_undo]

      $ git commit --amend
      
### 想暂时回到某一个历史版本[^st_checkout]

有的时候，突然发现了一个问题，但是明明记得之前某个时间段是正常的。
此时，需要回到之前的某一个版本（commit），尝试找到是哪一次提交引发了该问题。

0. 列出最近的一系列提交

        $ git log --pretty=oneline -n 20 --graph --abbrev-commit
        * 9ecb341 fix markdown href syntax
        * 3f0828b fix markdown coding syntax
        * 72fc362 fix markdown syntax
        * 4175860 draft for vcs wrkflow
        * 94259e0 fix typo of lataxing
        * 8ecbced no center for equation
        * 794bcee blockquote equation
        * b0ca566 fix div in markdown

0. 临时返回到之前的某一次提交

        $ git checkout 94259e0
      
0. 使用二分查找，反复执行`git checkout`，直到定位到某两个**相邻**的版本，也即，
    前一个版本还是正常的，后一个版本就出现了问题

0. 比较这两个**相邻**版本的差异，分析问题

        $ git diff 4175860 94259e0
      
0. 回撤这些临时版本
      
        $ git checkout master

## Bitbucket和Github在Acadamic License上的比较

在Acadamic License结束之后，Bitbucket依然允许5人小组的私有库，但是Github需要付费，才能继续使用私有库。

# 参考文献
[^pro_git2]: Chacon, S. and Straub, B. (2014). Pro Git, Second Edition.: NY. Apress.
[^gb_undo]: [Git Basics - Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things)
[^st_checkout]: [Temporarily switch to a different commit](http://stackoverflow.com/a/4114122)


[1]: https://tortoisegit.org/ "TortoiseGit"
[2]: https://git-for-windows.github.io/ "Git for Windows"
