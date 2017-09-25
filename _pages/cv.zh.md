---
layout: page
title: "简历"
permalink: cv/
lang: zh
group: navigation
weight: 200
---
{% include JB/setup %}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## [English Resume](https://scozv.github.io/blog/cv/)

## TL;DR

<table>
  <tbody>
    <tr>
      <td style="text-align: left">最后更新</td>
      <td style="text-align: left">2017年09月</td>
    </tr>
    <tr>
      <td style="text-align: left">链接</td>
      <td style="text-align: left">
        <div class="tech-list">
          <div class="tag"><a href="https://github.com/scozv">github</a></div>          
          <div class="tag"><a href="https://github.com/scozv/tango/blob/master/lang/es6/DUWO.md">tango</a></div>
          <div class="tag"><a href="https://scozv.github.io/tango/cn/">tango-docs</a></div>
          <div class="tag"><a href="https://github.com/scozv/bolero">bolero</a></div>
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
          <div class="tag">8年</div>
          <div class="tag">带领团队（架构）</div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="text-align: left">技能</td>
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

## 教育背景

* **上海交通大学** _2013 ~ 现在_

  软件工程硕士（金融信息化、在职）， 硕士
* **宁波大学** _2005 ~ 2009_

  信息管理与信息系统， 本科

## 项目经历（`Scala`相关）

### 某产品核心数据分析系统

就职公司 | LeadIQ
:-----|:-----
项目内容 | 基于Play 2.6和Akka 2.5的数据分析系统
项目时间 | 2017.06 ~ 至今
简略介绍 | 该项目的负责人，除了开发任务，还承担版本和发布的规划工作。截止2017年8月，完成了该项目80%以上的代码。使用依赖注入的方式接入了Mongo、Redis和Postgres。使用不同的`dispatcher`保证第三方接口调用和查询服务的线程分离。使用`CUID`作为`TrackingId`。设计并实现了基于图的节点活动报告，将原来的查询耗时从 $$O(n\cdot m)$$ 降低到 $$O(\log n)$$。完成AWS相关节点的部署，以及Graylog的接入。使用Akka Stream控制消息的发送速率，并重构了系统原有的Actor设计。同时为系统设计实现简化的Admin接口和管理界面（使用`dva`、`antd`和`React.js`相关技术）。使用[x.y.z](https://scozv.github.io/blog/zh/pattern/2016/05/18/a-linear-branch-management-with-git)严格控制版本和发布，保证发布失败能够迅速回滚到前一个稳定版本。

### 某产品核心数据分类系统后端服务

就职公司 | LeadIQ
:-----|:-----
项目内容 | 基于Play 2.3和Akka 2.3的数据分类系统
项目时间 | 2016.09 ~ 至今
简略介绍 | 3个核心模块的开发与维护，2个三方接口的接入。完成Akka Work Pulling Pattern和自定义`dispatcher`的应用，在代码中完成日志[TrackingId的实现](https://scozv.github.io/blog/zh/pattern/2017/07/18/injection-of-tracking-id-to-logback-message-with-customer-dispatcher-and-mapped-diagnostic-contexts-in-scala)。2017年1月至8月，累计完成800+次代码提交，比第二位的代码提交量多300次。

### 某O2O在线销售平台（技术负责人）

就职公司 | 上海交通大学研究生期间项目
:-----|:-----
项目内容 | 基于微信浏览器运行的水果销售平台
项目时间 | 2015.08 ~ 2016.08
职责范围 | 技术架构和生产部署
项目总结  | 有关该项目的心得，可以参考 [这里](https://scozv.github.io/blog/zh/guide/2016/07/27/bolero-a-restful-scaffold-with-scala)、[这里](https://scozv.github.io/blog/zh/pattern/2016/05/05/a-low-coupling-architecture-of-the-web-solution-with-continuous-integration)或者[这里](https://scozv.github.io/blog/zh/pattern/2016/05/18/a-linear-branch-management-with-git)
简略介绍 | 架构上实现了前后端的完全分离，并顺利地将多个节点部署到云虚机（Windows Azure）上。前台使用了`React.js`，所有代码都使用了`ECMAScript 6`的语法，使用`Babel 6`编译。后台基于`Play! Framework`实现的RESTful API。设计了一套的`Monad`类，用来完成各种规则的校验。使用Ping++完成了多个支付渠道的接入。实现了基于Token的用户认证。创建了发布脚本和数据备份脚本。

## 项目经历（非`Scala`类）

### 某分布式文件管理系统（Golang开发工程师）

就职公司和部门 | 沪江（后端架构部）
:-----|:-----
项目内容 | 基于第三方云存储开发的文件管理系统
项目时间 | 2016.09 ~ 2016.12
简略介绍 | 独立承担基于`Golang`开发的分布式文件系统的开发维护、版本和发布，分析和处理业务部门的需求，保持和第三方云供应商的沟通和协作。该系统以RESTful API的形式作为公司级别的基础架构服务，供产品业务线使用。四个月期间，完善了原系统中缺失的测试和发布脚本；为业务部门新增三个接口；修复了因版本未合并而导致的运行时错误；和第三方云供应商对接开发工作；系统任务（Gitlab Issue）27项、完成19项。另一方面，组织了5次基础数据结构和算法的培训工作。在此期间，同时带领6人小组整理公司级别的发布流程，和横向部门一起完成发布系统的部署和应用。

### 某大型资产管理系统（高级开发工程师）

就职公司 | SunGard
:-----|:-----
在职时间 | 2013.06 ~ 2016.08
简略介绍 | 独立负责Fees计算模块的全栈开发，和团队一起完成权益、会计等模块的开发。主要使用了`ASP .NET MVC`。使用AOP控制赋值的有效性。使用`Razor`引擎绘制View。

### 某大型车险理赔系统（中级开发工程师）

就职公司 | Cognizant
:-----|:-----
在职时间 | 2011.10 ~ 2013.06
简略介绍 | 负责报案中心的部分业务实现。主要使用了`ASP .NET`，参与设计和开发了报案订单工作流模块。

### 某医疗化验室信息管理系统（初级开发工程师）

就职公司 | 宁波金唐软件有限公司
:-----|:-----
在职时间 | 2010.04 ~ 2011.10
职责范围 | 负责实施和报表的开发
简略介绍 | 参与了`Oracle`数据库的建表和部分`PL/SQL`的实现。参与了完整的项目部署，设计并实现将时间序列做为主键。

### 某HR简历信息系统（实习）

就职公司 | 宁波北欧工业园区管理有限公司
:-----|:-----
在职时间 | 2009.07 ~ 2010.04
职责范围 | 负责HR部门的简历信息系统的开发和交付
简略介绍 | 独自完成了简历管理信息系统的设计和部署。


## 职业规划

### 过去两年的成果和收获

过去两年是我职业生涯成长最快的两年，15年到16年在交大读研期间，交付了一个小型的购物平台。
期间我带领了一个六人团队（包括我）。作为技术架构的负责人，也是开发的主力，我通过从零到有
的开发过程，提高了自己的开发水平：前端React、后端Scala以及相关的云主机部署。近一年中，又在一些独立
的项目中，提高了技术架构和软件工程的能力。

我也在三次带领团队的过程中，不断地提高团队的协作能力。这包括如何选择团队的成员、如何组织会议沟通，如何从团队外部
获取资源和相关的支持。

我**热爱学习**，已经通过了CFA Level I（金融行业类）的考试。
并于六月份完成了硕士学位论文（查重率`1.9%`）答辩，
该论文研究了松耦合架构在金融相关系统的应用。

### 软件工程领域的三个职业阶段

我将过去的工作经历分为三个阶段：

第一个阶段从2009年毕业到2014年，期间经历了医疗、保险行业的信息系统开发，这是开发职业生涯的初级阶段。
我在这个阶段认识到信息的重要性，
学会了优化数据查询性能，掌握了基本的开发问题解决思路。同时阅读了MSDN上的很多英文技术文档。
但我都是在别人的带领下，作为开发流程的一个角色参与到团队的协作当中。

第二个阶段是从2014年到2016年，期间我参与了金融系统的持续集成、通过了CFA Level I的考试，
以专业课满分的成绩进入上海交通大学攻读在职软件工程硕士（金融信息化方向）。
我意识到作为开发成员参与系统开发和作为Team Lead架构部署系统是完全不同的角色。前者是一个参与者，
后者需要有从无到有的架构管理能力。读研期间，和研究生同学、同事共六人完成了一个基于微信的购物
平台的设计实现与交付，提高了前后端的开发能力，对系统实践方案有了更完整的认识。前端使用`React.js`
进行组件化的实践，后端使用`Scala`语言实现响应式异步接口。尽管如此，我对工程上的一些概念还比较薄弱。

第三个阶段是从2016年9月我入职沪江后端架构研发部开始，再到17年一月前往新加坡工作，一直到现在，
我进一步地意识到编程语言仅仅是一种表达需求的方式。语言的优劣无需过多比较，因为除了编程语言本身以外，
还有很多需要考虑的，比如涉及到部署、监控、日志、Health Check以及软件度量等诸多软件工程相关的话题；
比如对并发、可靠、消息吞吐等架构上的设计。
简言之，除了具备从无到有的开发能力，还需要具备让系统可靠持久运行下去的能力。
在这期间，我承担了`Golang`语言编写的基础文件服务维护工作，
使用`Scala`实现的数据分析系统RESTful接口和Admin管理系统，并接入了Graylog日志系统、
Hosted Graphite度量系统，在AWS中增加了系统的运行监控。
同时在系统中使用了Akka Stream和Kafka对
并发和消息吞吐做了控制。我也意识到，做为项目的Owner，
还需要对项目整体、内外部资源有所规划，分清不同的优先级。

### 未来规划

我对技术充满着热情，同时认为技术是实现需求的工具。
我认为团队的成员可以有不同的优势，但执行力是非常重要的一点。

我对金融信息化非常感兴趣，我认为我掌握的金融知识高于程序员的平均水平。
这将有助于我更好地向金融相关需求提供解决方案。

未来我会继续朝着技术架构的方向，根据实际情况选用合适的技术，为产品需求提供
可靠及时的解决方案。我也愿意带领团队应对不同的需求，在团队的协作下完成目标。



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
