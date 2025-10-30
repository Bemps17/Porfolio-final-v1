---
title: "I built a zero-dependency workflow engine"
date: "2025-10-27T11:18:36.000Z"
source: "Reddit r/javascript"
sourceUrl: "reddit.com"
url: "https://reddit.com/r/javascript/comments/1ohbonv/i_built_a_zerodependency_workflow_engine/"
author: "goguspa"
category: "dev"
language: "en"
tags: ["javascript", "reddit"]
image: "null"
summary: "I'm excited to share a project I created to solve a problem of orchestrating long-running, multi-step asynchronous processes. Flowcraft is a lightweight, dependency-free workflow engine that lets you "
metadata: "[object Object]"
---

# I built a zero-dependency workflow engine

**Source:** [Reddit r/javascript](https://reddit.com/r/javascript/comments/1ohbonv/i_built_a_zerodependency_workflow_engine/)  
**Author:** goguspa  
**Published:** October 27th, 2025  

## Summary

I'm excited to share a project I created to solve a problem of orchestrating long-running, multi-step asynchronous processes. Flowcraft is a lightweight, dependency-free workflow engine that lets you 

## Content

I'm excited to share a project I created to solve a problem of orchestrating long-running, multi-step asynchronous processes. Flowcraft is a lightweight, dependency-free workflow engine that lets you define your logic as a graph (a DAG) and handles the execution, state management, and error handling. Here are some of the key ideas: * **Powers Visual UIs:** Because workflows are just JSON data, you can easily build a visual editor on the frontend. It ships with a `.toGraphRepresentation()` utility to generate a clean data structure, which you can feed directly into libraries like **xyflow** to create your own "Zapier-like" UI. * **Pluggable and Unopinionated:** The core is just a simple engine. Don't like the default JSON serializer? Plug in your own. Need to wrap every step in a DB transaction? Write a middleware. Want to use a specific expression engine for conditional logic? Implement the `IEvaluator` interface. It’s designed to be a flexible part of your existing stack. * **Seamless Scaling with Adapters:** This is the feature I'm most proud of. You can write your workflow logic once and run it in a single Node.js process. If you ever need to scale out, you can add a distributed adapter for systems like **BullMQ (Redis), Kafka, or RabbitMQ**, and your workflow will run across a fleet of workers. Your business logic doesn't have to change at all. * **First-Class Testing Tools:** It ships with a testing package that includes an `InMemoryEventLogger` (a "flight recorder" for your workflows) and a `createStepper` function. The stepper lets you execute your graph one step at a time, making it incredibly easy to debug complex flows or write fine-grained integration tests. It's MIT licensed and I'd love for the JS community to take a look and give me your thoughts. * **Docs &amp; Live Demos:** [`flowcraft.js.org`](http://flowcraft.js.org) * **GitHub:** [`github.com/gorango/flowcraft`](http://github.com/gorango/flowcraft)

---

*This article was automatically imported from Reddit r/javascript on October 30th, 2025.*
