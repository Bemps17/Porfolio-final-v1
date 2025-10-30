---
title: "My K3s Pi Cluster Died After a Reboot: A Troubleshooting War Story"
date: "2025-10-30T17:11:36.000Z"
source: "Dev.to"
sourceUrl: "dev.to"
url: "https://dev.to/shankar_t/my-k3s-pi-cluster-died-after-a-reboot-a-troubleshooting-war-story-m93"
author: "Shankar"
category: "tech"
language: "en"
tags: ["kubernetes", "raspberrypi", "gitops", "flux", "tech", "english"]
image: "null"
summary: "The "Oh No" Moment I have a Raspberry Pi homelab running k3s, all managed perfectly with FluxCD and SOPS for secrets. It was stable for weeks. Then, I had to reboot my router. When it came back up, my"
metadata: "[object Object]"
---

# My K3s Pi Cluster Died After a Reboot: A Troubleshooting War Story

**Source:** [Dev.to](https://dev.to/shankar_t/my-k3s-pi-cluster-died-after-a-reboot-a-troubleshooting-war-story-m93)  
**Author:** Shankar  
**Published:** October 30th, 2025  

## Summary

The "Oh No" Moment I have a Raspberry Pi homelab running k3s, all managed perfectly with FluxCD and SOPS for secrets. It was stable for weeks. Then, I had to reboot my router. When it came back up, my

## Content

The "Oh No" Moment I have a Raspberry Pi homelab running k3s, all managed perfectly with FluxCD and SOPS for secrets. It was stable for weeks. Then, I had to reboot my router. When it came back up, my Pi was assigned a new IP address (it went from 192.168.1.9 to 192.168.1.10). Suddenly, my entire cluster was gone. Running kubectl get nodes from my laptop gave me the dreaded: The connection to the server 192.168.1.9:6443 was refused... Ah, I thought. "Easy fix." I updated my ~/.kube/config to poi

---

*This article was automatically imported from Dev.to on October 30th, 2025.*
