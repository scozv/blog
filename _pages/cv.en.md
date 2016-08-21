---
layout: page
title: "Resume"
permalink: cv/
lang: en
group: navigation
weight: 200
---
{% include JB/setup %}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## [简体中文](https://scozv.github.io/blog/zh/cv/)

## TL;DR

<table>
  <thead>
    <tr>
      <th style="text-align: left">meta</th>
      <th style="text-align: left">data</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: left">Latest updated</td>
      <td style="text-align: left">Aug, 2016</td>
    </tr>
    <tr>
      <td style="text-align: left">Links</td>
      <td style="text-align: left">
        <div class="tech-list">
        <div class="tag"><a href="https://github.com/scozv">scozv@github</a></div>          
        <div class="tag"><a href="https://github.com/scozv/algo-js">algo-js</a></div>
        <div class="tag"><a href="https://scozv.github.io/algo-wiki/en/">algo-wiki</a></div>
        <div class="tag"><a href="https://scozv.github.io/blog/zh">Blog</a></div>
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
          <div class="tag">6 years</div>
          <div class="tag">Tech Leader</div>
          <div class="tag">Looking for: Java Developer, Node.js Developer</div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="text-align: left">Tech</td>
      <td style="text-align: left">
        <div class="tech-list">
          <div class="tag">React.js</div>
          <div class="tag">Redux</div>
          <div class="tag">Node.js</div>
          <div class="tag">Scala</div>
          <div class="tag">RESTful</div>
          <div class="tag">Play!</div>
          <div class="tag">ECMAScript 6</div>
          <div class="tag">Oracle</div>
          <div class="tag">Git</div>
          <div class="tag">Algorithm</div>
          <div class="tag">Markdown</div>
          <div class="tag">LaTeX</div>
          <div class="tag">Linux</div>
          <div class="tag">MongoDB</div>
          <div class="tag">Azure</div>
          <div class="tag">GraphQL</div>
          <div class="tag">JIRA</div>
          <div class="tag">Continuous Integration</div>
        </div>
      </td>
    </tr>
  </tbody>
</table>

## Education

* **Shanghai Jiaotong University** _2013 ~ Now_

  Master of Software Engineering (Financial Information), Master Degree
* **Ningbo University** _2005 ~ 2009_

  Information System and Information Management, Bachelor Degree

## Working Experience

### Project in SJTU (as the Tech Leader)

meta  | data
:-----|:-----
Project | O2O Online Fruits Selling Based on WeChat Eco-system
Time | Aug, 2015 ~ Now
Role | Tech Leader, Architect and Deployment Manager
Notes  | I have written some posts on the ideas of this project, which are located in [here](https://scozv.github.io/blog/guide/2016/07/27/bolero-a-restful-scaffold-with-scala), [here](https://scozv.github.io/blog/pattern/2016/05/05/a-low-coupling-architecture-of-the-web-solution-with-continuous-integration), and [here](https://scozv.github.io/blog/pattern/2016/05/18/a-linear-branch-management-with-git)

**Project Details**：

Loose coupling is a core idea of this project, briefly speaking, this project contains a
`RESTful Server` for data manipulating, and a View (Web page) for user interaction.

Server and the View have been deployed on different VMs, under Ubuntu Server 14.04.

The `RESTful Server` is based on `Play! Framework` with `Scala` Programming.
And, switching to `Spray.io` is on the schedule.

Feature in View, the Web page:

* is rendered with `React.js`, and `React Native`,
* is NOT two-way data binding,
* is written with `ECMAScript 6`, interpreted with `Babel 6`,
* uses `Redux`, for the `Flux`,
* will use `GraphQL` and the `Relay`,
* is hosted with `Node.js` and `Webpack` as the HTTP Server.

Features in `RESTful Server`:

* `Async` I/O with `MongoDB` based on `ReactiveMongo`,
* Mocking the HTTP Request with `FakeApplication`,
* A global rule object with Monad principle,
* Multiple payment channel integration with Ping++ SDK,
* Token authentication,
* Automatic test and deployment scripts.

### Q Treasury Solution Project (as a Sr. Developer)

meta  | data
:-----|:-----
Employer | SunGard China
Time | June, 2013 ~ Now
Summary | Be responsible to implementation of `Fees` calculation API. Mainly using `ASP .NET MVC` and the AOP conception for data validation.

### Y Vehicle Accident Claim Center Project (as a Developer)

meta  | data
:-----|:-----
Employer | Cognizant China
Time | Oct, 2011 ~ June, 2013
Summary | Be responsible to call center implementation, and the workflow implementation of orders.

### K Hospital Information System (as a Developer)

meta  | data
:-----|:-----
Employer | Ningbo KingT Software Company
Time | April, 2010 ~ Oct, 2011
Summary | Involved into the deployment and the `PL/SQL` reporting implementation.

## Candidate Introduction

### Profile

I am not able to interact with any person I just meet. However, after a period of
team work, the members in the team will consider me as a person who are able to **be on focus**.

I have **passion** on learning.
I passed **CFA Level 1** Exam, and entered into SJTU for MSE degree.

I have a more than **5 years experiences on English reading and writing**.

### In the Weekend

In the weekend, I started to write this [blog](/) about what I thought of what I have done.
And I also learn from [Coursera](https://www.coursera.org/), on Algorithm, Data Analysis and the
Financial courses.

I swim, I play tennis and take traveling for freshing ideas.

### Last Year

I leaded a 6 members team (including myself) and **be a architect**.
I archived:

* rendering the web page with `React.js` and `Webpack`,
* more than 600 `git commit`s,
* solving 60% of 115 issues,
* design of 127 test cases with code coverage of 90%.

Our team delivered a O2O online fruits selling web sites.
Besides what we have done, I lead this team for trying some new solution,
including:

* A `RESTful`-driven development process,
* Loose coupling architecture,
* Server as the `RESTful API`, all of services,
* View rendered by `React.js`, with advance topics, such as `Relay`, `Flux` and `GraphQL`,
* CI platform on Gitlab,
* JIRA with Sprints,
* Markdown documentation system,
* Working on Ubuntu.

### As a Team Lead

The 6 members team (including myself) are build with 4 developers, 1 product manager
and 1 marketing.

I AM NOT agree with using brain storm in every meeting, I ask member
to prepare a outline before meeting.

We may argue with different solutions, but will NOT prejudge others.

As the Team and Tech Lead, I:

* manage the project with JIRA (CI),
* build the [Code Template] [1] and the [Environment Script] [2],
* prefer to working with a member who is full of passion.

### The Next Career Plan

For the coming new position, I am looking for a full-stack development:

* Architect is based on `RESTful API` and Loose Coupling,
* Web page is rendered with `React.js` and `Node.js`,
* `RESTful` Server is developed in Java Eco-system, hosted in `Linux` (Cloud).

I believe the ability of a team is more powerful than the ability of individual.
So I am looking forward for growing up with team members.

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
