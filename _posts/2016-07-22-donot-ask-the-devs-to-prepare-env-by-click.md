---
title: "DO NOT Prepare the Development Environment by Click and Click"
postSlug: simple-dev-environment-script
pubDatetime: 2016-07-23 21:32:23+08:00
description: ""
category: "pattern"
tags: ["bash", "ci"]
lang: en
---


## Abstract

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



## `installation.sh`

Read the source of `installation.sh`（[Link](https://github.com/scozv/dotfiles/blob/master/os/ubuntu-server.sh)）。
Or have a try on the VM：

```bash
wget -qO- https://raw.githubusercontent.com/scozv/dotfiles/master/os/ubuntu-server.sh | bash
```

Attentions

* Run this script on `Ubuntu 14.04+`,
* Run this script on VM, NOT on your own development environment,
* Read the source before running any unknown `sh` file.

## Bash Scripts, the Basis of CI

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
* API documents [^algo_wiki]
* Internal documents

## References


[^scozv_dotfiles]: [The Collection of dotfiles in Linux](https://github.com/scozv/dotfiles)

[^algo_wiki]: [Tango.js documentation](https://github.com/scozv/algo-wiki)

[^dotfiles]: [Your unofficial guide to dotfiles on GitHub](https://dotfiles.github.io/)

[^nvm]: [Node Version Manager](https://github.com/creationix/nvm)

[^scozv_blog]: [Blog site](https://github.com/scozv/blog)

