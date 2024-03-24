---
title: "How to Make Code of Tango.js Run in Node.js as in Browser"
slug: compile-tangojs-in-nodejs
pubDatetime: 2013-12-21 22:56:45+08:00
description: ""
category: "guide"
tags: ["ci", "unit", "grunt"]
lang: en
---

> I have planed to run unit test by reading file as the input for algorithm
> like graph algorithm for a few months (see [issue #18] [1]).
> However, it is not easy or effective to read local file from browser,
> even using `FileReader` in JavaScript.
> An alternative way is that we can read file using the file system of Node.js,
> where we write JavaScript code as in browser.
>
> So the top proiority is **making codes run appropriately in Node.js as they run in browser**,
> including the codes of unit tests. I am going to tell the details of this process today:
>
> - Making codes of algorithm work in Node.js, and
> - Making codes of unit tests work in Node.js, and
> - Introduce CI into my project.

## window and global

In browser, we have the global variable named `window` , `Array` is `window.Array`,
and `Math` is `window.Math`, etc. The **Tango.js** also plugs object into `window`:

```javascript
(function (sorting, undefined) {
  sorting.mergeSort = function () {};
})((window.Sorting = window.Sorting || {}));
```

So that we can sort an array in browser using the script below:

```javascript
Sorting.mergeSort(3, 1, 4, 1, 5, 9, 2, 6);
```

More than that, in Tango.js, I extend `Array` and `Math` directly:

```javascript
(function (array, undefined) {
  array.zip = function (a, b) {};
  array.prototype.clone = function () {};
})((window.Array = window.Array || {}));
```

It is not a good practice that we change the object in `window` directly.
But in my opinion, **the most important part in Tango.js is Algo(rithm), not js.**
So I just want to use a simple way, instead of introducing a global module
named like `Algo` which we have to write like this:

```javascript
Algo.Sorting.mergeSort();
Algo.Array.zip();
Algo.Array.clone();
```

Following this idea of simplification, I load the code of algorithm
into the global variable in Node.js named `global` (see [`./qunit/q.js`] [3

```javascript
window = global;

require("../src/t.js");
require("../src/x.array.js");
require("../src/sorting.js");
```

Look, we give the `global` an alias name at first,
so that we do not need to change any codes of algorithm.
Again, my idea of simplification is that:

> It is not a good practice that we change the object in `global` directly.
> But the most important part in Tango.js is Algo(rithm), not js.

By the way, I did try to exposure module using `module.exports`,
but I failed to figure out a way, in Node.js, to exposure ONLY one module
named `Sorting` from three files: sorting.js, sorting.mergeSort.js,
and sorting.quickSort.js as they are something like partial class.

## node-qunit

After loading objects of algorithm into `global`, we are going to find out
how to run previous codes of unit test in Node.js without modifying test scripts.

We use the project [`node-qunit`] [4], which allow us to run unit test like this:

```bash
$ cd algo-js
$ npm install node-qunit
$ node # or nodejs in ubuntu
> require('./qunit/q.js'); /*loading algorithm code into global*/
> var qunit = require('qunit');
> qunit.run({
>>>>> code: './qunit/q.js',
>>>>> tests: ['./qunit/q-sorting.js']},
>>>>> function (err, report) {
>>>>>   console.log(err ? err : report);
>>>>> });
```

## Grunt

Grunt, as it says, is a JavaScript task runner.
If you configure your project, you will run unit test using command
below which helps us use Continuous Integration:
`$ grunt test`.

We use [`grunt-node-qunit`] [6] plugin for grunt task,
which is Grunt task running [node-qunit] [4].

Here is the list of _How to_:

0. configure project's `package.json` file

   $ npm init

1. install `grunt-cli`

   $ npm i -g grunt-cli

2. add grunt dependencies into project (see [official docs] [5])
3. install `grunt`

   $ npm i grunt --save-dev

4. add `Gruntfile.js` to resister task

   ```javascript
   module.exports = function (grunt) {
      grunt.initConfig({task-name: {}});
      grunt.loadNpmTasks('grunt-node-qunit');
      grunt.registerTask('default', ['task-name']);
   };
   ```

5. add test script into `package.json`, which allow us to run `$ npm test`
6. run `$ grunt` to test the configuration
7. run `$ grunt --stack` to debug grunt task script
8. run `$ npm test` to test `package.json` configuration

A little attention we should pay on is we may face an error on ubuntu says:

```bash
/usr/bin/env: node: No such file or directory
```

See [here] [8] to fix it.

## Drone.io

The web [drone.io] [7] is an online CI service. There are other options of online CI.
Some advantages of drone.io are:

- CI for Github, Google Code and Bitbucket
- CI command is hosted in drone.io, instead of a file in our project folder

The CI command for Tango.js is:

```bash
npm -d install
npm install -g grunt-cli
npm test
```

## Next

I am going to fix [issue #18] [1].

<br />

[1]: https://github.com/scozv/algo-js/issues/18 "issue #18"
[2]: https://github.com/scozv/tango "Tango.js"
[3]: https://github.com/scozv/algo-js/blob/master/test/q.js "a file named q.js"
[4]: https://github.com/kof/node-qunit "node-qunit, Port of QUnit unit testing framework to nodejs"
[5]: http://gruntjs.com/getting-started#package.json "grunt configuration on package.json"
[6]: https://npmjs.org/package/grunt-node-qunit "Grunt task running node-qnuit"
[7]: https://drone.io/ "drone.io"
[8]: https://github.com/joyent/node/issues/3911 "issue #3911"
