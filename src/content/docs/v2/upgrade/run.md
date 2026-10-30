---
title: Run the upgrade
description: Start infinidysk 2.x on a copy of your 1.x config, point your Arrs at it, and roll back if needed.
---

Do the steps in [Before you upgrade](/v2/upgrade/) first, and [Move off rclone](/v2/upgrade/rclone/) if 1.x used an rclone sidecar.

## Steps

1. Start 2.x with `./config-2.0:/config` and `TZ` set to the zone 1.x ran in (see the [compose file](/v2/install/docker/#compose-file)). The import runs on first start; the UI shows progress and the full report.
2. Sign in with your 1.x admin login.
3. If the container name or port changed, update the SABnzbd download client in each Arr. 1.x served on port 8080; 2.x uses 3000. The API key stays the same.
4. If 1.x used rclone, run the [checks after the first start](/v2/upgrade/rclone/#check-after-the-first-start).

## Do not run both

Do not run 1.x and 2.x at the same time. Both would use your provider connections.

## Roll back

Stop 2.x and start 1.x on the original `./config`. Anything imported or added while on 2.x is not carried back.

## What does not carry over

Settings for features 2.x does not have yet are listed in the import report; see [What's new in 2.x](/v2/whats-new/#feature-comparison). The rclone settings (RC notifications, cache flags) are dropped; the built-in mount does not need them.
