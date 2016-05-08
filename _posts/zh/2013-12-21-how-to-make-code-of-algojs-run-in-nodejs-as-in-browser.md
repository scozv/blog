---
layout: post
title: "将网页版的QUnit.js测试移植到Node.js"
description: ""
category: "guide"
tags: ["CI", "unit", "grunt"]
lang: zh
---
{% include JB/setup %}

>  本文描述了我让代码在浏览器和Node.js两边都能运行的过程，略属娱乐。
> 因为就项目 [Algo.js] [2] 而言，我认为，重点在算法（ *Algo*rithm ）。
> 至于引入大文本输入测试（参见 [issue #18] [1] ），是为了保证算法的正确和高效，以及今后的重构，
> 当然这也很重要。引入持续集成，是尽可能想让一切都是自动化。
>
> 对于已经完成了成套测试的网页版QUnit.js环境，要想移至到Node.js上运行，
> 并且重构的代码要尽可能的少，测试代码最好不要有任何变化。
>
> 需要注意，全局变量在浏览器和Node.js的环境下的名称不一样，完整的迁移
> 方法请参考英文版本。
>
> （2016年更新）让我们使用Webpack吧。

<!--more-->

<a name="pi">
</a>

浏览器下，全局变量叫  `window`，大量的代码可能使用了这个变量:

    (function (sorting, undefined) {
        sorting.mergeSort = function () {};
    })(window.Sorting = window.Sorting || {})

Node.js下面，全局变量叫`global` ，我们可以赋值（参考 [`./qunit/q.js`] [3]）：

    window = global;

    require('../src/t.js')
    require('../src/x.array.js');
    require('../src/sorting.js');

更多内容，请参考英文版本。

[1]: https://github.com/scotv/algo-js/issues/18 "issue #18"
[2]: https://github.com/scotv/algo-js "Algo.js"
[3]: https://github.com/scotv/algo-js/blob/master/qunit/q.js "a file named q.js"
[4]: https://github.com/kof/node-qunit "node-qunit, Port of QUnit unit testing framework to nodejs"
[5]: http://gruntjs.com/getting-started#package.json "grunt configuration on package.json"
[6]: https://npmjs.org/package/grunt-node-qunit "Grunt task running node-qnuit"
[7]: https://drone.io/ "drone.io"
[8]: https://github.com/joyent/node/issues/3911 "issue #3911"
