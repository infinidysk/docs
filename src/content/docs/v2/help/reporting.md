---
title: Reporting a bug
description: What to include when you report a problem with infinidysk 2.x.
---

Report alpha problems in the `#infinidysk-development` channel on [Discord](https://discord.gg/DAya7W6QMa). Include:

- the image tag you run, and for `edge` the matching `sha-` tag;
- a [support pack](/v2/operate/logs-traces/#support-pack) from the System page, or the log from `/config/logs/infinidysk.log`;
- for playback problems: a [read trace](/v2/operate/logs-traces/#read-traces) of the problem;
- for upgrade problems: the output of [`import-report`](/v2/upgrade/#steps).

:::danger
Never post provider passwords or API keys. Release names are not needed; describe the file instead, for example "stored RAR5 episode".
:::
