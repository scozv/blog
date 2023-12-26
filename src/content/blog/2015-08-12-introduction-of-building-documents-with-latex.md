---
title: "Introduction of Building Documents with LaTeX"
postSlug: documenting-with-latex
pubDatetime: 2015-08-12 12:23:01+08:00
description: ""
category: "guide"
tags: ["latex", "tex", "project"]
lang: en
---

{% include JB/setup %}

# Abstract

{:.no_toc}

> This article will give brief introduction for `TeX` and `LaTeX`, then discuss a few issues during using `LaTeX`
> and how to display `LaTeX` equation on web page.
>
> This article is mainly written in Chinese.
>
> If you want to know the KaTeX with Jekyll,
> you can reach [this post](http://xuc.me/blog/KaTeX-and-Jekyll/).
> A `LaTeX` template will be provided.

<!--more-->

# KaTeX, not MathJax

The render speed of `MathJax` is too slow,
while the `KaTeX` from [Khan Acedemy](https://khan.github.io/KaTeX/) team,
will render all equation with pure `CSS`, and it will render your `LaTeX`
equation as fast as you can imagine.

$$e^x = \lim_{n\rightarrow \infty} \sum_{t=0}^{n} ( \frac{1}{t!}\cdot x^t )= \sum_{t=0}^{\infty} (1 + x + \frac{1}{2!}x^2+\frac{1}{3!}x^3+ ... + \frac{1}{t!}\cdot x^t)$$

If you want to know more details with KaTeX for Jekyll,
you can read [this post](http://xuc.me/blog/KaTeX-and-Jekyll/).

# A Sample of LaTeX Template

{% highlight tex %}
\documentclass[a4paper]{book}

% shortcut for scozv's github homepage
\usepackage{hyperref}
\newcommand{\scozv}{https://github.com/scozv}

% shortcut for \ding{213}
\newcommand{\To}{\ding{213}}

\usepackage{listings, color}
% shortcut for inline code snippet, like `code` in markdown
% \newcommand{\cd}[1]{\colorbox[rgb]{0.86,0.86,0.86}{\lstinline$#1$}}
\newcommand{\cd}[1]{\lstinline$#1$}

% shortcut for section, subsection, subsubsection
% mb stands for member
\newcommand{\mb}[1]{\subsection*{#1}}
\newcommand{\mmb}[1]{\subsubsection*{#1}}

% set style for multiple lines code snippet
\lstset{numbers=left, numberstyle=\tiny
, stepnumber=2, numbersep=5pt
, backgroundcolor=\color[rgb]{0.86,0.86,0.86}
, basicstyle=\footnotesize\ttfamily
, breaklines=true}

% set index
\usepackage{multind}
\makeindex{idx_finance}
\newcommand{\idxf}[1]{\index{idx_finance}{#1}}
% heading
\setcounter{secnumdepth}{3}

% set multi-ref
\usepackage{multibib}
\newcommand{\bibnamec}{References of Programming}
\newcites{c}{\bibnamec}
\newcommand{\bibnamef}{References of Finance}
\newcites{f}{\bibnamef}

% CJK for XeTeX
% http://www.ctan.org/pkg/xetexref
% https://zh.wikipedia.org/wiki/XeTeX
% http://ctan.org/pkg/xecjk
\usepackage{xltxtra, xeCJK}
\setCJKmainfont[BoldFont=Adobe Heiti Std]{Adobe Song Std}
\xeCJKsetup{AutoFakeBold=true, CJKmath=true}

% Latin
\usepackage{fontspec, pifont}
\setmainfont{Gentium Book Basic} %[ItalicFont=Gentium Book Basic Bold]

% intertext, trigleq and proof
\usepackage{amsmath, amssymb, amsthm}

% bold emphasized text
\makeatletter
\DeclareRobustCommand{\em}{\%
\@nomath\em \if b\expandafter\@car\f@series\@nil
\normalfont \else \bfseries \fi}
\makeatother

% tiny margin note
\makeatletter
\long\def\@ympar#1{\%
\@savemarbox\@marbox{\small #1}%
\global\setbox\@currbox\copy\@marbox
\@xympar}
\makeatother

% reduce the space of itemize
\newlength{\wideitemsep}%
\setlength{\wideitemsep}{.5\itemsep}%
\addtolength{\wideitemsep}{-7pt}%
\let\olditem\item
\renewcommand{\item}{\setlength{\itemsep}{\wideitemsep}\olditem}

\begin{document}
\title{Introduction of Building Documents with LaTeX}
\author{Scott}
\date{Aug, 12, 2015}
\maketitle

\chapter\*{\centering \begin{normalsize}Abstract\end{normalsize}}
\begin{quotation}
\noindent % abstract text
This artical will give brief introduction for TeX and LaTeX,
then discuss a few issues during using LaTeX
and how to display LaTeX eqation on web page.
Finally, a LaTeX template will be attached in Appendix.
\end{quotation}
\clearpage

% no indent of second ... paragraphs of each section
\setlength{\parindent}{0pt}
\setlength{\parskip}{1.3ex plus 0.5ex minus 0.3ex}
\part{Part I}
\chapter{C01-01}
\include{p1_c01}
\part{Part II}
\chapter{C02-01}
\include{p2_c01}
\chapter{C02-02}
\include{p2_c02}

\cleardoublepage
\phantomsection
\addcontentsline{toc}{chapter}{\bibnamec}
\bibliographystylec{GBT7714-2005NLang}
\bibliographyc{code/ref}

\makeatletter
% Put section depth at the same level as \chapter.
\renewcommand*{\toclevel@section}{0}
\printindex{idx_finance}{Index of Finance}
% Put section depth back to its default value.
\renewcommand*{\toclevel@section}{1}
\makeatother

\cleardoublepage
\phantomsection
\addcontentsline{toc}{chapter}{\bibnamef}
\bibliographystylef{GBT7714-2005NLang}
\bibliographyf{finance/ref}

\appendix
\part{Appendix}
\chapter{Appendix I}
\include{appendix}
\end{document}
{% endhighlight %}

# References

[^TUG01]: [Pointers to Frequently Asked and Answered Questions](https://tug.org/tex-ptr-faq). tug.org. [OL]
[^WIK01]: [`LaTeX`的趣味应用](https://zh.wikipedia.org/wiki/LaTeX#.E8.B6.A3.E5.91.B3.E6.87.89.E7.94.A8). wikipedia.org. [OL]

[1]: https://en.wikipedia.org/wiki/TeX "TeX Wikipage"
[2]: https://github.com/weijianwen/SJTUThesis "SJTU Thesis LaTeX Template"
[3]: http://web.mit.edu/thesis/tex/ "MIT Thesis LaTeX Template"
