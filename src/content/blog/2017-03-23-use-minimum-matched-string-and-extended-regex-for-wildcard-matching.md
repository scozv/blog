---
title: "Design Test Cases Before Write Implementation If the Former Is Easier"
slug: simple-tdd-use-case
pubDatetime: 2017-03-31 15:50:50+08:00
modDatetime: 2024-01-01T06:14:26.358Z
description: ""
category: "algo"
tags: ["algorithm", "regex", "string", "pattern"]
lang: "en"
---

> If we want to map the domain according to the defined rules, and：
>
> - store the mapping rules in database, such as `*a.com`，
> - for input `s1.a.com`，it can be matched by this rule, while, `a.com` cannot.
>
> This article will introduce two implementations for this requirement, however,
> in specific case, implementation detail sometimes is not as important as the test cases.

## Requirement

We have four rules for pattern match：

```bash
a.*       -> 1
a-*       -> 2
*.a.com   -> 3
*.a.*     -> 4
```

The left side of arrow is the wildcard matching rule, while,
the right side is the return result when the input parameter matches
this rule.

For instance, the input parameters in the left side will get
the result value in right side:

```bash
z.a.com   -> 3
z.a.io    -> 4
```

## Implementations

We cannot use `substring` directly, since we have the wildcard in
the rules.

A plain solution is using the idea of `substring` after we extract
the main keyword in our parameters (such as `a` in the example above).

### `InternetDomainName` for Keyword in Domain

We can use `InternetDomainName` [^_guava_int_dn] to extract the root domain from the
parameters, then we can use the keyword (root domain) to build our matching rules
which include the wildcard.

The function extracting the root domain can be defined as below:

```javascript
function getRootDomain(domain) {
  // ...
}
```

### Rebuild the Matching Rules

Now we have:

- 4 matching rules,
- the keyword (root domain) from the input.

We can rebuild the matching rules containing the wildcard,
then do our comparison.

The demonstration code is listed below:

```javascript
function matchAndGetResult(domain) {
  var rootDomain = getRootDomain(domain);
  // rule 1
  if (db.find(`$rootDomain.*`)) return 1;
  if (db.find(`$rootDomain-*`)) return 2;
  if (db.find(`*.$rootDomain.com`)) return 3;
  if (db.find(`*.$rootDomain.*`)) return 4;
}
```

However, we may easily find the potential issue
in our implementation, just write some test cases, such as:

```javascript
matchAndGetResult('z.a.com') should equal to 3
```

The result value of this test is `1` actually.

So we fix the issue:

```javascript
function matchAndGetResult(domain) {
  var rootDomain = getRootDomain(domain);
  // rule 1
  if (db.find(`$rootDomain.*`) && domain.startWith(`$rootDomain.`)) return 1;
  // ...
}
```

We still have 2 cons in this implementation:

- some rules need the `startWith`, while, some need the `contains()`;
- the number of `if-else` will be increased with the number of matching rules.

### Regex

We consider the 2 cons as:

- how do we match the `begin` or `middle` position of string,
- how do we provide the generic solution to decrease the number of `if-return`?

Regex is an powerful tool to cover these 2 cons:

- Regex has `^` for `begin`,
- Regex is generic.

So we have an alternative solution as below：

```javascript
function matchAndGetResult(domain) {
  var rootDomain = getRootDomain(domain)

  if (var dbResult = db.find(`$rootDomain.*`)) {
    // build the regex
    var regex = dbResult
      .string
      .replace('*', '[\\S]*')
      .replace('.', '\\.')

    if (/^$regex/g).test(domain) {
      return dbResult.value
    }
  }
}
```

## Write Test Cases At First

These two solutions are not the best solutions.

In this scenario, writing the test cases should be
put as the first priority.

**Simple I/O for Test Cases**

We can write the test cases quickly after read this
requirement. The input and output can be easily figured out
even we don't have any solution.

**Private Function and Short Implementation**

Usually, this function should be private and the number of code lines is short.

**Different Ideas from Different Programmers**

There is no need to argue with different solutions.
Just make sure the solution can pass all the tests.

## Summary

"Put Tests at First" doesn't mean:

- Put the tests at first for all the time,
- No needs to follow the code style or conventions from team or community.

"Put Tests at First" just wants to express the idea that there are
more things important than the "Put the Solution at First":

- Make the implementation correctly,
- Figure out the solution quickly,
- Cover the cases for further refactor,
- etc.

## References

[^_guava_int_dn]: [Explanation of `InternetDomainName`](https://github.com/google/guava/wiki/InternetDomainNameExplained)
