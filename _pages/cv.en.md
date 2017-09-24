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
      <td style="text-align: left">September, 2017</td>
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

* **Shanghai Jiaotong University** _2013 ~ Now_

  Master of Software Engineering (Financial Information System, Part time), Master Degree
* **Ningbo University** _2005 ~ 2009_

  Information System and Information Management, Bachelor Degree

## Working Experience (`Scala` Related)

### G Product Core Data Analysis System

Company | LeadIQ
:-----|:-----
Project | Data Analysis System Based on Play 2.6 and Akka 2.5
Time | 2017.06 ~ Now

Achievement:
* 80% committed code on August 2017.
* Data I/O with Mongo, Redis and Postgres based on Dependencies Injection.
* Isolated threads for 3rd API server and data query with separating `dispatcher`.
* Log message `TrackingId` with `CUID` and integrated with Graylog.
* Design and implementation the activities report based on Graph, improve the query time complexity from  $$O(n\cdot m)$$ down to $$O(\log n)$$.
* Deployment with AWS EC and LB.
* Throttle implementation for 3rd API request with Akka Stream.
* Lite admin page with `dva`, `antd` and `React.js`.

### L Product Core Data Category System

Company | LeadIQ
:-------|:---------
Project | Data Category System on Play 2.3 and Akka 2.3
Time | Sept, 2016 ~ Now

Achievement:

* 800+ commits from January to August 2017, 300 commits more than next developer.
* Implementation of 3 business modules.
* Integration with 2 3rd party services.
* Implementation of Akka Work Pulling Pattern and customized `dispatcher`.
* Implementation of TrackingId.
* Post with title [_Putting Tracking Id to Log Message with Customized Akka Dispatcher and Mapped Diagnostic Contexts in Play 2.6_](https://scozv.github.io/blog/pattern/2017/07/18/injection-of-tracking-id-to-logback-message-with-customer-dispatcher-and-mapped-diagnostic-contexts-in-scala).

###  S O2O Online Selling Platform (as the Tech Leader)

Company | Project in SJTU
:------|:----------
Project | O2O Online Fruits Selling Based on WeChat Eco-system
Time | Aug, 2015 ~ Apr, 2016
Role | Tech Leader, Architect and Deployment Manager

Achievement:

* Isolation between Frontend and Backend.
* `Async` I/O with `MongoDB` based on `ReactiveMongo`.
* Mocking the HTTP Request with `FakeApplication`.
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

### D DFS RESTful API for Production Line (as a Sr. Product Development Engineer)

Company | Hujiang Education & Technology
:-------|:-----------
Project | DFS RESTful API for Production Line based on Golang
Time | Sept, 2016 ~ Oct, 2016
Role | `Golang` development
Notes | Provide the RESTful API for production line using Golang and Gin Web Framework. Meanwhile lead 6 members delivery team, build the continuous delivery process cross over the entire development group, communicate with cross departments to get resources and support.


### Q Treasury Solution Project (as a Sr. Product Development Engineer)

Company | SunGard
:-------|:------------
Time | June, 2013 ~ Aug, 2016
Summary | Be responsible to implementation of `Fees` calculation API. Mainly using `ASP .NET MVC` and the AOP conception for data validation.

### Y Vehicle Accident Claim Center Project (as a Developer)

Company | Cognizant
:-------|:------------
Time | Oct, 2011 ~ June, 2013
Summary | Be responsible to call center implementation, and the workflow implementation of orders.

### K Hospital Information System (as a Developer)

Company| Ningbo KingT Software Company
:-------|:------------
Time | April, 2010 ~ Oct, 2011
Summary | Be involved into the deployment and the `PL/SQL` reporting implementation.

### N HR Resume Management System (as an Intern Developer)

Company | Nordic Industrial Park (Ningbo) Co., Ltd.
:-------|:------------
Time | Sept, 2009 ~ April, 2010
Summary | Delivery a Resume information system to collection the resumes and candidates information.


## Candidate Overview

### Working Experiences in Last Two Years

I grew fast in last two years, I delivered
a small online shopping project with 6 members team
during 2015 to 2016 when I was studying in SJTU
for Master of Software Engineering.

As the Tech Lead, I improved a lot from the stage that
only gross requirement was available to the stage that
all features has been delivered, calling this as a _Zero to One_.

In recent 1 year, I moved to Singapore, kept learning and writing on React, Scala, and most important, delivered the solutions.

I led 3 small teams in past two years, I learn the collaboration,
the communication, and how to choose the team member,
how to get support from other team.

I read and I learn. I already passed the Level I exam of CFA.
I have submitted the Master Degree graduation paper on June, which
has addressed the Loose Coupling architecture and the application
in Financial Information System.


### Three Stages for Last 8 Years of Software Engineering

I consider my last 8 years of software engineering experiences
as three stages.

The first stage is from 2009 when I graduated to 2014, I worked
in Healthcare, Insurance project. I learnt the information is
much more the raw data, the data query optimization. I read a lot
from MSDN. However I was working as a team member in that period.


The second stage is from 2014 when I enrolled the SJTU with
full score on  entrance exam of specialized course to 2016.
I worked in a complicated Financial Information System, the CI platform, and I passed the CFA Level I exam.
I realized the difference between being the team developer
and being Team Lead. Then I delivered a online shopping system
with 6 team member, improved my architect ability. However, I had
limited conception on engineering practice.


The third stage is from September 2016 when I joined the
Fundamental Architect Group of Hujiang to January 2017
when I moved to working in Singapore and to now. I understand
the programming language is the expression of requirement.
No much more effect needed for comparing the programming languages,
since besides of different languages, instead, many software engineering topics are mandatory, deployment, monitor, log system, Health Check,
and metrics. Also a lot of conception on architect design, such
as concurrent, reliablity, throughput. I practice not only the delivery of code, but also the engineering ability.

I make the requirement happen, and I ensure the system keeping running.

### Next Plan

I have great passion on what I am doing, I believe that team work is not
full of individual of elite, it is collaboration and delivery on time.

I will stay on Team Lead path, that picking the appropriate tools
for the final solution, working with team for the last delivery.


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
