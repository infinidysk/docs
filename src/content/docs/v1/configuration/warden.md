---
title: "Warden"
---
Portable dead-release fingerprint list: filter search results, sync remote sources, optional GitHub backup.

:::note[Headless ENV scope]
Scalar Settings below (`warden.hide-dead`, `warden.quorum`, `warden.backbone-scope`) can use
[`NZBDAV_CONFIG__...`](/v1/configuration/headless/). Warden **sources**, GitHub backup state, and `warden.db`
remain a separate domain and are **not** driven by the ENV overlay.
:::

## Persisted settings

| Setting | What it does |
|---|---|
| Filter out anything on the list<br/>`warden.hide-dead` | Hide matching search hits (fallback if all match). Default on. |
| Agreement needed for shared lists<br/>`warden.quorum` | How many corroborate sources must agree (1–20). Default `2`. |
| Only filter when the provider matches<br/>`warden.backbone-scope` | Scope remote/imported fingerprints. Default on. |

## Operational UI

Sources (local, remote, imported): trust (`full`, `corroborate`, `observe`), **Enabled**,
import, export, bundle, clear and remove. **Refresh (h)** (1–720) applies to remote
sources only; the local list and imported sources have no refresh interval.

**Backup to GitHub:** **Repository**, **GitHub token** (fine-grained), **File path**,
**Branch**, **What to back up**, **Every (h)**, **Back up automatically on this schedule**,
and restore. Backups hold fingerprints only; keep backup repos private for personal
lists. Restore replaces the **local** list only.

:::caution
**Merge into my list** imports cannot be un-merged.
:::
