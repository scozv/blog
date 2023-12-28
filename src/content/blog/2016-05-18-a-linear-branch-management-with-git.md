---
title: "A Linear Branch Management With Git"
postSlug: linear-gitflow
pubDatetime: 2016-07-04 22:10:27+08:00
description: ""
category: "pattern"
tags: ["git", "branch", "rebase", "merge", "version"]
lang: "en"
---

# Abstract

> This article publishes a Git branch management workflow, that is brief and linear,
> inspired by `GitFlow` [^gitflow] and `Anti-GitFlow` [^gitflow_anti_01] [^gitflow_anti_02].
>
> The `gitl`, that has not been implemented yet, is not just interface-simplified,
> but also manages the underlying branches in plain.
>
> This article is mainly written in Chinese, but I still give you the
> branches drawing to illustrate this `gitl` workflow.
>
> However, the Chinese article is still not finished yet, a few points need to be
> figured out.

## Table of Contents

## Principles

- Branches is plain, or linear,
- An interface need to be provided,
- Interface is simple, easy to invoke,
- Release branch will not include the release configuration,
- A build-in version naming rule is embedded in this workflow.

## Branches within Linear Git

Notice the branch named `/release/3.2.0` is a `sprint release` (see **Term**).
This kind of release may be removed in practice.

```

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
```

## `gitl`, An Interface for Linear GitFlow Workflow

This interface has not implemented yet, and the specification of this interface
is inspired by `GitFlow`.

### `gitl develop`, Developing in `master`

```bash
gitl develop { nil | start }
```

### `gitl feature` , Handling the `feature`

定义了开始、放弃和接受feature。

```bash
gitl feature start [feature_name] { master | [branch_based_on] }
gitl feature abort [feature_name]
gitl feature finish [feature_name]
```

### `gitl bugfix` , Fixing Bug in `bugfix`

```bash
gitl bugfix start [bugfix_name] { master | [branch_based_on] }
gitl bugfix abort [bugfix_name]
gitl bugfix finish [bugfix_name]
```

### `gitl release` , For Our Three Kind of `release`

该接口需要控制权限。

如果`[release_number]`为空，则基于默认的版本命名规则。

不建议传递版本编号，建议使用默认的版本命名规则。

```bash
gitl release { -P | -S | -B } start { [release_number] }
gitl release { -P | -S | -B } abort { [release_number] }
gitl release { -P | -S | -B } finish { [release_number] }
```

## Scenario that need different branches

### Branch Management for 3 Kind of Releases

We name our version as `n.m.k`, where:

- `n`, indicates the public release,
- `m`, for sprint release, and
- `k`, for bugfix release, that is only applied for previous public release.

#### Public Release

After one or two mouth, we release to public.

```
  step 1                                  step 2

    ^                                       ^
    |                                       |
    |                                       |
    |                                       |
    |                                       |
    |                                       |
    |                                       | rebase back
    |             ^                         | to master   ^
    |             |                         | <-----------# tag n.0.0
    |             # release                 |             |
    |             |                         |             |
    |             |                         |             |
    |             |                         |             |
    |             # bump version            |             # bump version
    |             |                         |             |
    |             |                         |             |
    +-------------+                         +-------------+
    |                                       |
    |      /release/n.0.0                   |      /release/n.0.0
    |                                       |
    |                                       |
    |                                       |
    |                                       |
    |                                       |
    |                                       |
    +                                       +

 /master                                 /master

```

#### Sprint Release

At each end of sprint, we release the sprint for internal demo.

```
step 1                       step 2                       step 3

  ^                            ^                            ^
  |                            |                            | rebase back
  |                            |             ^              | to master   ^
  |                            |             |              | <----------+# tag n. m+1 .0
  |                            |             |              |             |
  | rebase to                  |             # bump         |             # bump version
  | sprint release             |             |              |             |
  |             ^              |  ^          |              |             |
  | +---------> |              |  +----------+              |             |
  |             |              |  | /release/n.m+1.0        |             |
  |             |              |  |                         |             |
  |             |              |  |                         |             |
  |             |              |  |                         |             |
  |             |              |  |                         |             |
  |             |              |  |                         |             |
  |             |              |  |                         |             |
  +-------------+              +--+                         +-------------+
  |  /release/n.m.0            | /n.m.0                     |     /release/n. m+1 .0
  |                            |                            |
  |                            |                            |
  |                            |                            |
  |                            |                            |
  |                            |                            |
  |                            |                            |
  |                            |                            |
  +                            +                            +

/master                      /master                      /master

```

#### Bugfix Release

Will fix some bug in specific public release.

```
step 1                       step 2                       step 3

  ^                            ^                            ^
  |                            |                            | rebase back
  |                            |             ^              | to master   ^
  |                            |             |              | <----------+# tag n.0.k+1
  | bugfix release             |             |              |             |
  | is ONLY for                |             # bump         |             # bump version
  | public release             |             |              |             |
  |             ^              |  ^          |              |             |
  | +---------> |              |  +----------+              |             |
  |             |              |  | /release/n.0.k+1        |             |
  |             |              |  |                         |             |
  |             |              |  |                         |             |
  |             |              |  # bugfix 2                |             # bugfix 2
  |             |              |  |                         |             |
  |             |              |  # bugfix 1                |             # bugfix 1
  |             |              |  |                         |             |
  +-------------+              +--+                         +-------------+
  |  /release/n.0.k            | /n.0.k                     |     /release/n.0.k+1
  |                            |                            |
  |                            |                            |
  |                            |                            |
  |                            |                            |
  |                            |                            |
  |                            |                            |
  |                            |                            |
  +                            +                            +

/master                      /master                      /master

```

### Scenario

#### Regular Developing in `master`

```bash
git checkout master
# coding
git commit -avm 'JIRA-404 regular development'
git push
```

#### Opening a `feature` for experiment

```bash
git checkout master
git branch feature/JIRA-404
git checkout feature/JIRA-404
# coding
git commit -avm 'JIRA-404 feature development'
git push
# git push --set-upstream origin feature/JIRA-404
```

如果放弃feature：

```bash
# 各个`fork-repo`就该分支`PR`到`center-repo`
# `center-repo`合并各个`PR`
# `center-repo/feature/JIRA-404`设置为只读，或者不再接受`PR` （可选）
```

如果接受feature：

```bash
# 各个`fork-repo`就该分支`PR`到`center-repo`
# `center-repo`合并各个`PR`
git checkout master
git merge -m 'JIRA-404 accept feature' feature/JIRA-404
git tag -a feature/JIRA-404 -m 'JIRA-404 brief description of this feature'
git branch -d feature/JIRA-404
git push origin :feature/JIRA-404
```

#### Doing `bugfix` in `master`

```bash
# 默认基于`master`
# 某位开发在自己的`fork-repo`上面开启bugfix分支，以`bugfix/JIRA-404`格式命名
# 完成修复之后
# 合并bugfix分支到`fork-repo`的master上面， 删除本地的bugfix分支
```

#### public release

```bash
git checkout master
git branch release/n.m.0
git checkout release/n.m.0
# bump version, update ChangeLog
# publi.sh
git commit -avm 'JIRA-404 description of n.m.0'
git tag -a n.m.0 -m 'JIRA-404 release of n.m.0'
git checkout master
git rebase release/n.m.0
```

#### sprint release

```bash
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
```

#### bugfix release

```bash
git checkout release/n.m.k
git branch bugfix/JIRA-404
git checkout bugfix/JIRA-404
# fix and test
git checkout release/n.m.k
git merge bugfix/JIRA-404
git branch -d bugfix/JIRA-404
git push origin :bugfix/JIRA-404
```

按照我们的版本编号规则，基于特定release上面的bugfix，会有后续的release（版本编号第三位）：

```bash
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
```

#### Apply `bugfix` to `master`

需要考虑是通过patch的方式，还是rebase的方式将bugfix应用到master上面。

## Linear Git Workflow with CI

<!-- ## 提交并测试 -->

<!-- ## 提交并发布 -->

## More

These problems need to be fix：

- Is `gitl` complicated under Microservices ?
- Is `gitl` conflicted with git fork, see Atlassian's _Comparing Workflows_ [^atl_comp_workf] ？

## References

[^gitflow]: [A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/) by Vincent Driessen, Jan 05, 2010
[^gitflow_anti_01]: [GitFlow considered harmful](http://endoflineblog.com/gitflow-considered-harmful) by Adam Ruka, May 03, 2015
[^gitflow_anti_02]: [Follow-up to 'GitFlow considered harmful'](http://endoflineblog.com/follow-up-to-gitflow-considered-harmful) by Adam Ruka, Jun 20, 2015
[^atl_comp_workf]: [Comparing Workflows](https://www.atlassian.com/git/tutorials/comparing-workflows/) by Atlassian
