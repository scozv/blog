---
layout: page
title: "Resume"
permalink: cv/
lang: en
group: _navigation
weight: 200
---
{% include JB/setup %}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## [简体中文](https://scozv.github.io/blog/zh/cv/)

## TL;DR

<table>
  <tbody>
    <tr>
      <td style="text-align: left">Latest updated</td>
      <td style="text-align: left">December, 2017</td>
    </tr>
    <tr>
      <td style="text-align: left">Links</td>
      <td style="text-align: left">
        <div class="tech-list">
        <div class="tag"><a href="https://github.com/scozv">github</a></div>          
        <div class="tag"><a href="https://github.com/scozv/tango/blob/master/lang/es6/README.md">tango</a></div>
        <div class="tag"><a href="https://scozv.github.io/tango/en/">tango-docs</a></div>
        <div class="tag"><a href="https://scozv.github.io/blog">Blog</a></div>
        <div class="tag"><a href="https://scozv.github.io/blog/zh/cv/">中文简历</a></div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="text-align: left">Tags</td>
      <td style="text-align: left">
        <div class="tech-list">
          <div class="tag">SJTU</div>
          <div class="tag">MSE</div>
          <div class="tag">8 years</div>
          <div class="tag">Tech Lead</div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="text-align: left">Tech</td>
      <td style="text-align: left">
        <div class="tech-list">
          <div class="tag">Scala</div>
          <div class="tag">Akka</div>       
          <div class="tag">React.js</div>
          <div class="tag">Redux</div>
          <div class="tag">Node.js</div>
          <div class="tag">RESTful</div>
          <div class="tag">Play!</div>
          <div class="tag">ECMAScript 6</div>
          <div class="tag">Oracle</div>
          <div class="tag">Golang</div>
          <div class="tag">Algorithm</div>
          <div class="tag">LaTeX</div>
          <div class="tag">Linux</div>
          <div class="tag">MongoDB</div>
          <div class="tag">Azure</div>
          <div class="tag">Docker</div>
          <div class="tag">AWS</div>
          <div class="tag">JIRA</div>
        </div>
      </td>
    </tr>
  </tbody>
</table>

## Education

* **Shanghai Jiaotong University** _2013 ~ 2017_

Part-time programme for Master of Software Engineering. My graduation paper addressing the loose coupling architecture and its application on financial system has been submitted at June 2017. The certification of MSE Degree has been issued in November 2017.

* **Ningbo University** _2005 ~ 2009_

Information System and Information Management, Bachelor Degree

## Working Experience (`Scala` Related)

### G Product Core Data Analysis System (Project Owner)

Company | LeadIQ
:-----|:-----
Project | Data Analysis System Based on Play 2.6 and Akka 2.5
Time | 2017.06 ~ Now

As the owner of this project, I am not just finishing my development task,
but also taking charge of Version Control, Release, Roadmap Planning, and using the
[Linear Git Management Mechanism (`x.y.z`)](https://scozv.github.io/blog/pattern/2016/05/18/a-linear-branch-management-with-git)
to manage the version and the rolling back of failed release.

Achievement:

* 80% committed code. 52 DONE of 72 issues.
* Data I/O with Mongo, Redis and Postgres based on Dependencies Injection.
* Isolated threads for third party API server and data query with separating `dispatcher`.
* Log message `TrackingId` with `CUID` and integrated with Graylog.
* Design and implementation of the activities report based on Graph, improve of the query time complexity from  $$O(n\cdot m)$$ down to $$O(\log n)$$.
* Deployment with AWS EC and LB.
* Throttle implementation for third party API request with Akka Stream.
* Kafka producer and consumer implementation for 3 use cases.
* Lightweight admin page with `dva`, `antd` and `React.js` (plan).

### L Product Core Data Category System

Company | LeadIQ
:-------|:---------
Project | Data Category System on Play 2.3 and Akka 2.3
Time | Sept, 2016 ~ Now

Achievement:

* 800+ commits from January to August 2017.
* Implementation of 3 business modules.
* Integration with 2 third party services.
* Implementation of Akka Work Pulling Pattern and customized `dispatcher`.
* Implementation of TrackingId.
* Post with title [_Putting Tracking Id to Log Message with Customized Akka Dispatcher and Mapped Diagnostic Contexts in Play 2.6_](https://scozv.github.io/blog/pattern/2017/07/18/injection-of-tracking-id-to-logback-message-with-customer-dispatcher-and-mapped-diagnostic-contexts-in-scala).

###  S O2O Online Shopping Platform (Tech Lead)

Company | Project in SJTU
:------|:----------
Project | O2O Online Fruits Shopping Based on WeChat Eco-system
Time | Aug, 2015 ~ Apr, 2016
Role | Tech Leader, Architect and Deployment Manager

Achievement:

* Isolation between Frontend and Backend.
* `Async` I/O with `MongoDB` based on `ReactiveMongo`.
* HTTP Request mocking with `FakeApplication`.
* A global business validation design with Monad principle.
* Multiple payment channel integration with Ping++ SDK.
* Token authentication.
* Automatic test and deployment scripts.
* `React.js` webpage.
* 3 posts on this project:
  - [_Bolero, a RESTful Scaffold with Scala, Play! and ReactiveMongo_](https://scozv.github.io/blog/guide/2016/07/27/bolero-a-restful-scaffold-with-scala)
  - [_A Loose Coupling Architecture of the Web Solution with Continuous Integration_](https://scozv.github.io/blog/pattern/2016/05/05/a-low-coupling-architecture-of-the-web-solution-with-continuous-integration)
  - [_A Linear Branch Management With Git_](https://scozv.github.io/blog/pattern/2016/05/18/a-linear-branch-management-with-git)


## Working Experience (`Golang`, `.NET` Related)

### D Distributed File System API Server (Senior Software Engineer in Infrastructure Architect Group)

Company | Hujiang Education & Technology
:-------|:-----------
Project | DFS RESTful API for Production Line based on Golang
Time | Sept, 2016 ~ Oct, 2016
Role | `Golang` development and the owner of Delivery Team

As the owner of the Distributed File System, I took charge of Requirement Analysis, Golang development, Version Control and Release.

Achievement of DFS:

* Improved the unit tests and release script for Golang system.
* Released 3 new RESTful API as the request from production department.
* Fixed 1 runtime error due to the unmerged branch.
* Collaborated with the development team of the IaaS provider for specific feature.
* Created 27 Gitlab issues and finished 19 issues of them.

As a member of Infrastructure Architect Group, I delivered 5 training sessions of _Algorithm 101_, including the Big O, Fundamental Data Structures, Tail Recursion and Sorting.

Meanwhile I led 6 members delivery team, building the continuous delivery process cross over the entire development group, communicating with cross departments to get resources and support.


### Q Treasury Solution Project (Senior Product Development Engineer)

Company | SunGard
:-------|:------------
Time | June, 2013 ~ Aug, 2016
Summary | Worked in Q V6 project, a web solution for Treasury Software & Management System. In these 3 years, collaborated with 10+ members team on Equity, Fees and Accounting modules. Mainly using `ASP .NET MVC` and the AOP conception for data validation.

### Y Vehicle Accident Claim Center Project

Company | Cognizant
:-------|:------------
Time | Oct, 2011 ~ June, 2013
Summary | Be responsible to call center implementation, and the workflow implementation of orders.

### K Hospital Information System

Company| Ningbo KingT Software
:-------|:------------
Time | April, 2010 ~ Oct, 2011
Summary | Be involved into the deployment and the `PL/SQL` reporting implementation.

### N HR Resume Management System (Intern)

Company | Nordic Industrial Park (Ningbo) Co., Ltd.
:-------|:------------
Time | Sept, 2009 ~ April, 2010
Summary | Delivery a Resume information system to collect the resumes and candidates information.


## Candidate Overview

### Working Experiences in Last Two Years

I grew fast in the last two years, I delivered
a small online shopping project with 6 members team
during 2015 to 2016 when I was studying in SJTU
for Master of Software Engineering.

As the Tech Lead, I improved a lot from the stage that
only gross requirement was available to the stage that
all features had been delivered, calling this as the _Zero to One_.

I led 3 small teams in recent two years, I learn the collaboration,
the communication, how to choose the team member, and
how to get support resources from other team.

In recent 1 year, I moved to Singapore, kept learning and writing on React, Scala, and most important,
on delivering the solutions.

I read and I learn. I have already passed the Level I exam of CFA.
I have submitted the Master Degree graduation paper on June, which
has addressed the Loose Coupling architecture and the application
in Financial Information System.


### Three Stages of 8 Years on Software Engineering

I consider the 8 years of software engineering experiences
as three stages below.

The first stage was from the 2009 when I just graduated from University to the 2014. I worked
in Healthcare, Insurance project. I learnt the information is
much more valuable than the raw data, and also learnt the skill of
the data query optimization. I read MSDN articles, improved my English reading and writing.
However in that period, I was just working as a team member.


The second stage was from the 2014 when I was enrolled into the SJTU with
full score on entrance exam of specialized course to the the 2016.
I worked in a Corporate Liquidation System, the CI platform, and I passed the CFA Level I exam.
I realized the difference between being a team developer
and being the Team Lead. Then I delivered a online shopping system
with 6 members team, improved my architecture ability. However, in these 2 years,
I realized that I had
limited conception on engineering practice.


The third stage was from September 2016 when I joined the
Infrastructure Architect Group of Hujiang to January 2017
when I moved to working in Singapore and to now. I understand that
a programming language is the expression of requirement.
No need to spend too much energy on comparing the different programming languages,
instead, software engineering is much more important,
such as deployment, monitoring, log system, Health Check,
and metrics, also including the conceptions of architecture design, such
as concurrent, reliability, throughput. Besides, a project owner needs to understand
and plan the roadmap, resources (internal or external) of project.
In recent 1 year, I practiced not just the delivery of code,
but also the engineering ability and being the owner of project.

I make the requirement happening, and I ensure the system keeping running.

### Next Plan

I have great passion on what I am doing now, and I also believe that team working is not
a collection of elite individual, it is also about the collaboration, the prioritizing
and delivery on time.

I am still interested in Finance, I believe the level of my finance domain knowledge
is higher than the average level of knowledges that many programmers have, these domain knowledges
are essential to understand and delivery the high quality solutions.

I will stay on Team Lead path, picking the appropriate tools
for the solution, working with the team for the final delivery.

## Cover Letter

Dear Sir / Madam,

Thanks for considering me as a potential candidate. I want to share more information about me.

**First**, as a passionate software engineer, I am 80 ~ 90% confident in:

* Scala programming, Play 2.6 with DI and ScalaTest (4 years project experiences)
* Akka Stream, Kafka, Hostedgraphite, Graylog (I delivered some solution base on that recently)
* Basic Golang Programming with Gin Framework (4 months of project owner in Hujiang, Shanghai)
* Reactjs (1 year project experience) and dva.js
* MongoDB, PostgreSQL, Oracle, SQL Server, Redis
* AWS infrastructure: deployment with LB, EC2
* GitHub, Bitbucket, Travis CI, JIRA and Agile software development (solid experiences)

**Second**, I always keep strong passion on learning.

I started to know the Functional Programming conception from F# and Erlang, and then I learned Scala from the Courseas.org. I believe learning is not just reading, but also applying what you have learned on the project. So I chose Scala and Play! for a online shopping platform project. And I also use Scala for my Master degree graduation project.

Meanwhile, I understand that a programming language is just a expression of requirement, software engineering is much more important.
So I spend 3+ years on learning and using the software engineering, such as deployment, monitoring, log system, health check, metrics, and also including the conceptions of architecture design, such as concurrent, reliability, throughput.

**Third**, I believe team collaboration is important. I built up 5-members part time team for the online shopping project from 2015 to 2016, and we delivered this project integrated with WeChat payment. I also led a 6-members team when I was working in Hujiang for building the continuous delivery process.

I will be glad to learn from the team, and I can also help our team grow up together. For instance, I delivered the training sessions below when I was working in Shanghai:

* Functional programming and fundamental Scala
* Algorithm 101, see the recommandation from my previous manager in LinkedIn

I dedicate my skills and passion to the project , working with team. I committed 800+ commits in 2017. I delivered one new project this year with 3 new features, 2 new third-party services integration, and I introduced 2 new ideas on software engineering for our project.

And I consider the schedule or deadline of project is of high priority, instead of building 100% prefect technical solution. Many developers spent a lot of time on specific programming languages, but I also pay attention on problem solving and software engineering. Since the software technique is changing so fast, we need ensure the project delivery and the solution reliability.

**One last point**, I want to go back to the financial or banking projects. I worked in insurance, and Corporate Liquidation projects before. I passed CFA Level I exam, I think I can understand the financial requirement better. My graduation paper of Master degree is about personal financial system including accounting, cash liquidation. I think I can learn a lot from financial project, and I will also dedicate my ideas to the project.

Regards

Scott

<style>
.clear {
  margin-bottom: 79px;
}

.tech-list {
  padding: 5px 10px;
  margin-top: 5px
}

.tech-list .tag {
  float: left;
  font-size: 18px;
  padding: 3px 8px;
  background-color: #BEBEBE;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 5px
}

tr td:first-child {
  width: 200px;
}

</style>

[1]: https://scozv.github.io/blog/guide/2016/07/27/bolero-a-restful-scaffold-with-scala  "Blog Bolero"
[2]: https://scozv.github.io/blog/pattern/2016/07/22/donot-ask-the-devs-to-prepare-env-by-click "Blog installation.sh"
