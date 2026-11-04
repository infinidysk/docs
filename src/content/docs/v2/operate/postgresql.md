---
title: Move to PostgreSQL
description: Copy the infinidysk 2.x database from SQLite to PostgreSQL from the settings page, switch over, and go back if you need to.
---

infinidysk starts on SQLite, in `/config/infinidysk.sqlite`. You can move it to a PostgreSQL server from Settings > System > Database. infinidysk copies everything while it keeps running, keeps the copy in sync, and switches when you choose.

:::caution
Back up `/config` before you switch.
:::

## What moves

The library, queue, history and settings move to PostgreSQL. These stay in `/config`:

- the metrics store, `/config/metrics.sqlite`;
- the logs, `/config/logs/`;
- the old SQLite file, kept as `/config/infinidysk.sqlite.pre-postgres`;
- the PostgreSQL URL, in `/config/database.toml`.

`database.toml` holds the database password. infinidysk writes it readable by its own user only. Back it up with the rest of `/config`.

## Prepare the database

Use a new, empty database for infinidysk. The user in the URL must be able to create tables in it.

Create it with the `C` collation, so folders sort the same way as on SQLite and path searches can use indexes:

```sql
CREATE DATABASE infinidysk TEMPLATE template0 LC_COLLATE 'C' LC_CTYPE 'C';
```

With the official `postgres` image, a new data directory gets the `C` locale from `POSTGRES_INITDB_ARGS`:

```yaml
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_DB: infinidysk
      POSTGRES_PASSWORD: change-me
      POSTGRES_INITDB_ARGS: --locale=C
    volumes:
      - ./postgres:/var/lib/postgresql/data
```

## Move

1. Open Settings > System > Database.
2. Enter the URL: `postgres://user:password@host:5432/database`.
   - Percent-encode special characters in the password (`@` is `%40`, `/` is `%2F`).
   - Add `?sslmode=require` for a server on another machine.
3. Select **Test connection**. It shows the server version and changes nothing.
   - **Use a new, empty database for infinidysk** means the database has tables or data already. Pick another one.
   - A collation warning means the database was not created with `C`. The move still works; folder order and some searches differ from SQLite.
4. Select **Copy to PostgreSQL**. A progress bar shows the copy. infinidysk keeps running on SQLite the whole time.
5. When the copy finishes, the page shows **In sync**. infinidysk copies new changes every few seconds. You can stay in this state as long as you like.
6. Select **Switch to PostgreSQL**. infinidysk restarts, copies the last changes, checks the copy, and starts on PostgreSQL. Playback, WebDAV and imports pause until it is back. The page shows each step and reloads when it is done.

After the switch, the page shows **PostgreSQL** and the database it uses (`user@host:port/database`; never the password).

### Cancel

**Cancel** stops the move before the switch. infinidysk empties the PostgreSQL database again and keeps running on SQLite. If it cannot reach the server to empty it, a notice says so; empty the database yourself before you use it again.

### When something goes wrong

- **The server is unreachable during the copy or sync.** The page shows the problem and infinidysk tries again every 30 seconds. It keeps running on SQLite.
- **infinidysk is upgraded during the sync.** If the new version changes the database layout, it copies everything again before it shows **In sync**.
- **The switch fails** (the copy does not match, or the server stops answering). infinidysk starts on SQLite as before, shows the reason on the page, and copies again. Nothing is lost. Switch again when the page shows **In sync**.

## Go back to SQLite

1. Stop the container.
2. In `/config`, rename `infinidysk.sqlite.pre-postgres` to `infinidysk.sqlite`.
3. Delete `/config/database.toml`.
4. Start the container.

infinidysk starts on SQLite with the data from the moment of the switch. Changes made on PostgreSQL after the switch stay in PostgreSQL only.

To move again later, use a new, empty database, or empty the old one first.

## Use `INFINIDYSK_DATABASE_URL` instead

`INFINIDYSK_DATABASE_URL` always wins over `database.toml`. When it is set, Settings > System > Database shows **Set by `INFINIDYSK_DATABASE_URL`** and offers no move; you manage the database yourself. Remove the variable to manage it from the page.

A `postgres://…` URL in the variable starts infinidysk on that database. It does not copy your SQLite data; an empty database starts as a new install.
