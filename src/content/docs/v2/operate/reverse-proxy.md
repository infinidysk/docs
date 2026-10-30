---
title: Reverse proxy
description: Put infinidysk 2.x behind a reverse proxy, and set the public URL, trusted proxies and sign-in.
---

Containers on the same Docker network (Arrs, media servers) can keep using `http://infinidysk:3000` directly. A reverse proxy is for reaching infinidysk from elsewhere.

Proxy everything to port 3000: the UI, the SABnzbd API, WebDAV and playback links all share it. Serve infinidysk at the root of its own host name; a sub-path such as `/infinidysk` is not supported. A minimal Caddy example:

```
infinidysk.example.com {
    reverse_proxy infinidysk:3000
}
```

## Public URL

Set **Public URL** under Settings > System > Network to the address the proxy serves, for example `https://infinidysk.example.com`. infinidysk uses it in:

- the webhooks it registers in your Arrs. Without a public URL it uses the address the Arr already uses for the download client, and asks for one when Arrs use different addresses;
- the playback links in `.strm` files. The [STRM import strategy](/v2/install/import-strategy/) needs a public URL.

## Trusted proxies

infinidysk reads the client address from `X-Forwarded-For` only when the request comes from a trusted proxy. Local and private network ranges are trusted by default; set **Trusted proxies** under Settings > System > Network to narrow that.

The client address decides who [reads a file](/v2/operate/logs-traces/#who-is-reading) and whether a request counts as local for sign-in.

Send `X-Forwarded-Proto: https` from the proxy so the sign-in cookie is marked secure. Caddy sends both headers by default.

## Sign-in

Choose when the UI asks for a password under Settings > System > Access > Sign-in: always, except on the local network, or never. Use **Always** when infinidysk is reachable from the internet.

WebDAV has its own login; see [WebDAV](/v2/operate/webdav/).
