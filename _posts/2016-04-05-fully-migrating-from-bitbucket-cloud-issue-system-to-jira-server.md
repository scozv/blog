---
layout: post
title: "Fully Migrating from Bitbucket Cloud Issue System to JIRA Server"
description: ""
category: "help"
tags: ["markdown","CI","git"]
---
{% include JB/setup %}

# Abstract
{:.no_toc}

> This post will give a fully migration guide from Bitbucket Cloud Issue
> to JIRA Server, including:
>
> * Import legacy Bitbucket Cloud Issue into JIRA Server,
> * Build Dual-direction connection between Bitbucket Cloud and JIRA Server,
> * Upgrade the issue ticket number in git commits history,
> to archive the __FULLY__ migration.
>
> This post will __NOT__ cover the topics below:
>
> * Why I choose JIRA instead of other issue system,
> * Why I choose Bitbucket Cloud instead of other git server,
> * Why I choose Ubuntu 14.04 Server instead of other OS.

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# Core Ideas of My Understanding of a Project

__Low Coupling__ and __CI__ are two core ideas of my understanding
of a project.

## Low Coupling

* A project MUST be separated into a series of INDEPENDENT modules,
* Each module will be a code repository,
* The communication among these INDEPENDENT modules is not depended
  on source code, it is depended on the API docs.

## Continuous Integration

* Each module MUST contains the necessary tests with at least 80%
  code covered,
* An infrastructure module MUST satisfy 100% code coverage,
* A RESTful Service module MUST contain the `FakeRequest` BDD test,
* A web page module shoud consider the web page test, such as using [Selenium](www.seleniumhq.org),
* 不写测试的代码就是耍流氓
* Each module need to satisfy the Commit Acceptance Policy [^CAP01]:
   * The source commit message must contain a valid issue number(s),
   * All issues referenced in the commit message must be UNRESOLVED,
   * All issues referenced in the commit message must be assigned to the committer.
* Every commit to any module need to be build and tested on CI server,
* Committer will be noticed when the commit leaded a failure build or test,
* __Each code commit can be traced to the issue system__,
* __Each issue can be traced to a series of commits__,
* The environment of each iterative build should be independent,
* Continuous build, deployment and more...

# Limitation of Bitbucket Cloud Build-in Issue System

If we want to build a library system (the project code is `LS`),
we may separate the project into a series of repositories (modules) below:

* `ls-core-restful`: A core RESTful service, including user management, book management,
and borrowing management,
* `ls-web-user`: A web page system for user to send the borrowing request,
* `ls-web-admin`: A web page system for library staff to approve the borrowing request,
* `ls-core-model`: An infrastructure data model in JavaScript (or TypeScript) shared by two web page systems.

(This separation is only used for the example, it may not be a perfect module
  architecture)

We create a project with code name `LS` in Bitbucket Cloud.

We create four repositories under `LS` in Bitbucket Cloud:

        ls-core-restful.git
        ls-core-model.git
        ls-web-user.git
        ls-web-admin.git

If we raise an issue saying:

        Login page should be designed and implemented

Where we open the issue in the Bitbucket Cloud build-in Issue System?
In Bitbucket Cloud, the build-in issue system is not share in project,
we have to raise an individual issue in each repo:

        # ls-core-model.git/issue/1
        Implement the User model
        # ls-core-restful.git/issue/1
        Implement the login with token authentication service
        # ls-web-user/issue/1
        Implement the user login page
        # ls-web-admin/issue/1
        Implement the admin authorization page

The limitation of Bitbucket Cloud build-in Issue System is:

* Not a central issue system,
* Have to grant access right of `ls-core-restful` to other committers.
  This has been violating the __Low Coupling__ principle, cause we just need
  to expose an API docs of `ls-core-restful`
  to committers of other repositories,
* The commit history of "Login page implementation" has to be
  separated into different repositories,
  violating the __Continuous Integration__ principle.

# JIRA, a Central Issue System

We need a Central Issue System that can be synced with multiple source code
repositories. I choose JIRA 6.4.13 + JIRA Agile deploying on the environment
below:

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

Currently, my deployment of JIRA 6 + Agile works smoothly with Bitbucket Cloud.
We can:

* Raise only one issue that need code changes on multiple repositories,
* Push code to Bitbucket Cloud,
  then review the commit history in JIRA issue page,
* Configure Bitbucket Cloud, so that the commit history page can link to
  the JIRA issue.
* [TODO] Reject push that committed to Bitbucket Cloud if this commit violates
  the JIRA Acceptance Policy.


# Fully Migration Guide to JIRA Server

## Installing JIRA Server on Ubuntu

Atlassian provides an official installation guide [^ATL_jira_install].
Meet the system requirement, and pay attention on:

* Neither MariaDB nor PerconaDB are supported [^ATL_maria_null] [^ATL_maria_null_2],
* Atlassian JIRA Commit Acceptance Plugin is only support for JIRA Server 5.0 - 6.4.13,
* For JIRA Server 6.1 - 7.1.4, we can use Midori Commit Policy Plugin for JIRA [^CAP02] with a paid license.

I provide a installation `sh` file for quick installation and configuration of MySQL, see appendix below.

## Create a Project in JIRA

Supposing that we have:

* Deployed the JIRA Server, and can access `https://jira.domain.com`,
* Configured the User and Group,
* Login as the JIRA administrator.

We now create a project with the JIRA code `LS`, the ticket number of
each issue will be prepended with `LS`, such as:

        LS-101 Hello JIRA

## Import Legacy Issue from Bitbucket Cloud

JIRA administrator can import the legacy issue from Bitbucket Cloud into JIRA:

        http://jira.domain.com/secure/admin/views/ExternalImport1.jspa

## Setup the DVCS Accounts in JIRA with Bitbucket Cloud

When we push the code to Bitbucket Cloud, we want to disply the commit history
in JIRA issue page, setting up the OAuth in Bitbucket Cloud and DVCS Accounts
in JIRA will satisfy our request.

Please read the official guide [^ATL_dvcs].

## Setup the JIRA Link in Bitbucket Cloud

We want to display the hyperlink in Bitbucket Cloud commit history page.
Adding a JIRA link in repository setting will satisfy our request.

* Go to repository setting, find the Integrations - Links:

        https://bitbucket.org/scotv/ls-core-restful/admin/links
* Click the JIRA icon,
* Fill the JIRA website and the JIRA project code, such as `LS`
* Save

For the new source commit, such as:

        git commit -avm 'LS-101 Hello JIRA'
        git push

we have the hyperlink in commit history page of Bitbucket Cloud, leading to:

        http://jira.domain.me/browse/LS-101

## Change the Legacy Issue Number of Git History, ie. Fully Migrating

In individual Bitbucket Cloud build-in Issue System, the
issue number is started from `1`. For Bitbucket Cloud, we commit code
using message such as below:

        git commit -avm 'fix issue #101 Hello Bitbucket'

After importing the Bitbucket Issue into JIRA System, issue `101` becomes to
issue `LS-101`

We want to change the Legacy git history to:

        fix issue LS-101 Hello Bitbucket

We need the Message Filter of git command [^GIT]:

> --msg-filter <command>
>
> This is the filter for rewriting the commit messages. The argument is evaluated in the shell with the original commit message on standard input; its standard output is used as the new commit message.

Here is the script:

        git clone --no-hardlinks git@bitbucket.org:scotv/ls-core-restful.git
        git filter-branch -f --msg-filter \
            'sed "s/#\([0-9][0-9]*\)/LS-\1/g"'
        git reset --hard
        git gc --aggressive
        git prune

# NOT a Fully Migrating

I haven't found the solution for:

* Resolved JIRA issue is not displayed as a <del>deleted HTML element</del> in Bitbucket Cloud,
* Bitbucket Cloud doesn't reject the bad commit if the commit violates the Acceptance Policy.

For the 2nd issue, Atlassian Support replied me as:

> Unfortunately, this is not possible to be done on Bitbucket Cloud for now.
> We have a feature request on this though:
  https://bitbucket.org/site/master/issues/5658

# Appendix

## JIRA Installation Script

```bash
# JAVA
sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt-get update
sudo apt-get install -y openjdk-8-jdk openjdk-8-jre openjdk-8-jre-headless

# MySQL
sudo apt-get install -y mysql-server mysql-client

# JIRA
# JIRA_BINARY="atlassian-jira-software-7.1.2-jira-7.1.2-x64.bin"
JIRA_BINARY="atlassian-jira-6.4.13-x64.bin"
wget -nc -P ~/Downloads/ \
  "https://www.atlassian.com/software/jira/downloads/binary/$JIRA_BINARY"

chmod a+x ~/Downloads/$JIRA_BINARY
sudo bash ~/Downloads/$JIRA_BINARY

JIRA_HOME="/opt/atlassian/jira"

sudo vi $JIRA_HOME/bin/setenv.sh
# JVM_SUPPORT_RECOMMENDED_ARGS="-Datlassian.plugins.enable.wait=300 -Xms64m -Xmx256m -Xss2m -XX:MaxPermSize=128m"
sudo bash $JIRA_HOME/bin/stop-jira.sh
sudo bash $JIRA_HOME/bin/start-jira.sh

# sudo bash /opt/atlassian/jira/uninstall

# JIRA MySQL
# https://confluence.atlassian.com/jira/connecting-jira-to-mysql-185729489.html
MS_JIRA_DB=jiradb
MS_JIRA_DBUSER=jiradbuser
MS_JIRA_PWD="*ABCDEFJHIGKLMNOPQRSTUVWXYZ"
mysql -uroot -p
> CREATE USER '$MS_JIRA_DBUSER'@'localhost' IDENTIFIED BY PASSWORD '$MS_JIRA_PWD';
> CREATE DATABASE $MS_JIRA_DB CHARACTER SET utf8 COLLATE utf8_bin;
> GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,ALTER,INDEX
> | on $MS_JIRA_DB.* TO '$MS_JIRA_DBUSER'@'localhost'
> | IDENTIFIED BY PASSWORD '$MS_JIRA_PWD';
> flush privileges;
> SHOW GRANTS FOR '$MS_JIRA_DBUSER'@'localhost';

MYSQL_CONF="/etc/mysql/my.cnf"
sudo cp $MYSQL_CONF $MYSQL_CONF.before_JIRA
sudo sed -i '/^default_storage_engine/c\default_storage_engine=INNODB' $MYSQL_CONF
sudo sed -i '/^max_allowed_packet/c\max_allowed_packet=256M' $MYSQL_CONF
sudo sed -i '/innodb_log_file_size/c\innodb_log_file_size=256M' $MYSQL_CONF
sudo sed -i '/^sql_mode.*=.*NO_AUTO_VALUE_ON_ZERO/c\#sql_mode = NO_AUTO_VALUE_ON_ZERO' $MYSQL_CONF
sudo bash /etc/init.d/mysql stop
sudo bash /etc/init.d/mysql start

JIRA_HOME="/opt/atlassian/jira"
MYSQL_J_BINARY="mysql-connector-java-5.1.38.tar.gz"
wget -nc -P ~/Downloads/ "http://dev.mysql.com/get/Downloads/Connector-J/$MYSQL_J_BINARY"
sudo tar zxf ~/Downloads/$MYSQL_J_BINARY -C $JIRA_HOME/lib/
sudo cp $JIRA_HOME/lib/mysql-connector-java-5.1.38/mysql-connector-java-5.1.38-bin.jar  $JIRA_HOME/lib/
sudo bash $JIRA_HOME/bin/stop-jira.sh
sudo bash $JIRA_HOME/bin/start-jira.sh

export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/
sudo bash $JIRA_HOME/bin/config.sh
# https://confluence.atlassian.com/jira/connecting-jira-to-mysql-185729489.html
sudo bash $JIRA_HOME/bin/stop-jira.sh
sudo bash $JIRA_HOME/bin/start-jira.sh

## JIRA 6 only
# https://marketplace.atlassian.com/plugins/com.atlassian.jira.ext.commitacceptance/server/installation
# https://confluence.atlassian.com/display/UPM/Installing+Add-ons#Installingadd-ons-installingversion1InstallingPlugins1typeadd-onsinJIRAandBamboo
sudo bash $JIRA_HOME/bin/stop-jira.sh
JIRA_CAP_BINARY="commitacceptance-1.6.0.jar"
JIRA_ADDON_SITE="https://marketplace-cdn.atlassian.com/files/artifact/5f9ba63d-ee6c-4633-9b7a-a26c644a2434"
wget -nc -P ~/Downloads/ $JIRA_ADDON_SITE/$JIRA_CAP_BINARY
sudo cp ~/Downloads/$JIRA_CAP_BINARY $JIRA_HOME/atlassian-jira/WEB-INF/lib/
sudo bash $JIRA_HOME/bin/start-jira.sh

## stop-jira
JIRA_HOME="/opt/atlassian/jira"
sudo bash $JIRA_HOME/bin/stop-jira.sh
sudo bash /etc/init.d/mysql stop
## start-jira
JIRA_HOME="/opt/atlassian/jira"
sudo bash /etc/init.d/mysql start
sudo bash $JIRA_HOME/bin/start-jira.sh
```

# References

[^CAP01]: [JIRA Commit Acceptance Plugin](https://marketplace.atlassian.com/plugins/com.atlassian.jira.ext.commitacceptance/server/overview) by Atlassian, Version 1.6.0 • JIRA Server 5.0 - 6.4.13 • Released 2012-02-22
[^CAP02]: [Commit Policy Plugin for JIRA](https://marketplace.atlassian.com/plugins/com.midori.jira.plugin.jira-commit-policy-plugin/server/overview) by Midori Global Consulting Kft.
[^ATL_jira_install]: [Installing JIRA applications on Linux](https://confluence.atlassian.com/adminjiraserver071/installing-jira-applications-on-linux-802592173.html)
[^ATL_maria_null]: [JIRA Supported Platforms](https://confluence.atlassian.com/adminjiraserver071/supported-platforms-802592168.html)
[^ATL_maria_null_2]: [JIRA should support MariaDB](https://jira.atlassian.com/browse/JRA-32347)
[^ATL_dvcs]: [Connect Bitbucket Cloud to JIRA Server applications](https://confluence.atlassian.com/bitbucket/connect-bitbucket-cloud-to-jira-server-applications-814208991.html)
[^GIT]: [git-filter-branch - Rewrite branches](https://git-scm.com/docs/git-filter-branch)
[^GIT2]: [Extract to Git submodule](http://will.willandorla.com/extract-to-git-submodule)
