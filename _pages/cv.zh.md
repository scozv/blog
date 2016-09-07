---
layout: page
title: "简历"
permalink: cv/
lang: zh
group: _navigation
weight: 200
---
{% include JB/setup %}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## [English Resume](https://scozv.github.io/blog/cv/)

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
      <td style="text-align: left">最后更新</td>
      <td style="text-align: left">2016年8月</td>
    </tr>
    <tr>
      <td style="text-align: left">链接</td>
      <td style="text-align: left">
        <div class="tech-list">
          <div class="tag"><a href="https://github.com/scozv">scozv@github</a></div>          
          <div class="tag"><a href="https://github.com/scozv/algo-js/blob/master/DUWO.md">algo-js</a></div>
          <div class="tag"><a href="https://scozv.github.io/algo-wiki/zh-cn/">algo-wiki</a></div>
          <div class="tag"><a href="https://scozv.github.io/blog/zh">Blog</a></div>
          <div class="tag"><a href="https://scozv.github.io/blog/cv/">English Resume</a></div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="text-align: left">标签</td>
      <td style="text-align: left">
        <div class="tech-list">
          <div class="tag">上海交通大学</div>
          <div class="tag">软件工程硕士（在读）</div>
          <div class="tag">6年</div>
          <div class="tag">带领团队（架构）</div>
          <div class="tag">期望岗位：Java工程师, Node.js开发</div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="text-align: left">技能</td>
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

## 教育经历

* **上海交通大学** _2013 ~ 现在_

  软件工程硕士（金融信息化、在职）， 硕士
* **宁波大学** _2005 ~ 2009_

  信息管理与信息系统， 本科

## 项目经历

### 上海交通大学研究生期间的项目（技术架构师）

meta  | data
:-----|:-----
项目内容 | 基于微信浏览器运行的水果销售平台
项目时间 | 2015.08 ~ 现在
职责范围 | 技术架构和生产部署
备注  | 有关该项目的心得，可以参考 [这里](https://scozv.github.io/blog/zh/guide/2016/07/27/bolero-a-restful-scaffold-with-scala)、[这里](https://scozv.github.io/blog/zh/pattern/2016/05/05/a-low-coupling-architecture-of-the-web-solution-with-continuous-integration)或者[这里](https://scozv.github.io/blog/zh/pattern/2016/05/18/a-linear-branch-management-with-git)

**详细介绍**：

宏观上，实现了前后台的完全分离，并顺利地将多个节点部署到云虚机（`Ubuntu 14.04`）上。

前台使用了`React.js`，正在尝试`React Native`：

* 数据流是单向的，不使用双向绑定；
* 所有代码都使用了`ECMAScript 6`的语法，使用`Babel 6`编译；
* 使用`Redux`作为`Flux`的实现；
* 正在尝试`GraphQL`、`Relay`；
* 使用`Node.js`和`Webpack`作包管理以及HTTP Server发布。

后台服务通过`Scala`实现，
基于`Play! Framework`（计划迁移到`Spray.io`）实现的`RESTful API`：

* 借助`ReactiveMongo`实现`MongoDB`数据库的异步读写；
* 使用`FakeApplication`完成集成测试（和页面View无关）；
* 设计了一套的`Monad`类，用来完成各种规则的校验；
* 使用Ping++完成了多个支付渠道的接入；
* 实现了基于Token的用户认证；
* 创建了发布脚本和数据备份脚本。

### 某大型资产管理系统（高级开发工程师）

meta  | data
:-----|:-----
就职公司 | SunGard China
在职时间 | 2013.06 ~ 现在
职责范围 | 高级开发工程师，独立负责Fees计算模块的全栈开发
简略介绍 | 主要使用了`ASP .NET MVC`。使用AOP控制赋值的有效性。使用`Razor`引擎绘制View。

### 某大型车险理赔系统（中级开发工程师）

meta  | data
:-----|:-----
就职公司 | 高知特信息技术（上海）有限公司
在职时间 | 2011.10 ~ 2013.06
职责范围 | 中级开发工程师，负责报案中心的部分业务实现
简略介绍 | 主要使用了`ASP .NET`，参与设计和开发了报案订单工作流模块。

### 某医疗化验室信息管理系统（初级开发工程师）

meta  | data
:-----|:-----
就职公司 | 宁波金唐软件有限公司
在职时间 | 2010.04 ~ 2011.10
职责范围 | 初级开发工程师，负责实施和报表的开发
简略介绍 | 参与了`Oracle`数据库的建表和部分`PL/SQL`的实现。参与了完整的项目部署，设计并实现将时间序列做为主键。


## 个人介绍

### 我这个人

我不是一个能很快和陌生人打成一片的人。但是，和我相处的同事，都认为我是一个能够**静下心来做事**的人。

我**热爱学习**，已经通过了CFA Level 1（金融行业类）的考试。
同时，还以专业课满分的成绩进入上海交通大学攻读软件工程硕士（金融信息化方向、在职）。

我具有**较好的英文读写能力**。

### 空余时间

空余时间，我开始整理过去一年的开发和项目心得。
这些文章使用`Markdown`发表在这个`github-page`上。

我也会在[Coursera](https://www.coursera.org/)上，不停地学习。包括算法类、数据分析类、金融类等课程。

我喜欢游泳、打网球，偶尔也去旅游，看看新鲜的东西。

### 过去这一年

在过去的这一年里，我带领了一个六人团队（包括我）。
作为**技术架构的负责人**，也是开发的主力：

* 完成了React.js的代码并使用Webpack打包发布；
* 完成了600多次`git commit`；
* 提出了115个issue，并完成了其中的60%；
* 设计了127个测试用例，覆盖了90%的`API`。

我们完成了一个在线水果销售平台的项目。
这个项目的意义，不仅仅是从零到最终的部署完成。更重要的是，我带领着这个团队，尝试了一些新的解决方案：

* 我们以`RESTful API`为导向完成整个开发；
* 做到了前后端的完全分离，并准备向微服务的方向尝试；
* 我要求服务都以`RESTful API`的方式呈现，并在云VM上部署；
* 我们使用了`React.js`来渲染页面，并开始研究相关的一整套解决方案，比如`Reley`、`Flux`和`GraphQL`；
* 我们在`Gitlab`上完成了持续集成的部署；
* 很多问题，我们都在`JIRA`上追踪，并创建Sprint持续迭代；
* 我要求团队每位成员能用`Markdown`写文档，并将团队的所有文档纳入源代码管理；
* 我们开发团队，都在`Ubuntu 14.04+`上面工作。

### 带领过的团队

过去一年带领的这个团队，有四名开发（包括我），一名产品设计和一位市场运营。

我**不赞成**过多地使用头脑风暴，而是希望每位成员在讨论前，
对即将讨论的问题，准备一些自己的建议和解决方案。

尤其是开发团队，我建议团队的成员，在向团队提出一些新的技术时，
要提前学习，最好能有一些demo和个人心得。而不是简简单单地把一个名词抛给团队的其他成员。

我们团队之间有时也会有一些争论，但我们**对事不对人**。
在争论的时候，我希望团队的成员有理有据。
特别在技术方面，如果认为某一个解决方案不可行的时候，希望能够给出可行的方案（论据），
用来对比。而**不是想当然地否定**其他成员的想法。

### 对未来的规划

下一份工作，我希望可以承担全栈开发的工作：

* 基于`RESTful API`的前后端分离；
* 前端页面可以使用`React.js`系列框架进行渲染和数据绑定；
* 后端服务在Java生态圈中开发，部署至Linux（云平台）。

从之前的经验来看，团队的力量远远大于个人，
所以很期待加入开放、热情的团队，和团队成员们一起成长。


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
