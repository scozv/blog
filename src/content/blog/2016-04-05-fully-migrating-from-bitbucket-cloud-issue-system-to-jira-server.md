---
title: "Fully Migrating from Bitbucket Cloud Issue System to JIRA Server"
postSlug: bitbucket-issue-to-jira
pubDatetime: 2016-04-05 21:30:02+08:00
description: ""
category: "guide"
tags: ["markdown", "ci", "git", "jira", "project"]
lang: en
---

# Abstract

> This post will give a full migration guide from Bitbucket Cloud Issue
> to JIRA Server, including:
>
> - Import legacy Bitbucket Cloud Issue into JIRA Server,
> - Build Dual-direction connection between Bitbucket Cloud and JIRA Server,
> - Upgrade the issue ticket number in git commits history,
>   to archive the **FULL** migration.
>
> This post will **NOT** cover the topics below:
>
> - Why I choose JIRA instead of other issue system,
> - Why I choose Bitbucket Cloud instead of other git server,
> - Why I choose Ubuntu 14.04 Server instead of other OS.

## Table of Contents

## Core Ideas of My Understanding of a Project

**Loose Coupling** and **CI** are two core ideas of my understanding
of a project.

### Loose Coupling

- A project MUST be separated into a series of INDEPENDENT modules,
- Each module will be a code repository,
- The communication among these INDEPENDENT modules is not depended
  on source code, it is depended on the API docs.

### Continuous Integration

- Each module MUST contains the necessary tests with at least 80%
  code covered,
- An infrastructure module MUST satisfy 100% code coverage,
- A RESTful Service module MUST contain the `FakeRequest` BDD test,
- A web page module shoud consider the web page test, such as using [Selenium](www.seleniumhq.org),
- 不写测试的代码就是耍流氓
- Each module need to satisfy the Commit Acceptance Policy [^CAP01]:
  - The source commit message must contain a valid issue number(s),
  - All issues referenced in the commit message must be UNRESOLVED,
  - All issues referenced in the commit message must be assigned to the committer.
- Every commit to any module need to be build and tested on CI server,
- Committer will be noticed when the commit leaded a failure build or test,
- **Each code commit can be traced to the issue system**,
- **Each issue can be traced to a series of commits**,
- The environment of each iterative build should be independent,
- Continuous build, deployment and more...

## Limitation of Bitbucket Cloud Build-in Issue System

If we want to build a library system (the project code is `LS`),
we may separate the project into a series of repositories (modules) below:

- `ls-core-restful`: A core RESTful service, including user management, book management,
  and borrowing management,
- `ls-web-user`: A web page system for user to send the borrowing request,
- `ls-web-admin`: A web page system for library staff to approve the borrowing request,
- `ls-core-model`: An infrastructure data model in JavaScript (or TypeScript) shared by two web page systems.

(This separation is only used for the example, it may not be a perfect module
architecture)

We create a project with code name `LS` in Bitbucket Cloud.

We create four repositories under `LS` in Bitbucket Cloud:

```shell
ls-core-restful.git
ls-core-model.git
ls-web-user.git
ls-web-admin.git
```

If we raise an issue saying:

> Login page should be designed and implemented

Where we open the issue in the Bitbucket Cloud build-in Issue System?
In Bitbucket Cloud, the build-in issue system is not share in project,
we have to raise an individual issue in each repo:

```shell
# ls-core-model.git/issue/1
Implement the User model
# ls-core-restful.git/issue/1
Implement the login with token authentication service
# ls-web-user/issue/1
Implement the user login page
# ls-web-admin/issue/1
Implement the admin authorization page
```

The limitation of Bitbucket Cloud build-in Issue System is:

- Not a central issue system,
- Have to grant access right of `ls-core-restful` to other committers.
  This has been violating the **Loose Coupling** principle, cause we just need
  to expose an API docs of `ls-core-restful`
  to committers of other repositories,
- The commit history of "Login page implementation" has to be
  separated into different repositories,
  violating the **Continuous Integration** principle.

## JIRA, a Central Issue System

We need a Central Issue System that can be synced with multiple source code
repositories. I choose JIRA 6.4.13 + JIRA Agile deploying on the environment
below:

```shell
Ubuntu 14.04.4 LTS
mysql  Ver 14.14 Distrib 5.5.47,
  for debian-linux-gnu (x86_64) using readline 6.3
openjdk version "1.8.0_72-internal"
OpenJDK Runtime Environment (build 1.8.0_72-internal-b15)
OpenJDK 64-Bit Server VM (build 25.72-b15, mixed mode)
Atlassian JIRA Project Management Software
  (v6.4.13#64028-sha1:b7939e9)
JIRA Agile 6.7.12
JIRA Commit Acceptance Plugin 1.6.0
```

Currently, my deployment of JIRA 6 + Agile works smoothly with Bitbucket Cloud.
We can:

- Raise only one issue that need code changes on multiple repositories,
- Push code to Bitbucket Cloud,
  then review the commit history in JIRA issue page,
- Configure Bitbucket Cloud, so that the commit history page can link to
  the JIRA issue.
- [TODO] Reject push that committed to Bitbucket Cloud if this commit violates
  the JIRA Acceptance Policy.

## Full Migration Guide to JIRA Server

### Installing JIRA Server on Ubuntu

Atlassian provides an official installation guide [^ATL_jira_install].
Meet the system requirement, and pay attention on:

- Neither MariaDB nor PerconaDB are supported [^ATL_maria_null] [^ATL_maria_null_2],
- Atlassian JIRA Commit Acceptance Plugin is only support for JIRA Server 5.0 - 6.4.13,
- For JIRA Server 6.1 - 7.1.4, we can use Midori Commit Policy Plugin for JIRA [^CAP02] with a paid license.

I provide [a installation `sh` file](https://github.com/scozv/blog/blob/archive/jekyll-master/_posts/2016-04-05-fully-migrating-from-bitbucket-cloud-issue-system-to-jira-server.md?plain=1#L283) for quick installation and configuration of MySQL.

### Create a Project in JIRA

Supposing that we have:

- Deployed the JIRA Server, and can access `https://jira.domain.com`,
- Configured the User and Group,
- Login as the JIRA administrator.

We now create a project with the JIRA code `LS`, the ticket number of
each issue will be prepended with `LS`, such as:

```
LS-101 Hello JIRA
```

### Import Legacy Issue from Bitbucket Cloud

JIRA administrator can import the legacy issue from Bitbucket Cloud into JIRA:

```
http://jira.example.com/secure/admin/views/ExternalImport1.jspa
```

### Setup the DVCS Accounts in JIRA with Bitbucket Cloud

When we push the code to Bitbucket Cloud, we want to disply the commit history
in JIRA issue page, setting up the OAuth in Bitbucket Cloud and DVCS Accounts
in JIRA will satisfy our request.

Please read the official guide [^ATL_dvcs].

According to the Atlassian Support, the DVCS will refresh status
from Bitbucket Cloud every 60 minutes [^DCON-379]. That means when we
push commits to Bitbucket Cloud, the JIRA issue page may not reflect
the latest commits immediately.

### Setup the JIRA Link in Bitbucket Cloud

We want to display the hyperlink in Bitbucket Cloud commit history page.
Adding a JIRA link in repository setting will satisfy our request.

- Go to repository setting, find the Integrations - Links:
  ```
  https://bitbucket.org/scozv/ls-core-restful/admin/links
  ```
- Click the JIRA icon,
- Fill the JIRA website and the JIRA project code, such as `LS`
- Save

For the new source commit, such as:

```bash
git commit -avm 'LS-101 Hello JIRA'
git push
```

we have the hyperlink in commit history page of Bitbucket Cloud, leading to:

```
http://jira.example.com/browse/LS-101
```

### Change the Legacy Issue Number of Git History, ie. Fully Migrating

> **Attention:**
>
> **The `sha1` of all commits will be rewritten (changed) in the step below;**
>
> **Make backup and decision.**

In individual Bitbucket Cloud build-in Issue System, the
issue number is started from `1`. For Bitbucket Cloud, we commit code
using message such as below:

```bash
git commit -avm 'fix issue #101 Hello Bitbucket'
```

After importing the Bitbucket Issue into JIRA System, issue `101` becomes to
issue `LS-101`

We want to change the Legacy git history to:

```bash
fix issue LS-101 Hello Bitbucket
```

We need the Message Filter of git command [^GIT]:

> `--msg-filter <command>`
>
> This is the filter for rewriting the commit messages. The argument is evaluated in the shell with the original commit message on standard input; its standard output is used as the new commit message.

Here is the script:

```bash
# The `sha1` of all commits will be rewritten (changed) in the step below;
# Make backup and decision.
git clone --no-hardlinks git@bitbucket.org:scozv/ls-core-restful.git
git filter-branch -f --msg-filter \
    'sed "s/#\([0-9][0-9]*\)/LS-\1/g"'
git reset --hard
git gc --aggressive
git prune
```

# NOT a Fully Migrating

I haven't found the solution for:

- Resolved JIRA issue is not displayed as a <del>deleted HTML element</del> in Bitbucket Cloud,
- Bitbucket Cloud doesn't reject the bad commit if the commit violates the Acceptance Policy.

For the 2nd issue, Atlassian Support replied me as:

> Unfortunately, this is not possible to be done on Bitbucket Cloud for now.
> We have a feature request on this though:
> https://bitbucket.org/site/master/issues/5658

## References

[^CAP01]: [JIRA Commit Acceptance Plugin](https://marketplace.atlassian.com/plugins/com.atlassian.jira.ext.commitacceptance/server/overview) by Atlassian, Version 1.6.0 • JIRA Server 5.0 - 6.4.13 • Released 2012-02-22
[^CAP02]: [Commit Policy Plugin for JIRA](https://marketplace.atlassian.com/plugins/com.midori.jira.plugin.jira-commit-policy-plugin/server/overview) by Midori Global Consulting Kft.
[^ATL_jira_install]: [Installing JIRA applications on Linux](https://confluence.atlassian.com/adminjiraserver071/installing-jira-applications-on-linux-802592173.html)
[^ATL_maria_null]: [JIRA Supported Platforms](https://confluence.atlassian.com/adminjiraserver071/supported-platforms-802592168.html)
[^ATL_maria_null_2]: [JIRA should support MariaDB](https://jira.atlassian.com/browse/JRA-32347)
[^ATL_dvcs]: [Connect Bitbucket Cloud to JIRA Server applications](https://confluence.atlassian.com/bitbucket/connect-bitbucket-cloud-to-jira-server-applications-814208991.html)
[^GIT]: [git-filter-branch - Rewrite branches](https://git-scm.com/docs/git-filter-branch)
[^GIT2]: [Extract to Git submodule](http://will.willandorla.com/extract-to-git-submodule)
[^DCON-379]: [Allow configurable refresh times for commit checks](https://jira.atlassian.com/browse/DCON-379)
