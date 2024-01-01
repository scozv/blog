---
title: "Design a Cashier Microservice with Ping++ SDK"
slug: simple-cashier-app-with-3rd-sdk
pubDatetime: 2016-07-14 16:58:31+08:00
description: ""
category: "pattern"
tags: ["ping++", "microservice", "scala", "restful", "payment"]
lang: "en"
---

# Abstract

> Ping++ [^pingpp] provides a facade implementation for multiple payments.
> Usually, each application we create needs a corresponding Ping++ application.
>
> In this article, I try to design a cashier microservice where only one
> Ping++ application is needed.
>
> This article is mainly written in Chinese.

## Term

### Application

Application is an abstract word, it can be a tiny calculation executable, or
a huge system, such as personal finance management system.

Application has different representation, like a `.exe` file, a Website or an
App installed in smart devices.

In this article, the term **Application**:

- is a system with a complete workflow,
- has a `View` as the user interface,
- has a `Server` layer,
  ＊is independent from each other Application.

### View layer

I suggest to separate the `View` layer from the business server.

Here, the `View`:

- accepts the user's interaction,
- sometimes, it is also called Client side.

### RESTful Server layer

I suggest that all business servers are represented as `RESTful API`,
in this article, the terms below are all equivalent:

- Server side,
- RESTful Server
- Backend server.

### Ping++ Application

In Ping++ console page, developer can create one or more **Ping++ Application**.
Each Ping++ application has a unique `app_id`.

### Cashier

In this article, I try to design a cashier microservice where only one
Ping++ application is needed, but multiple applications can use this
cashier microservice.

## Design

### General Payment Process with Ping++ [^pingpp_charge]

```
+------------------------------------------+----------------+
|                                          |                |
|    STEP 1                                |   Client Side  |
|    put product into cart                 |                |
|                                          +----------------+
|    STEP 4                             STEP 7              | STEP 8
|                                       (Ping++ Client SDK) |         +--------+
|    use Order data                                         | finish  |        |
|    to apply Ping++ Charge data        use Charge data     | payment | AnyPay |
|                                       request a payment   | +-----> |        |
+-----------------------------------------------------------+         +--------+
  + ^                  + ^
  | |                  | |
  | | STEP 2 & 3       | | STEP 4                STEP 5
  | |                  | |                       (Ping++ Server SDK)
  | | apply an order   | | apply for Charge
  | |                  | |
  | | RESPONSE the     | | payload with          apply for Charge
  | | Order {_id, ...} | | previous Order data   from Ping++ Server
  | |                  | |                           +
  v +                  v +                           |
+-------------------------------------+              |     +--------+
|                                     | STEP 5       |     |        |
|                  STEP 6             | +------------+---> |        |
|                                     | <----------------+ |        |
|                  get Charge data    |                    |        |
|                  from Ping++ Server | <----------------+ | Ping++ |
+---------------+                     | STEP 9             | Server |
|               |  RESPONSE to View   | (Async)            |        |
| RESTful Sever |                     |                    |        |
|               |                     | Webhook            |        |
| Cashier       |                     | POST notification  |        |
|               |                     | to RESTful server  |        |
+---------------+---------------------+                    +--------+
```

### Decompressing One `RESTful Server` into Multiple Services

```
+------------------------+          +-----------------------+
|                        |          |                       |
|  RESTful Server        |          |  RESTful Server       |
|                        |          |                       |
|  Static data           |          |  Order system         |
+------------------------+          +-----------------------+
 +                                   +  ^
 |                                   |  | STEP 2 & 3
 | STEP 1                            |  |
 | put product into cart             |  | apply an order
 |                                   |  |
 |                                   |  | RESPONSE the
 v                                   v  + Order {_id, ...}
+------------------------------------------+----------------+
|                                          |                |
|                                          |   Client Side  |
|                                          |                |
|                                          +----------------+
|    STEP 4                             STEP 7              | STEP 8
|                                       (Ping++ Client SDK) |         +--------+
|    use Order data                                         | finish  |        |
|    to apply Ping++ Charge data        use Charge data     | payment | AnyPay |
|                                       request a payment   | +-----> |        |
+-----------------------------------------------------------+         +--------+
  +  STEP 4              ^
  |                      |
  |  apply for Charge    |
  |                      |             STEP 5
  |  payload with        |             (Ping++ Server SDK)
  |  previous Order data |
  v                      +             apply for Charge
                                       from Ping++ Server
+-------------------------------------+                    +--------+
|                                     | +----------------> |        |
|                  STEP 6             | <----------------+ |        |
|                                     |                    |        |
|                  get Charge data    |                    |        |
|                  from Ping++ Server | <----------------+ | Ping++ |
+---------------+                     | STEP 9             | Server |
|               |  RESPONSE to View   | (Async)            |        |
| RESTful Sever |                     |                    |        |
|               |                     | Webhook            |        |
| Cashier       |                     | POST notification  |        |
|               |                     | to RESTful server  |        |
+---------------+---------------------+                    +--------+
```

### Cashier Microservice Design

```
+------------------------+          +-----------------------+
|                        |          |                       |
|  RESTful Server        |          |  RESTful Server       |
|                        |          |                       |
|  Static data           |          |  Order system         |
+------------------------+          +-----------------------+
   +                                   +  ^
   |                                   |  | STEP 2 & 3
   | STEP 1                            |  |
   | put product into cart             |  | apply an order
   |                                   |  |
   |                                   |  | RESPONSE the
   v                                   v  + Order {_id, ...}
 +------------------------------------------+----------------+
 |                                          |                |
 |                                          |   Client Side  |
 |                                          |                |
 |                                          +----------------+
 |    STEP 4                             STEP 7              | STEP 8
 |                                       (Ping++ Client SDK) |         +--------+
 |    use Order data                                         | finish  |        |
 |    to apply Ping++ Charge data        use Charge data     | payment | AnyPay |
 |                                       request a payment   | +-----> |        |
 +-----------------------------------------------------------+         +--------+
  +  STEP 4              ^
  |                      |
  |  apply for Charge    |
  |                      |             STEP 5
  |  payload with        |             (Ping++ Server SDK)
  |  previous Order data |
  v                      +             apply for Charge
                                       from Ping++ Server
+-------------------------------------+                    +--------+
|                                     | +----------------> |        |
|                  STEP 6             | <----------------+ |        |
|                                     |                    |        |
|                  get Charge data    |                    |        |
|                  from Ping++ Server | <----------------+ | Ping++ |
+---------------+                     | STEP 9             | Server |
|               |  RESPONSE to View   | (Async)            |        |
| RESTful Sever |                     |                    |        |
|               |                     | Webhook            |        |
| Cashier       |                     | POST notification  |        |
|               |                     | to RESTful server  |        |
+---------------+---------------------+                    +--------+
+  ^                            +  ^
|  |  apply for Charge          |  |  apply for Charge
|  |                            |  |
|  |  payload with              |  |  payload with
|  |  GenericOrder data         |  |  GenericOrder data
|  |                            |  |
v  +                            v  +
+---------+     +---------+     +---------+
|         |     |         |     |         |
| App 1   |     | App 2   |     | App 3   |
|         |     |         |     |         |
+---------+     +---------+     +---------+
```

### RESTful API of Cashier Microservice

```scala
// STEP 4 apply for Charge data
POST /cashier/charge

payload: {
  order: Order { _id, ...}
}

// STEP 6
RESPONSE: {
  data: Ping++ Charge data
}

// STEP 9
POST /cashier/webhook

```

## References

[^pingpp]: https://www.pingxx.com
[^pingpp_charge]: https://www.pingxx.com/docs/overview/flow/charge
