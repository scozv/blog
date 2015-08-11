---
layout: post
title: "Introduction of Building Documents with LaTeX"
description: ""
category: "help"
tags: ["latex"]
---
{% include JB/setup %}

<!--2015-08-10-introduction-of-building-documents-with-latex-->

# 摘要
{:.no_toc}

> This artical will give brief introduction for `LaTeX` and discuss many issues during using `LaTeX`.
> and finally, this artical will list how to use `LaTeX` on web.

<!--more-->

<a name="pi">
</a>

# `TeX`家族简介
`TeX`可以视为出版行业的专业排版系统，由[Donald Knuth](http://www-cs-faculty.stanford.edu/~knuth/)于1978年发布，
当前的稳定版本编号为[$$3.14159265$$] [1]。

`TeX`是脚本化的排版系统，所有的排版格式都是用`TeX`语法描述的。比如使用`\begin{tabular} \end{tabular}`来绘制表格。
`TeX`接收一系列的语法命令和文本内容，经过`TeX`系统编译（macro compiler）之后，输出到显示屏、`DVI`或者`PDF`文档。
对于同样的一份`TeX`脚本，在任意的环境下编译后的输出文档：格式、字体、间距等都应该是一样的。

在`TeX`的基础上，可以定义一系列的宏包（macro），可以更方便地描述排版样式。比如上述的表格语法，其实来自`LaTeX`宏包，
如果要使用纯`TeX`（plain `TeX`）来绘制表格，则要使用更多的排版命令
（参考这两个网页文献 [1](http://www.volkerschatz.com/tex/halign.html)、 
[2](http://tex.stackexchange.com/questions/183235/vertically-aligned-table-in-plaintex-latex-context-etc) ）。
`LaTeX`是非常流行的宏包，除此之外还有`AMS-TeX`、`XeTeX`等[^TUG01]。


## 为什么使用`TeX`家族排版
和Office这类所见所得的文档处理器不同的是，`TeX`系列使用大量的命令来描述排版格式。
此外，所见即得的Office和所见非得的`TeX`相比：

* 使用`TeX`，不需要考虑软件的版权费用问题，它是免费的。
* 使用`TeX`，不需要担心跨软件、跨平台的格式兼容问题。
  不同的Office软件在排版格式上并不完全兼容，即使同一个软件公司的不同Office版本，
  格式也不完全兼容。但同样的一份`TeX`文档，经过不同的环境编译之后，输出的排版都是完全一样的。
* 使用`LaTeX`，精力可以放在撰写文档的内容，而非花大量的时间，用鼠标选中不同的文本段落，调整大量的排版样式。
* `TeX`更多用于学术领域，很多出版社、大学会提供指定的学术论文模板，
  比如[MIT thesis templates](http://web.mit.edu/thesis/tex/)或者非官方的[上海交通大学学位论文模板] [2]。使用这些
  模板，基本上不用考虑排版格式的问题，只要专心写文章就好了。
* 很多专业的学术语言——复杂的数学公式，化学分子式，五线谱，电路图——是没法仅仅使用Office就能编写的。`TeX`可以[^WIK01]。
* `TeX`文档是一个普通的文本文档，这意味着，可以进行源代码的版本管理。

类似的所见非得系统还有[`Markdown`](http://daringfireball.net/projects/markdown/)，`Markdown`更常用于网页展示：

* `Markdown`语法定义了不同的`HTML`节点；
* 不同的`Markdown`处理系统（在线编译网站，或者软件）定义不同的`CSS`样式；
* 使得同样的`Markdown`文档，最终的展示并不一样。以`online markdown`为关键字搜索，
  可以找到不同的在线`Markdown`编辑网站，它们对同一份文档的渲染结果是不同的。

## `TeX`、`LaTeX`的区别
正如前面说的那样：

* `TeX`是一个排版系统的基础；
* `LaTeX`在`TeX`基础上，定义了很多便捷的样式模板；
* `XeLaTeX`增加了对`CJK`的更好支持。

`TeX`更像一个排版系统，参考[tex.stack问答](http://stackoverflow.com/a/7014579)：

> Learn TeX only if you would like to become a typesetter

`LaTeX`能够更快地编写文档，但是没法体会到`TeX`的很多特性，
参考[tug.org上的文档](http://www.tug.org/pipermail/texhax/2009-October/013645.html)。

[知乎问答](http://www.zhihu.com/question/20638337)上，也给出了一个分类列表——`TeX`之于`LaTeX`，就像“引擎”之于“格式”。
[知乎另一份问答](http://www.zhihu.com/question/25033797/answer/29962700)里提到，`TeX`和`LaTeX`的选择，需要一定的权衡：

> 用LaTeX的时候，还真有你想要某些功能而没有的情况。怎么办？两种办法：花钱找高人帮着写；自己写。
>
> ...
> 
> 首先需要熟悉LaTeX的内部命令（大部分是含有@字符的命令），有时候这还不够，
> 万一碰到\expandafter，\futurelet，\ifvoid等等还得碰底层的primitive（基本命令）。
> 这个时候，还真就没plain TeX用着舒服。不过舒服也是有代价的，
> 因为plain TeX很短，能很快看完，但是前提是能够顺利地把TeXbook看完。

# `LaTeX`环境配置过程及问题

#### LaTeX Font Warning: Font shape undefined
如果一个字体集，少了粗体定义，则会出现这样的提示。解决方案是，
手动指定文档中粗体对应的字体：
```TeX
 % CJK for XeTeX
 % http://www.ctan.org/pkg/xetexref
 % https://zh.wikipedia.org/wiki/XeTeX
-\usepackage{xltxtra}
-\setmainfont[Mapping=tex-text]{WenQuanYi Micro Hei}
+% http://mirror.bjtu.edu.cn/CTAN/macros/xetex/latex/xecjk/xeCJK.pdf
+\usepackage{xltxtra, xeCJK}
+\setCJKmainfont[Mapping=tex-text]{WenQuanYi Micro Hei}
+\xeCJKsetup{AutoFakeBold=true, LoadFandol=false}
 
 \begin{document}
 \maketitle
```

#### latex error: file `multind.sty' not found
Windows 下的`MiKTeX 2.9`不会出现这样的问题， `Lubuntu 14.04`下的`TeX Live`出现过这样的问题。
tex.ac.uk下的[一份文档](http://www.tex.ac.uk/cgi-bin/texfaq2html-beta?label=multind) 指出：

> makeidx.sty (is) Part of the LaTeX distribution

所以[该文档](http://bioinforma.weebly.com/random-troubleshooting.html#/)尝试安装`texlive-full`来解决问题:

```bash
sudo apt-get install texlive-full
sudo texhash
sudo texconfig
```

如果想要尝试手动安装`multind.sty`，可以按照如下步骤：

* 下载[multind.sty](http://ctan.org/pkg/multind)
* 参考[Wikibook/LaTeX](http://en.wikibooks.org/wiki/LaTeX/Installing_Extra_Packages#Installing_a_package)安装sty文件
* `mkdir /usr/share/texmf/tex/latex/multind`
* `sudo texhash`

#### `makeindex finance`不会生成Multi Index页面
`finance`是一个文件名，而非命令。对比如下两个命令：

```bash
scott@c9 [~/repo/notes] (master *) 
$ makeindex finance
This is makeindex, version 2.15 [TeX Live 2013] (kpathsea + Thai support).
Scanning input file finance...done (0 entries accepted, 0 rejected).
Nothing written in finance.ind.
Transcript written in finance.ilg.

scott@c9 [~/repo/notes] (master *) 
$ makeindex finance.idx
This is makeindex, version 2.15 [TeX Live 2013] (kpathsea + Thai support).
Scanning input file finance.idx....done (22 entries accepted, 0 rejected).
Sorting entries....done (106 comparisons).
Generating output file finance.ind....done (59 lines written, 0 warnings).
Output written in finance.ind.
Transcript written in finance.ilg.
```

#### xeCJK error: "key-unknown"
可能会在`Lubuntu 14.04`下遇到这样的问题：
```bash
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!
! xeCJK error: "key-unknown"
! 
! Sorry, but xeCJK/options does not have a key called `LoadFandol'.
! 
! The key `LoadFandol' is being ignored.
! 
! See the xeCJK documentation for further information.
! 
! Type <return> to continue.
!...............................................  
                                                  
l.37 ...setup{AutoFakeBold=true, LoadFandol=false}
```
解决方案是，更换字体配置：
```tex
 \usepackage{xltxtra, xeCJK}
-\setCJKmainfont[Mapping=tex-text]{WenQuanYi Micro Hei}
+\setCJKmainfont[BoldFont=Adobe Heiti Std]{Adobe Song Std}
 \xeCJKsetup{AutoFakeBold=true, CJKmath=true}
 
+% Latin
+\usepackage{fontspec, pifont}
+\setmainfont{Gentium Book Basic}
+
 \begin{document}
```

<!--issue #8-->


# 样例模板参考
## `LaTeX`的格式样例
## 学术论文格式样例
## 编译命令

# `LaTeX`在Web页面的使用
## 使用`KaTeX`代替`MathJax`
## `gh-pagh`中的集成
## `gitbook`中的集成

# 参考文献
[^TUG01] [Pointers to Frequently Asked and Answered Questions](https://tug.org/tex-ptr-faq). tug.org. [OL]
[^WIK01] [`LaTeX`的趣味应用](https://zh.wikipedia.org/wiki/LaTeX#.E8.B6.A3.E5.91.B3.E6.87.89.E7.94.A8). wikipedia.org. [OL]

[1]: https://en.wikipedia.org/wiki/TeX "TeX Wikipage"
[2]: https://github.com/weijianwen/SJTUThesis "SJTU Thesis LaTeX Template"