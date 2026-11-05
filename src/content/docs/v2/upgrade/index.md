---
title: Before you upgrade
description: Check that you can upgrade from 1.x to infinidysk 2.x, copy your config and run a dry run.
---

The upgrade reads your 1.x config, including one from the old `ghcr.io/nzbdav/nzbdav` image, and imports it into a new database: providers, Arr instances, categories, the SAB API key, WebDAV and admin logins, single sign-on, the mount directory, the library and its item ids, history and the queue.

Your 1.x files are opened read-only and never changed. Still, work on a copy.

:::note[1.x on PostgreSQL]
The upgrade imports 1.x installs on PostgreSQL too. 2.x reads the 1.x database and imports it into SQLite; you can move to PostgreSQL afterwards. See [Upgrade from 1.x on PostgreSQL](/v2/upgrade/postgresql/) for what it needs. There is no dry run for these installs, so skip step 2 below.
:::

:::caution[Who should not upgrade yet]
- **DUMB users.** 2.x does not ship binaries packaged for DUMB yet. Stay on 1.x for now.
- **1.x older than v1.3.0.** Update 1.x and start it once first.
- **`nzbdav-dev/nzbdav` 0.6.4.** [Migrate to the latest 1.x](/v1/getting-started/migration/) and start it once first.
- **You need a 1.x feature 2.x does not have yet.** See [What's new in 2.x](/v2/whats-new/#feature-comparison).
:::

## Steps

1. Stop 1.x so the copy is consistent, then copy its config directory:

   ```sh
   docker compose stop <1.x service>
   cp -a ./config ./config-2.0
   ```

2. Optional dry run. This prints what will be carried over, what will not, and why, without importing anything:

   ```sh
   docker run --rm -v ./config-2.0:/config ghcr.io/infinidysk/infinidysk-next:edge import-report
   ```

3. Note the time zone 1.x ran in. 2.x needs the same `TZ`: 1.x stored local times, so a different zone shifts every file date, and media servers may then re-read your whole library.

Next, if 1.x used an rclone sidecar, [move off rclone](/v2/upgrade/rclone/). Otherwise go straight to [Run the upgrade](/v2/upgrade/run/).

## Single sign-on

If 1.x had `OIDC_ISSUER`, `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET` set on the container, the upgrade carries them over with `OIDC_REDIRECT_URI`, `OIDC_SCOPES` and `OIDC_USERNAME_CLAIM`. The upgrade reads them from the 2.x container's environment, so keep them on the 2.x service for its first start, and pass them to the dry run too (`docker run --env-file …`). With only some of the three set, SSO stays off, as in 1.x.

After the upgrade the settings live in the database under Settings > System > Access > Single sign-on; 2.x no longer reads the `OIDC_*` variables, so you can remove them. See [Single sign-on](/v2/operate/sso/).

- **`OIDC_ADMIN_CLAIM` is not carried over.** Every SSO user is an admin in 2.x, so users 1.x showed as read-only can change settings. The report adds a note when it was set. Limit who may use the client at your identity provider.
- **No admin account.** A 1.x install that signed in only through SSO upgrades without one. The report shows `admin: none; sign in with SSO`, and you sign in with SSO.
- **Invalid settings.** If 2.x rejects the 1.x SSO settings, for example an `http://` issuer on another host, they are left out and the report says why; sign in with your password and set SSO up again. Without an admin account the import stops instead, so nobody can create one. Fix the `OIDC_*` variables, or remove them to create a password account, and start again.
