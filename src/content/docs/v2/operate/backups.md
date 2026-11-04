---
title: Backups and restore
description: Back up the 2.x SQLite database every night, download or upload a backup, and restore it with undo.
---

infinidysk backs up its SQLite database: settings, logins, providers, Arr instances, the queue, history and the library. Backups live under Settings > System > Maintenance, in the **Backups** panel below the jobs.

Backups cover SQLite only. On [PostgreSQL](/v2/operate/postgresql/) the panel is off; back up with `pg_dump` instead.

:::caution[Backups hold secrets]
A backup holds provider passwords, Arr API keys and the infinidysk API key. Keep downloaded backups as safe as the server itself.
:::

## Back up every night

The **Back up database** job writes a backup. Turn on **Run daily** to run it in the [maintenance window](/v2/operate/maintenance/#the-window), or press **Run now**. It is off by default.

Each run:

1. checks that the backup folder has room for the copy;
2. writes a consistent copy while infinidysk keeps running;
3. opens the copy and checks it;
4. saves a checksum next to it;
5. deletes the oldest backups beyond **Copies to keep**.

The panel shows how big each backup is, how much room **Copies to keep** needs and how much the folder has free.

When **Run daily** is on, Overview warns when the last backup did not finish or when there has been no backup for 3 days.

## Settings

| Setting | Default | What it does |
|---------|---------|--------------|
| Backup folder | `/config/backups` | Where backups go, next to the database by default. It must not be the database's own folder. Changing it does not move existing backups. |
| Copies to keep | 3 | How many backups the job keeps, from 1 to 100. Pinned, uploaded and added backups do not count. |

infinidysk creates the folder readable only by its own user (`PUID`), and each backup file the same way.

## The backup list

Each backup shows when it was made, its kind, size, number of items and its last check. Kinds:

| Kind | Made by |
|------|---------|
| Scheduled | The job in the maintenance window. |
| Manual | **Run now**. |
| Uploaded | **Upload backup**. |
| Added | A file you copied into the backup folder yourself. |

Each row has these actions:

- **Download** saves the file. Keep it somewhere safe; see the caution above.
- **Verify** compares the file with its saved checksum and checks it again.
- **Restore…** replaces the database with this backup. See [Restore a backup](#restore-a-backup).
- **Pin** keeps the backup out of **Copies to keep**, so the job never deletes it.
- **Edit note** adds a note of up to 500 characters.
- **Delete** removes the backup.

### Bring in a backup

To use a backup from another server or an older download, either:

- press **Upload backup** and pick the `.sqlite` file, or
- copy the file into the backup folder. Its name must end in `.sqlite` and use only letters, digits, spaces, dots, dashes and underscores.

A reverse proxy may limit upload size. Raise the limit or copy the file in instead.

A backup made by a newer infinidysk cannot be restored. Upgrade first.

## Restore a backup

Restore puts the database back to how it was when the backup was made. Choose **Restore…** on a backup and type `restore` to confirm.

infinidysk copies and checks the backup, then restarts into it. The page shows each step, waits for the restart and reloads when infinidysk is back.

After a restore:

- Settings, logins, downloads and history are as they were at the backup. Anything added since is gone.
- Imports that were queued at the backup start again.
- You sign in with the password you had then. Everyone is signed out when the backup has a different session secret.
- Run [Remove dead links](/v2/operate/maintenance/#remove-dead-links) to clean up library links to downloads added since the backup.

If the restored database does not open, infinidysk puts the previous one back and starts. The panel then says the restore was not applied, and why.

### Undo a restore

The database a restore replaced is kept as an undo copy, `infinidysk.sqlite.before-restore` next to the database. After a restore the panel shows:

- **Undo restore** puts that database back and restarts. Changes made since the restore are lost. The backup itself stays.
- **Delete undo copy** frees its space.

The next restore replaces the undo copy.

## Backups from 1.x

2.x cannot restore 1.x backups. When 1.x backup folders are still under `/config/backups`, the panel shows how many there are and how much space they use. **Delete 1.x backups** removes them; type `delete` to confirm.
