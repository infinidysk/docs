---
title: "Backups and upgrades"
---
## In-app backup and restore {#in-app-backup-restore}

**Settings → Backup & Restore** dumps the main and Warden databases as `db.sql` and
`warden.sql` under `{CONFIG_PATH}/backups/`. Contents, schedule, retention, and restore
steps are covered in [Backup settings](/v1/configuration/backup/).

:::caution[Blobs are not in the SQL dump]
Mounted content depends on `{CONFIG_PATH}/blobs/`. Back up that directory separately if you need a full restore of WebDAV content.
:::

## PostgreSQL main database

When `DATABASE_PROVIDER=postgres`, back up the main database with `pg_dump`; see
[PostgreSQL](/v1/operations/postgresql/).

## Before upgrading

Back up the whole `/config` volume, including `blobs/`, or at least create an in-app
backup and copy `blobs/`.

## Upgrades

```bash
docker compose pull
docker compose up -d
```

Database migrations apply automatically on startup. **Back up `/config` before upgrading across versions that include schema migrations.** Irreversible migrations appear under Breaking Changes in the changelog; routine additive migrations are noted in the release announcement instead.

Coming from an older release or another fork? See [Migration paths](/v1/getting-started/migration/).

Tags: `latest` (current stable), `lts` (trails `latest` by a few releases), `rc` (release candidate), and `dev` (unversioned tip snapshot), plus pinned version tags — see [Release channels and tags](/v1/getting-started/#release-channels-and-tags), [GitHub Releases](https://github.com/infinidysk/infinidysk/releases), and [Changelog](/v1/changelog/).

## Automatic container updates {#watchtower-arr-updates}

If a tool updates containers automatically, pin a known-good tag or keep the in-app backup schedule on before unsupervised upgrades.
