---
title: Logs and traces
description: Where infinidysk 2.x writes its logs, how to trace a read, what a support pack holds, and how to see who reads the mount.
---

## Logs

Every log event is written to `/config/logs/infinidysk.log`, so a crash keeps its lead-up. The file rotates at 10 MB and three old files are kept. Set `INFINIDYSK_LOG_DIR` to write them elsewhere.

The System page shows the newest 2,000 events, including the previous run after a restart.

`RUST_LOG` sets the log filter, `info` by default. `RUST_LOG=info,infinidysk_fuse=debug` logs every mount request with the operation, path, calling process, error and duration.

## Read traces

A read trace records every read of a file, for playback problems. On the System page, start a trace for 15, 30 or 60 minutes, then play the file through the mount or WebDAV. **Export for a bug report** downloads the trace.

The export keeps only the extension of each path, blanks item ids and replaces provider names. It keeps who read the file (the process or the WebDAV client).

## Support pack

**Download support pack** on the System page builds a file for a bug report. It holds recent log events, warnings and errors from the log files, your settings with secrets masked, system status, and optionally read traces.

Passwords, API keys, provider usernames, credentials in URLs and public IP addresses are removed. Paths, hostnames, release names and private addresses stay, so check it before you post it publicly.

## Who is reading

The Overview page and read traces show who opened each read.

- **WebDAV** shows the user agent and address. Behind a reverse proxy, add the proxy to [trusted proxies](/v2/operate/reverse-proxy/#trusted-proxies) so the real client is shown.
- **The mount** shows the process name, pid, user and group. The kernel reports readers as seen from the infinidysk container, so a reader on the host or in another container (Plex, for example) shows as `pid unavailable` with only its user. Sharing the mount with `:rshared` does not change this.

To see those process names, add `pid: host` to the service:

```yaml
services:
  infinidysk:
    pid: host
```

:::caution
`pid: host` lets the container see every process on the host. Only add it if you accept that.
:::

On the host, `sudo lsof +f -- <mount dir>` or `sudo fuser -vm <mount dir>` lists the processes that hold files open right now.
