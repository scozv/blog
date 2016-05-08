---
layout: post
title: "将Hyde风格移至到现有的Jekyll站点"
description: ""
category: "guide"
tags: ["Jekyll", "markdown"]
lang: zh
---
{% include JB/setup %}


# 摘要
{:.no_toc}

> 本文描述了将Hyde风格移至到现有的Jekyll站点的步骤。主要的思路是：
>
> * 了解Jekyll站点的渲染步骤；
> * 使用Meld比较`Hyde`库和现有Jekyll站点的区别；
> * 替代并且测试
>
> 更详细的步骤需要参看英文版本。

<!--more-->

# Jekyll的文件结构

参考__[官方文档](https://jekyllrb.com/docs/structure/)__，
了解Jekyll的文件结构。

{% highlight sh %}
.
├── assets
|   ├── css
|   ├── js
|   ├── img
|   └── themes
|       ├── # hyde
|       └── bootstrap
├── _includes
|   ├── JB
|   |   ├── comments_render_script
|   |   ├── pages_list_script
|   |   ├── analytics_render_script
|   └── themes
|       ├── # hyde
|       └── bootstrap
|           ├── default.html
|           ├── page.html
|           └── post.html
├── _layouts
|   ├── default.html
|   ├── page.html
|   └── post.html
{% endhighlight %}


# Jekyll渲染的步骤

更详细的解释需要参看英文版本，简言之：

* `./_layout/*.html`，HTML网页的入口
* `./_includes/JB/*`， HTML渲染的时候，可重用的代码
* `./_includes/themes/`, 页面风格定义
* `./assets/themes/`, 公共的静态资源——图片、样式文件等

# 应用Hyde页面风格的步骤

更详细的解释需要参看英文版本。
