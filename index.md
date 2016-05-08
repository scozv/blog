---
layout: page
---
{% include JB/setup %}

{% for post in site.posts %}
  {% if post.categories contains 'slides' %}
  {% else%}
  <div class="summary-title"> {{ post.title }} </div>
  <div class="summary-time"> {{ post.date | date: "%b %d, %Y" }} </div>
  <div class="summary-content">
  {% if post.content contains '<!--more-->' %}
    {{ post.content | split:'<!--more-->' | first }}

    {% comment %}
    {% assign post_less =  post.content | split:'<!--more-->' | first | replace_first:'Abstract', '' | replace_first:'摘要', '' %}
    {{ post_less }}
    {% endcomment %}

  {% else %}
    {{ post.content }}
  {% endif %}

  <a href="{{ BASE_PATH }}/{{ site.active_lang }}{{ post.url }}"><span class="read-more">{{ site.i18n["more"][site.active_lang] }}</span></a>
  </div>

  <br />
  {% endif %}
{% endfor %}
