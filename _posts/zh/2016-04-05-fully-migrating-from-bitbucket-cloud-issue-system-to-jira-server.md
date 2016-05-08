---
layout: post
title: "Bitbucket Cloud的Issue至JIRA Server的完全迁移指南"
description: ""
category: "guide"
tags: ["markdown","CI","git", "JIRA", "project"]
lang: zh
---
{% include JB/setup %}

# 摘要
{:.no_toc}

> 本文给出Bitbucket Cloud的Issue系统至JIRA Server的完整迁移方案，包括:
>
> * Issue的导入；
> * Bitbucket和JIRA的双向关联；
> * 修订历史的Git提交记录，从而与JIRA关联
>
> 如下话题，本文不作解释:
>
> * 为什么是JIRA；
> * 为什么用Bitbucket；
> * 为什么我只用Ubuntu 14.04 Server操作系统
>
> 完整的迁移方案和迁移脚本，需要阅读英文版本。

<!--more-->


# 项目架构的两个核心思想

低耦合与持续集成这两个概念，是我目前以及未来在项目实践中，
会应用，而且必须应用的两个核心概念。

我在另外一篇文章里面会更详细的解释这两个思想。

## 低耦合的原则

* 将项目分割成相互独立的节点
* 每一个节点是独立的源代码库
* 节点的交互只能通过接口文档，相互之间不需要访问对方的源代码，不需要了解对方的实现细节

## 基本的持续集成

* 代码的测试覆盖率至少80%
* 基本架构节点的覆盖率必须达到100%
* 使用`FakeRequest`对`RESTful API`进行测试
* 考虑UI测试
* 不写测试的代码就是耍流氓
* 每一次代码的提交需要满足Commit Acceptance Policy [^CAP01]，即：
   * 提交的message中包含issue编号
   * 该issue处于未解决的状态
   * 该issue有指定的resolver
* 每一次的提交需要由CI系统测试
* 如果测试失败，代码提交者应该收到通知
* __每一次commit必须关联到Issue系统__
* __每一个issue都要包含一系列的代码commits__
* 每一次的CI编译环境，和上一次的环境无关
* 持续编译和持续发布

# 完整的迁移指南

更详细的迁移解释需要阅读英文文档。

* 在Ubuntu上安装JIRA Server
* 在JIRA里面创建Project
* 导入Issue数据
* 在JIRA Server中设置DVCS Accounts
* 在Bitbucket Cloud里面指定JIRA Link
* 修订历史代码提交信息，如下
{% highlight sh %}
# 警告：如下的代码将会重写所有的历史commits信息
# 警告：如下的代码将会重写所有的历史commits信息
# 警告：如下的代码将会重写所有的历史commits信息
git clone --no-hardlinks git@bitbucket.org:scotv/ls-core-restful.git
git filter-branch -f --msg-filter \
    'sed "s/#\([0-9][0-9]*\)/LS-\1/g"'
git reset --hard
git gc --aggressive
git prune
{% endhighlight %}

# JIRA安装脚本

{% highlight sh %}
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
{% endhighlight %}

# References

[^CAP01]: [JIRA Commit Acceptance Plugin](https://marketplace.atlassian.com/plugins/com.atlassian.jira.ext.commitacceptance/server/overview) by Atlassian, Version 1.6.0 • JIRA Server 5.0 - 6.4.13 • Released 2012-02-22
[^CAP02]: [Commit Policy Plugin for JIRA](https://marketplace.atlassian.com/plugins/com.midori.jira.plugin.jira-commit-policy-plugin/server/overview) by Midori Global Consulting Kft.
[^ATL_jira_install]: [Installing JIRA applications on Linux](https://confluence.atlassian.com/adminjiraserver071/installing-jira-applications-on-linux-802592173.html)
[^ATL_maria_null]: [JIRA Supported Platforms](https://confluence.atlassian.com/adminjiraserver071/supported-platforms-802592168.html)
[^ATL_maria_null_2]: [JIRA should support MariaDB](https://jira.atlassian.com/browse/JRA-32347)
[^ATL_dvcs]: [Connect Bitbucket Cloud to JIRA Server applications](https://confluence.atlassian.com/bitbucket/connect-bitbucket-cloud-to-jira-server-applications-814208991.html)
[^GIT]: [git-filter-branch - Rewrite branches](https://git-scm.com/docs/git-filter-branch)
[^GIT2]: [Extract to Git submodule](http://will.willandorla.com/extract-to-git-submodule)
[^DCON-379]: [Allow configurable refresh times for commit checks](https://jira.atlassian.com/browse/DCON-379)
