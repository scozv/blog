---
layout: page
---
{% include JB/setup %}


{% for post in site.posts %}
  <div class="summary-title"> {{ post.title }} </div>
  <div class="summary-time"> {{ post.date | date_to_string }} </div>
  <br />
  <div>
  {% if post.content contains '<!--more-->' %}
    {{ post.content | split:'<!--more-->' | first }}

    {% comment %}
    {% assign post_less =  post.content | split:'<!--more-->' | first %}
    {{ post_less | replace_first:'Abstract', '' }}
    {% endcomment %}

  {% else %}
    {{ post.content }}
  {% endif %}
  <br />
  <a href="{{ BASE_PATH }}{{ post.url }}">Read more ...</a>
  </div>
  <br />
  <br />
{% endfor %}


