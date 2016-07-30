---
layout: page
title: "Pages"
alias: "..."
header: Pages
description: "More pages"
group: navigation
i18n: pages
permalink: pages/
---
{% include JB/setup %}

<!-- <h2>All Pages</h2> -->
{% assign pages_list = site.pages %}
{% include JB/pages_list %}

<link href="/assets/css/tags.css" rel="stylesheet">
