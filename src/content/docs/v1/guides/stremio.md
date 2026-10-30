---
title: "Stremio via AIOStreams"
---
Stream Usenet on demand in Stremio using [AIOStreams](https://github.com/Viren070/AIOStreams). Upstream guide: [AIOStreams Usenet docs](https://docs.aiostreams.viren070.me/guides/usenet/).

There are two supported setups. Choose one. Do not combine them for the same indexers.

## Path A — infinidysk owns search (recommended) {#path-a-infinidysk-owns-search-recommended}

Use this when infinidysk should search your Newznab indexers and return playable streams. AIOStreams only filters, sorts, and formats those streams.

1. Configure Usenet providers and Newznab indexers in infinidysk.
2. Set a public base URL / reverse proxy so AIOStreams and the playback client can reach infinidysk over HTTPS.
3. Create a **Search Profile**, choose indexers, enable **Addon**, and configure query fallback if you want it.
4. Copy the Addon **manifest URL**. Treat the full URL as a secret: it contains the profile token.
5. In the AIOStreams Marketplace, add the dedicated **infinidysk** preset and paste the manifest URL. No infinidysk service credentials are required.
6. Do **not** also add the infinidysk/NzbDAV service, and do **not** duplicate those indexers as AIOStreams Newznab addons.
7. Save and install the combined AIOStreams addon in Stremio.

If infinidysk is mounted under a path such as `/nzbdav`, the copied manifest URL already includes that prefix.

Give AIOStreams enough timeout for indexer search. Play links expire; search again after the Watchdog search-link lifetime. The first play of a new release may take time because `notWebReady` is intentional: infinidysk resolves and queues the NZB before redirecting to `/view`. Ready and verified markers are best-effort and do not guarantee the provider still has the articles.

AIOStreams proxying is optional on this path. Direct play URLs work when the player can reach infinidysk.

## Path B — AIOStreams owns search {#path-b-aiostreams-owns-search}

Use this when AIOStreams should search Newznab addons itself and hand NZBs to infinidysk only for playback.

In AIOStreams → **Services** → **infinidysk**:

| Setting | Value |
|---------|-------|
| URL | `http://nzbdav:3000` on the same Docker network, or your HTTPS URL |
| Public URL | Leave blank when using the AIOStreams proxy; otherwise HTTPS reachable by players |
| API Key | infinidysk **Settings → SABnzbd** |
| WebDAV Username / Password | **Settings → WebDAV** |
| AIOStreams Auth Token | Recommended `username:password` from `AIOSTREAMS_AUTH` |

Providing the auth token lets AIOStreams proxy streams — keeps infinidysk private and avoids protocol mismatches.

Then in **Addons → Marketplace → Usenet → Newznab**, add each indexer (URL, API key). Search mode **Both** when your API budget allows.

**Save & Install** in AIOStreams, then install the addon in Stremio.

## Repairs without Arr <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.5">since 1.2.5</a>

**Background Repairs** is on by default <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>: health checks and limited damage tolerance run without a Library Directory or Arr app. PAR2 gap repair is off by default and runs only when you enable it. A Library Directory and Arr app are only needed to
replace linked library items. To auto-remove a broken unlinked item after repeated playback failures,
set **Repair After Streaming Failures** above `0`; the default (`0`) keeps the item and marks it
**Action needed**. Turn Background Repairs off if you do not want background health checks or damage-tolerance handling. See [Repairs settings](/v1/configuration/repairs/).

## Security and reachability

- The profile token in the Path A manifest URL is a capability credential. Do not paste it into public chats or commit it.
- Players and AIOStreams must be able to reach the public infinidysk URL, including any URL-base prefix.
- HTTPS and a reverse proxy in front of the container are the usual production setup.

## Related

[Search profiles](/v1/configuration/profiles/) · [Indexer search](/v1/features/indexer-search/) · [Streaming-only use case](/v1/use-cases/streaming-only/) · [Watchtower](/v1/features/watchtower/)
