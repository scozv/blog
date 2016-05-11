---
layout: post
title: "A Loose Coupling Architecture of the Web Solution with Continuous Integration"
description: ""
category: "pattern"
tags: ["CI", "project"]
lang: en
---
{% include JB/setup %}

# Abstract
{:.no_toc}

> This article will discuss two core ideas for a Architecture of the Web Solution,
> that are Loose Coupling and Continuous Integration.
>
> The article is mainly written in Chinese, while the
> English post has not been started yet.
> However, I provide a drawing for indicating the Loose Coupling Architecture.

<!--more-->


The Loose Coupling Architecture can be explained as below
(drawn with [ASCIIFlow Infinity](http://asciiflow.com/)):

    ####################################  scenario 01, entire node

    +------------+              +-----------------+
    | you and me |              | IIS / tomcat    |
    | Chromium   +------------> | ASP .NET MVC    |
    |            |              | Database        |
    | mobile     |              |                 |
    | device     |              |                 |
    +------------+              +-----------------+


    ####################################  scenario 02, separating View from MV+C

    +------------+              +-----------------+                      +--------------------+
    | you and me |              | View            |    HTTP Request      | RESTful API        |
    | Chromium   +------------> | React.js        +--------------------> | http://spray.io/   |
    |            |              | static HTML page|                      |                    |
    | mobile     |              | mobile App      |                      | Database           |
    | device     |              |                 |                      |                    |
    |            |              |                 | <--------------------+                    |
    +------------+              +-----------------+    HTTP Response     +--------------------+


    ####################################  scenario 03, separating Database from MV

    +------------+              +-----------------+                      +--------------------+
    | you and me |              | View            |    HTTP Request      | RESTful API        |
    | Chromium   +------------> | React.js        +--------------------> | http://spray.io/   |
    |            |              | static HTML page|                      |                    |
    | mobile     |              | mobile App      |                      |                    |
    | device     |              |                 |                      |                    |
    |            |              |                 | <--------------------+                    |
    +------------+              +-----------------+    HTTP Response     +-+------------------+
                                                                           |
                                                                           |  connection
                                                                           |  string
                                                                           |
                                                                           |
                                                                         +-+------------------+
                                                                         | PaaS               |
                                                                         | Database+aaS       |
                                                                         |                    |
                                                                         |                    |
                                                                         |                    |
                                                                         |                    |
                                                                         +--------------------+




    ####################################  scenario 04, multiple Databases


                                                                          +--------------------+
                                                                          | PaaS               |
                                                                          | Database+aaS       |
                                                                          |                    |
                                                                          | Core Business      |
                                                                          |                    |
                                                                          |                    |
                                                                          +-+------------------+
                                                                            |
                                                                            | connection
                                                                            | string
                                                                            |
                                                                            |
     +-------------+             +-----------------+                      +-+------------------+
     | you and me  |             | View            |    HTTP Request      | RESTful API        |
     | Chromium    +-----------> | React.js        +--------------------> | http://spray.io/   |
     |             |             | static HTML page|                      |                    |
     | mobile      |             | mobile App      |                      |                    |
     | device      |             |                 |                      |                    |
     |             |             |                 | <--------------------+                    |
     +-------------+             +-----------------+    HTTP Response     +-+------------------+
                                                                            |
                                                                            | connection
                                                                            | string
                                                                            |
                                                                            |
                                                                          +-+------------------+
                                                                          | PaaS               |
                                                                          | Database+aaS       |
                                                                          |                    |
                                                                          | user-agent data    |
                                                                          |                    |
                                                                          |                    |
                                                                          +--------------------+




     ####################################  scenario 05, separating and combination

     +------------+              +-----------------+                      +--------------------+
     | you and me |              | View            |    HTTP Request      | RESTful API        |
     | Chromium   +------------> | React.js        +--------------------> | http://spray.io/   |
     |            |              | static HTML page|                      |                    |
     | mobile     |              | mobile App      |                      |                    |
     | device     |              |                 |                      |                    |
     |            |              |                 | <--------------------+                    |
     +------------+              +-----------------+    HTTP Response     +-+------------------+
                                 | Database        |                        |
                                 |                 |                        | connection
                                 | user-agent data |                        | string
                                 |                 |                        |
                                 |                 |                        |
                                 |                 |                        |
                                 +-----------------+                      +-+-------------------+
                                                                          | PaaS                |
                                                                          | Database+aaS        |
                                                                          |                     |
                                                                          | Core Business       |
                                                                          |                     |
                                                                          |                     |
                                                                          +---------------------+
