---
title: "Indexers"
---
Newznab indexers and aggregators, global request defaults, and title exclude patterns.

:::tip[Headless ENV]
Map config keys below to `NZBDAV_CONFIG__...` with the
[naming algorithm](/v1/configuration/headless/#naming-algorithm)
(`indexers.instances` → `NZBDAV_CONFIG__INDEXERS__INSTANCES`).
:::

## Global defaults

These are on the **Connection defaults** and **Result exclusions** cards.

| Setting | What it does |
|---|---|
| HTTP(S) Proxy URL<br/>in `indexers.instances` | Used when an indexer has no override. Default empty. |
| Default Search User-Agent<br/>`api.search-user-agent` | Sent on search and caps queries. Default empty, which uses `nzbdav/{ver}` or `NZB_SEARCH_USER_AGENT`. |
| Default Retrieve User-Agent<br/>`api.user-agent` | Sent when fetching `.nzb` files. Default empty, which uses `SABnzbd/5.1.0` or `NZB_GRAB_USER_AGENT`. |
| Request timeout (seconds)<br/>in `indexers.instances` | Per-request timeout. Default `30`. |
| Search results per indexer<br/>in `indexers.instances` | Page size. Default `100`. |
| Max indexer response (bytes) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.8">since 1.2.8</a><br/>in `indexers.instances` (`MaxResponseBytes`) | Reject oversized Newznab caps/search XML before parsing; counts HTTP-client bytes (no automatic decompression). Per-indexer override. Max `16777216` (about 16.8 MB). Default `4194304` (about 4.2 MB). |
| Exclude result patterns<br/>`search.exclude-patterns` | One JavaScript-style regex per line, case-insensitive. Default empty. |
| Synced exclude URLs<br/>`search.exclude-sync-urls` | Auto-updating JSON lists, one URL per line. Default empty. |
| Refresh every<br/>`search.exclude-sync-refresh-minutes` | Sync interval in minutes, 15–10080. Default `720`. |

Synced patterns take precedence; last-good cache survives temporary URL failures.

## Prowlarr pull sync <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.1.0">since 1.1.0</a> {#prowlarr-pull-sync}

infinidysk can pull its indexer list from one Prowlarr instance. Configure the connection in infinidysk under **Settings → Indexers → Prowlarr pull sync** — do **not** add infinidysk under Prowlarr's Apps list, and do not use infinidysk's SABnzbd-compatible settings for this integration.

| Setting | What it does |
|---|---|
| Prowlarr URL<br/>`prowlarr.url` | Default empty. |
| Prowlarr API key<br/>`prowlarr.api-key` | Default empty. |
| Automatically sync<br/>`prowlarr.sync-enabled` | Default off. |
| Sync every<br/>`prowlarr.sync-interval-minutes` | Interval in minutes, 5–10080. Default `60`. |

Use **Test Connection** to verify the URL and API key, save the settings, then use **Sync now**. The URL may include a Prowlarr URL base such as `http://prowlarr:9696/prowlarr`; credentials, query strings, and fragments are not accepted.

A Prowlarr hostname without a dot (for example the Docker service name `prowlarr`) is
contacted directly, bypassing any `HTTP_PROXY` / `HTTPS_PROXY` configured for the
container; dotted hostnames and IP addresses keep the normal proxy policy. Requests that
exceed the 15-second budget are reported as `... timed out after 15 seconds; routing: ...`
in Settings and logs. See [Docker hostnames and proxies](/v1/configuration/arrs/#docker-hostnames-and-proxies)
for details.

Sync imports searchable Usenet indexers and points each one at Prowlarr's per-indexer Newznab proxy (`{prowlarrUrl}/{indexerId}/api`). Prowlarr owns each managed entry's name, proxy URL, API key, and enabled state. infinidysk preserves local tuning such as rate limits, filters, category overrides, proxy, TLS, timeout, max response, and user agents. Manually configured indexers are never changed or removed.

Entries that disappear or become unsupported in Prowlarr are removed only when they are marked as Prowlarr-managed. Search profiles are updated in the same write for managed renames and removals. If Prowlarr is unavailable or returns an invalid response, infinidysk keeps the complete last-good indexer configuration and reports the failure in Settings.

:::caution[Headless ownership]
Pull sync writes imported indexers to SQLite, so `indexers.instances` must **not** be managed with `NZBDAV_CONFIG__INDEXERS__INSTANCES`. The Prowlarr connection settings themselves may be supplied by GUI or `NZBDAV_CONFIG__PROWLARR__...`. If `profiles.instances` is environment-managed, a Prowlarr rename or removal that requires profile-reference changes is rejected rather than leaving stale references.
:::

## Per-indexer

| Setting | What it does |
|---|---|
| Name / URL / API Key | Newznab endpoint. |
| Search User-Agent / Retrieve User-Agent | Optional overrides of the global defaults. |
| HTTP(S) Proxy URL | Optional override. |
| Request timeout (seconds) / Search result limit / Max indexer response (bytes) | Optional overrides. |
| Skip TLS certificate verification | Accept an invalid HTTPS certificate. Default off. |
| Max requests / minute | `0` = unlimited. |
| API hit limit / Download limit / Hit reset time | Cap usage. Reset time is a UTC hour (0–23); blank = rolling 24 hours. |
| Enabled | Include in searches. |
| Strict matching | Drop titles that don't match the request. |
| Extra movie categories / Extra TV categories | Appended to 2000/2070 or 5000/5070. |
| Ignore category filter | Omit `cat=`. |
| Result filtering | Skip password-protected releases, Minimum download count, Grace period for new releases, drop old zero-download releases, Rank by download count. |

## Invalid indexer certificates <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.9.0">since 0.9.0</a>

Leave **Skip TLS certificate verification** disabled unless a trusted HTTPS
indexer has a certificate it cannot correct. The setting keeps traffic encrypted
but accepts untrusted, expired, and hostname-mismatched certificates, exposing
API keys and NZB requests to man-in-the-middle attacks. It applies to the
indexer's API and its resolved NZB download URLs. SAB `addurl` requests inherit
the setting only when their initial URL exactly matches an enabled indexer's
configured host.

[Indexer search feature](/v1/features/indexer-search/)
