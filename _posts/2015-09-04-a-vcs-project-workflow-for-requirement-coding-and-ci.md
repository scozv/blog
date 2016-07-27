---
layout: post
title: "A Version Controlled Project Workflow for Requirement, Coding and Continuous Integration"
description: ""
category: "pattern"
tags: ["latex","markdown","ci","git", "jira","project"]
lang: en
---
{% include JB/setup %}

# Abstract
{:.no_toc}

> This article introduces a project workflow based on VCS
> (Version Controll System). The principle of this workflow is
> **Put everything into VCS**.
>
> For documents, Word or PDF files are not recommended in this workflow,
> just because they are difficult to be compared (such as, by `git diff`).
> So we write the documents in Markdown or LaTeX.
>
> Besides, this article will cover, but it is mainly written in Chinese:
>
> * Issue system for tracking task
> * Bitbucket
> * c9.io
> * Markdown in 5 minutes

<!--more-->

# References
[^pro_git2]: Chacon, S. and Straub, B. (2014). Pro Git, Second Edition.: NY. Apress.
[^gb_undo]: [Git Basics - Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things)
[^st_checkout]: [Temporarily switch to a different commit](http://stackoverflow.com/a/4114122)

[1]: https://tortoisegit.org/ "TortoiseGit"
[2]: https://git-for-windows.github.io/ "Git for Windows"
