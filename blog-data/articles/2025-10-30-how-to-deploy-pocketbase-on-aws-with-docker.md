---
title: "How to deploy PocketBase on AWS with Docker"
date: "2025-10-30T16:42:29.000Z"
source: "Dev.to"
sourceUrl: "dev.to"
url: "https://dev.to/fabienmartin/how-to-deploy-pocketbase-on-aws-with-docker-1o6g"
author: "Fabien"
category: "tech"
language: "en"
tags: ["pocketbase", "aws", "backend", "tech", "english"]
image: "https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F574djc20l9ovdyqpzyta.gif"
summary: "First, I’m a huge PocketBase fan! I use it for many projects (e.g., smartgoutcare) and to prototype fast. This guide shows how to deploy PocketBase 0.31 on AWS EC2 using Docker, complete with persiste"
metadata: "[object Object]"
---

# How to deploy PocketBase on AWS with Docker

**Source:** [Dev.to](https://dev.to/fabienmartin/how-to-deploy-pocketbase-on-aws-with-docker-1o6g)  
**Author:** Fabien  
**Published:** October 30th, 2025  

## Summary

First, I’m a huge PocketBase fan! I use it for many projects (e.g., smartgoutcare) and to prototype fast. This guide shows how to deploy PocketBase 0.31 on AWS EC2 using Docker, complete with persiste

## Content

First, I’m a huge PocketBase fan! I use it for many projects (e.g., smartgoutcare) and to prototype fast. This guide shows how to deploy PocketBase 0.31 on AWS EC2 using Docker, complete with persistence and auto-restart. This tutorial is up-to-date for PocketBase v0.31 and tested on Ubuntu 24.04 LTS. Time: ~10–15 min. Cost: ~$0–$5/mo (t2.micro). Create EC2 & assign Elastic IP SSH in & install Docker Run PocketBase container (volume + restart policy) This post is the first in a four-part series 

---

*This article was automatically imported from Dev.to on October 30th, 2025.*
