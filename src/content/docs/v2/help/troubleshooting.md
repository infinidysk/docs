---
title: Troubleshooting
description: Report problems with infinidysk 2.x and fix common mount and upgrade issues.
---

## Reporting problems

Report beta problems on [Discord](https://discord.gg/DAya7W6QMa). Include:

- the image tag (or `sha-` tag) you run;
- the log, from `/config/logs/infinidysk.log` or the Logs page;
- for playback problems: start a trace on the Traces page, reproduce the problem, and attach the trace export (exports have secrets removed);
- for upgrade problems: the output of [`import-report`](/v2/getting-started/upgrade/#steps).

:::danger
Never post provider passwords or API keys. Release names are not needed; describe the file instead, for example "stored RAR5 episode".
:::

## The mount is empty or missing

- Check the log for a warning about `/dev/fuse`. Without it 2.x serves WebDAV only. Add the device, `SYS_ADMIN` and `apparmor:unconfined` as in the [compose file](/v2/getting-started/docker/#compose-file).
- The mount shows on the host and in other containers only when the parent directory is bound with `:rshared` here and `:rslave` in the readers.
- After a crash, readers see "Transport endpoint is not connected" until infinidysk starts again.

## 2.x started empty after the upgrade

2.x imports only when it finds a SQLite 1.x database at `/config/db.sqlite`. Without one (a wrong config bind, or 1.x on PostgreSQL, which the importer does not read yet) it starts as a new install. Run [`import-report`](/v2/getting-started/upgrade/#steps) against the same directory: it says `no C# database` in that case. Stop 2.x, fix the bind, and start again on a fresh copy of the 1.x config.

## Library symlinks do not resolve after the upgrade

The 2.x mount must sit at exactly the path rclone mounted. See [Move off rclone](/v2/getting-started/rclone/).

## Plex re-reads the whole library

Either the time zone changed (set `TZ` to the zone 1.x ran in), or the old rclone mount used `--no-modtime`. Turn on Settings > Mount > Disable file timestamps and restart before the next scan, or set `INFINIDYSK__MOUNT__EPOCH_TIMES: "true"`.

## Seeing who reads the mount

On the host, `sudo lsof +f -- <mount dir>` or `sudo fuser -vm <mount dir>` lists which processes hold files open right now.
