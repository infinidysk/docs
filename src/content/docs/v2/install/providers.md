---
title: Providers
description: Add Usenet providers in infinidysk 2.x from the catalog, and set priority levels and download caps.
---

## Add a provider

Pick your provider from the catalog under Settings > Platform > Providers. The profile fills in the hostname, port and **backbone**, so you only enter your username, password and connection count.

If your provider is not in the catalog, enter a custom hostname and port. A custom provider can pick a backbone from the catalog; without one it is a group of its own.

Each provider has:

| Field | Notes |
|-------|-------|
| Connections | The most connections your plan allows. |
| Pipeline depth | Requests in flight per connection, 1–16. Auto-Tune Pipeline sets it. |
| Priority | Lower numbers are asked first. See below. |
| Download cap | Optional, in GB. Monthly with a reset day, or a prepaid block that resets only by hand. |

## Backbones

Many providers resell the same article storage, called a backbone. Providers on the same backbone are missing the same articles, so asking a second one after a miss rarely helps. infinidysk treats providers that share a backbone as one group.

The backbone comes from the catalog and cannot be typed in by hand.

## Priority levels

Providers with the same priority number form one pool and share the load. The next level is asked only when every provider in the level before it missed an article. This is always on.

Drag providers between levels in the priority editor. A common setup:

- **Level 1:** your unlimited providers, on different backbones.
- **Level 2:** block accounts, used only for articles level 1 is missing.

## Download caps

When a provider uses up its cap, requests go to other providers until it resets. Health checks skip a provider at its cap first, so playback keeps its data.

## The catalog

The catalog is maintained by the community. To add or fix a provider, ask on [Discord](https://discord.gg/DAya7W6QMa).
