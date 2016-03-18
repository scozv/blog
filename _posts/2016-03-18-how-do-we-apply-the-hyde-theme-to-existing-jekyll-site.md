---
layout: post
title: "How Do We Apply the Hyde Theme to Existing Jekyll Site?"
description: ""
category: "help"
tags: ["Jekyll", "markdown"]
---
{% include JB/setup %}



# Abstract
{:.no_toc}

> This article will describe the process of applying Hyde theme on my existing Jekyll Bootstrap site.
> And this approach can be used for applying any theme of Jekyll. The main ideas of integrating the 3rd Jekyll Theme
> are:
> 
> * learn the basic structure of Jekyll site,
> * learn the basic workflow of rendering HTML from Jekyll scripts,
> * comparing the code differences between `Hyde` and your site,
> * replacing code and test.

<!--more-->

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# Before Applying...

## Start a Branch for Hyde

Applying the Hyde to your existing Jekyll site is not a one-click step, so open a branch for Hyde applying, 
In case when you fail to apply Hyde and you want to revert changes and start over again.

## NO Need to be a Master of CSS or HTML

I have very limited experience on CSS or HTML, so CSS for me is like RegEx, I can always check the CSS references, 
or seek help from stackoverflow when I face a styling problem.

# Introduction of Jekyll

## the Directory Structure of Jekyll

Check the official document on the folder structure of Jekyll:

__[Directory structure](https://jekyllrb.com/docs/structure/)__

For me, I used [Jekyll-bootstrap 3](https://github.com/dbtek/jekyll-bootstrap-3) before.
the directory structure has a little bit difference comparing with the original Jekyll.

```bash
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
```

Notice that there are two folders named `themes`, I will explain more letter.
The `Hyde` theme will be installed into these two `themes/` folder.
You may read the source code and it's easy to understand their usage.

## HTML Rendering Workflow

This section will list the steps of rendering HTML by Jekyll.
Again, reading the source code is useful, and it can help you apply other plugin / themes
to your existing Jekyll site.

### `./_layout/*.html`, the Entrance of HTML

the `_layout` folder is used for:

* configuration of the theme name, 
* including the theme layout files, or installing the __part__ of theme into your site.

Read the source code of any `html` file in `_layout` folder, and notice that:

* a variable named `layout.theme.name` has been defined in these `html` files, and it may be used for Jekyll 3. 
  see [issue #15](https://github.com/scotv/scotv.github.com/issues/15#issuecomment-195689664),
* make sure the path correct in `{ % include % }`.

### `./_includes/JB/*`, the Utilities Scripts as the HTML Rendering Helper

`JB` stands for `Jekyll Bootstrap`, in this folder, you can find many useful scripts that are used for 
rendering a `part` of HTML: 

* How do you want to display the comment section in your post,
* define some global variable, see `./_includes/JB/setup`.

The scripts in `JB/` are mainly used in `./_includes/themes/*`, 
You will figure out the usage of utilities by searching `{ % include _includes/JB/setup % }`


### `./_includes/themes/`, the Layout Design of the Theme

The HTML layout design of theme, Jekyll Bootstrap or Hyde, can be found in this folder.

### `./assets/themes/`, the CSS design, JavaScript or image of the Theme

# Steps of Installing Hyde into Existing Site

Comparing the `Hyde` project to your existing site will tell you which files you need 
to install. The steps below based on my previous site.

0. open a branch for Hyde,
0. put `hyde/public` into your `./assets/themes/hyde/`,
0. put `hyde/_layout` into your `./_includes/themes/hyde/`,
0. also put `hyde/_includes` into your `./_includes/themes/hyde/`,
0. see commit [235f6f6b3039](https://github.com/scotv/scotv.github.com/commit/235f6f6b303988a2208404ea071c9b2c05a97031?diff=split)
   for files including,
0. compare the existing theme folder with `hyde` to determine the changes on `hyde` layout, for me,
   I compared `./_includes/theme/bootstrap` with `./_includes/theme/hyde`,
0. do a code review of `./_includes/theme/hyde` based on your comparasion, make sure you merge the existing layout and 
   correct path into `Hyde` theme, see my commit
   [1b2f41a3](https://github.com/scotv/scotv.github.com/commit/1b2f41a34f3a81e7789a4dcaf4750163ef7fda28),
0. change the theme name in `_config.yml`, see my commit 
   [4743d50a](https://github.com/scotv/scotv.github.com/commit/4743d50aa0a04456005b1ced9c480880e342dd69),
0. customize your site, see 
   * git commit -m [change on footer](https://github.com/scotv/scotv.github.com/commit/b3c26850d164f77485e1c3cd041a61680cffc92c), 
   * git commit -m [enhanced related_posts](https://github.com/scotv/scotv.github.com/commit/4291fdc0dc42ad18d5fd72c1fbf2fd92d6a60fd9), 
   * git commit -m [tags and about](https://github.com/scotv/scotv.github.com/commit/89e9d8fdd22780d714f5fe12ae2180be0e5c1074).
0. test and release.

# Conclusions

For installing the theme of Jekyll:

* `git flow feature start theme_name`,
* copy CSS design into `assets` folder,
* copy layout design into `_inlucdes/themes`,
* change the configuration,
* compare code differences for issue solving,
* test and improving.


# Encore

I am not with rich experiences on CSS and Jekyll, even on ruby. I mostly
write `Scala` and `<React.js />`, so I will not spend much time on Jekyll
theme unless someday, I have to.

So, in my opinion, Jekyll is used for writing the posts with coding, not used to 
keep decorating with Themes, unless designing becomes my major.

So, is there anyone can help me on a little design requirement below?

* For the post page including a Table of Content, short as `[toc]`, 
* reader scroll down the page, when he or she cannot see the `[toc]`,
* I want to move the `[toc]` to the left sidebar automaticly,
* the mobile screen may need for another design,
* the main idea of this requirement is to select the section easily.

Thanks.