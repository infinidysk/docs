---
title: Upgrade from 1.x on PostgreSQL
description: How the upgrade imports a 1.x install that kept its data in PostgreSQL, what it needs, and how to move 2.x to PostgreSQL afterwards.
---

If 1.x ran with `DATABASE_PROVIDER=postgres`, 2.x can import it. The import reads the 1.x PostgreSQL database and brings everything into a **SQLite** database in `/config`. After the upgrade you can [move 2.x to PostgreSQL](#move-to-postgresql-afterwards) from the settings page.

Do the steps in [Before you upgrade](/v2/upgrade/) first. This page covers what is different for PostgreSQL.

## How it works

1. On first start, 2.x connects to the 1.x database with the same settings 1.x used.
2. It copies the 1.x tables to a temporary file, `/config/v1-postgres-import.sqlite`, in one read-only snapshot. The UI shows **Copying 1.x PostgreSQL data** and the rows copied.
3. It imports from that copy, as for a 1.x install on SQLite.
4. It deletes the copy. 2.x now runs on SQLite, in `/config/infinidysk.sqlite`.

The import only reads the 1.x database. It never writes to it, so 1.x can still use it to [roll back](/v2/upgrade/run/#roll-back).

## What you need

- **The same variables as 1.x.** Give the 2.x container the `DATABASE_PROVIDER` and `DATABASE_CONNECTION_STRING` 1.x used. The connection string stays in the Npgsql format 1.x read (`Host=…;Port=…;Database=…;Username=…;Password=…`); do not change it to a `postgres://` URL.
- **A route to the 1.x database.** The 2.x container must reach the PostgreSQL server, for example on the same Docker network. The server must answer within 15 seconds.
- **Disk space in `/config`.** The temporary copy holds all 1.x data, including the NZBs in the queue. Plan for about the size of the 1.x database, on top of the new 2.x database.
- **Files the connection string points to.** A password file (`Passfile` or `PGPASSFILE`) or client certificate (`SSL Certificate`, `SSL Key`) must be mounted in the 2.x container at the same path.

Stop 1.x before you start 2.x. The copy is a snapshot: changes 1.x makes after it starts are not imported.

### Connection settings the import cannot use

The import refuses these and the upgrade screen says what to change:

| Setting | What to do |
|---------|------------|
| `SSL Mode=VerifyCA` or `VerifyFull` | Keep running 1.x for now, or run the import with `SSL Mode=Require` over a network you trust. |
| `Require Auth` | Remove it (and `PGREQUIREAUTH`) for the import. |
| `Channel Binding=Require` | Set it to `Prefer` for the import. |
| `GSS Encryption Mode=Require`, Kerberos settings | Use a password login. |
| `SSL Password` (encrypted client key) | Use an unencrypted key file for the import. |
| More than one server in `Host`, `Target Session Attributes` | Use a single server. |
| `Options` | Move its value to `PGOPTIONS`. |

Settings that only tune the .NET driver (pool sizes, timeouts, keepalive and the like) are ignored.

## No dry run

`import-report` reads only 1.x installs on SQLite. For a PostgreSQL install it prints a note and stops. The full report shows after the import, on the System page.

## Run it

Follow [Run the upgrade](/v2/upgrade/run/), with the two variables added to the 2.x service:

```yaml
services:
  infinidysk:
    environment:
      TZ: Europe/Amsterdam # the zone 1.x ran in
      DATABASE_PROVIDER: postgres
      DATABASE_CONNECTION_STRING: Host=postgres;Port=5432;Database=nzbdav;Username=nzbdav;Password=change-me
```

When the import is done, remove `DATABASE_PROVIDER` and `DATABASE_CONNECTION_STRING`. 2.x does not use them again.

## If the copy fails

The upgrade screen shows the reason. 2.x deletes the partial copy and copies again from the start on the next start. Common reasons:

- **`DATABASE_PROVIDER is postgres, but DATABASE_CONNECTION_STRING is not set`.** Add the connection string 1.x used.
- **`…db-contract.json says the 1.x install kept its data in PostgreSQL…`.** 1.x wrote this file to `/config`. Set the two variables, or delete the file only if you really want an empty start.
- **`did not answer within 15 s` or `could not connect`.** Check the host, port and network from the 2.x container.
- **`has no … table`.** The connection string points at the wrong database or schema.
- **`PostgreSQL stopped responding`.** The server sent nothing for 60 seconds during the copy. Check the server and start again.

## Move to PostgreSQL afterwards

2.x runs on SQLite after the import. To keep your data in PostgreSQL, [move it](/v2/operate/postgresql/) from Settings > System > Database once the upgrade is done. The import report reminds you.

Use a **new, empty database** for 2.x. The 1.x database cannot be used: it already holds the 1.x tables, and keeping it untouched is what lets you roll back to 1.x.

You can also start 2.x with [`INFINIDYSK_DATABASE_URL`](/v2/operate/postgresql/#use-infinidysk_database_url-instead) pointing at a new, empty PostgreSQL database. The import then writes there directly, but you manage that database yourself and the move page is off.
