---
layout: post
title: "Building Web with kriasoft/react starter kit"
description: ""
category: ""
tags: []
---
{% include JB/setup %}


# Start with the feature/redux branch

<% highlight %>
introduce riasoft/react-starter-kit at 02393af

commit 02393af0ee47efe3a4a854a8d93aec2571f3f217
Merge: 9ecbcbc 8fcb0fa
Author: Konstantin Tarkus <hello@tarkus.me>
Date:   Thu May 19 15:17:22 2016 +0300
Branch: feature/redux
Uri: https://github.com/kriasoft/react-starter-kit/commit/02393af0ee47efe3a4a854a8d93aec2571f3f217
<% endhighlight %>

install nym
npm install -g node-gyp npm-check-updates
ncu -u
-- keep graphql as v0.5.0

# Write the .gitlab-ci.yml

# Debug in WebStorm

MUST use node 5
MUST use WebStorm 2016.1
MUST read http://richb-hanover.com/debugging-webpack-apps-with-webstorm-2016-1/
SET `--expose_debug_as=v8debug` from https://github.com/nodejs/node/issues/7102


https://github.com/nodejs/node/issues/7102
https://blog.jetbrains.com/webstorm/2015/09/debugging-webpack-applications-in-webstorm/

# Read docs
https://github.com/kriasoft/react-starter-kit/tree/feature/redux/docs

# Write our mui 0.15.0 component

MUST read http://www.material-ui.com/#/get-started/usage

# GraphQL and mock

MUST pass into the valid query string in `fetch()`
SHOULD read http://graphql.org/blog/mocking-with-graphql/
