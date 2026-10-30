---
title: "Migrate from AltMount"
---
<a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.10.0">since 0.10.0</a>

:::caution[Experimental]
The AltMount migration wizard is **experimental**. Back up both applications and `/config` before you start, and keep AltMount available until migrated releases play correctly from infinidysk. Mount the AltMount paths read-only when possible. The migration ledger (`usenet-migration.db`) is disposable and is not included in Backup & Restore.
:::

The guided migration under **Settings → System → Migration (experimental)** imports an existing AltMount library by rebuilding each release's NZB and submitting it through infinidysk's normal queue. It does not modify AltMount metadata or store files.

Both legacy raw-protobuf metadata and AltMount v3-prefixed `.meta` formats are supported, including v3 stores. The wizard follows each file's recorded `store_ref`; **Altmount Store Root** can remap its `.nzbs/...` suffix when the library was copied from another host or mounted at a different container path. Pre-v0.3.0 (v1) releases without a store are migrated from the original NZB when it still exists on disk (including `.nzb.gz` under `.nzbs/`).

## Before you start

AltMount does **not** have to be running.

- Configure and test the Usenet providers infinidysk will use.
- Create one or more dedicated, migration-only infinidysk categories that Radarr and Sonarr do not monitor. Do not reuse the categories configured on their normal infinidysk download clients.
- For Basic mode, mount **exactly one** new path into the infinidysk container: the AltMount data directory, read-only (for example `- /host/path/altmount:/altmount:ro`). Basic mode detects this `/altmount` layout automatically. Advanced mode accepts split metadata, config, and store paths instead. Values entered in the wizard are **container paths**, not host paths.
- **No rclone configuration changes** are required for any part of the migration.
- Locate the metadata tree containing `.meta` files and the store tree containing `.nzbs/*.nzbz` files (often under the same AltMount data mount).
- Keep AltMount's `config.yaml` available if you want its SABnzbd category list discovered automatically. Basic mode requires this file to be readable, valid, and contain at least one supported category.
- The optional Links step needs the media library mounted read-write for in-container Apply, link removal, or restore, and a writable backup directory. If you only need to rewrite links on the host, download the shell script instead and skip the library volume. Symlink backup archives default to `/config/migration-backups` (no extra volume).

Example compose fragment for Basic mode:

```yaml
services:
  nzbdav:
    volumes:
      - /host/path/config:/config
      - /host/path/altmount:/altmount:ro
      # Optional, for in-container Links Apply, link removal, or restore:
      # - /host/path/media:/data/media
```

## Connect modes and detected paths

**Basic mode** is the default. When Step 1 opens, it checks a previously saved standard-layout directory or `/altmount` on a new migration. Detection verifies more than the path names: the data directory and `metadata/` directory must exist, `config.yaml` must be readable and parseable, and the config must contain at least one supported SABnzbd category. **Connect** remains disabled until those checks pass.

The single data-directory field expands to the metadata root, `config.yaml`, and store root:

- `/altmount` → `/altmount/metadata`, `/altmount/config.yaml`, store root `/altmount`
- `/altmount-data/config` → `/altmount-data/config/metadata`, `/altmount-data/config/config.yaml`, store root `/altmount-data/config`

Enter an absolute **container path** and select **Detect paths** when you use a custom mount. The path cannot be the container filesystem root or contain `.` or `..` navigation segments. The store root intentionally matches the selected data directory in Basic mode; Scan later verifies the `.nzbs/` store data referenced by the metadata.

Category lists written as YAML lists whose `- name:` markers align with `categories:` are supported. If AltMount was installed by a management tool, map the complete AltMount data directory into the infinidysk container and enter that container path in Basic mode.

Use **Advanced mode** when metadata, `config.yaml`, and the store are split across mounts or do not follow the single-directory layout. It provides the three manual path fields and exposes **Submit Workers** and **Max Queue Depth**. Metadata Root is required; `config.yaml` and Store Root are optional. If you omit `config.yaml`, categories can still be discovered from the store during Scan.

## Choose dedicated migration categories

Create a new infinidysk category for migration imports, or one per media type or source category when you want separate rollback boundaries. Names such as `altmount-migration-movies` and `altmount-migration-tv` make their purpose clear. Map each included AltMount category to one of these dedicated categories, and exclude anything you do not intend to migrate.

Do not reuse a category already configured in Sonarr or Radarr. During migration, that Arr app can observe and act on the wizard's queue and history entries, which may trigger imports, renames, retries, or other automation while the migration is still running. Avoiding that otherwise requires stopping the Arr app or disabling infinidysk as its download client.

infinidysk places each imported release under `/content/<target-category>/<release>`. A migration-only category therefore also creates a clean rollback boundary: all content introduced by the migration is isolated beneath a known category directory. If migration imports share a production category with unrelated infinidysk content, there is no safe category-wide cleanup when reversing the migration.

## Run the wizard

The wizard has six steps: Connect, Categories, Scan, Review, Run, and Links.

1. **Connect**: use Basic mode to detect the single-directory layout described above, or switch to Advanced mode to enter each path manually. Keep Submit Workers at `1` unless you have a specific reason to increase it.
2. **Categories**: map every included AltMount category to a dedicated migration-only infinidysk category, or exclude it. Do not select a category monitored by Sonarr or Radarr.
3. **Scan**: infinidysk groups metadata by store, verifies the referenced `.nzbz` data, estimates fetch cost, and checks whether the release is already present.
4. **Review**: inspect red and amber findings, exclusions, filename changes, and collisions. Blocking collisions must be resolved before the run can start.
5. **Run**: the wizard reconstructs NZBs and submits them through infinidysk's normal import pipeline. Progress survives restarts. Pause or cancel stops before the next submission; a submission already crossing the queue boundary is allowed to finish and is recorded.
6. **Links (optional)**: build a dry-run plan for library symlinks that still target AltMount. Review every status before applying. infinidysk writes a restore archive first, changes symlinks only, and leaves real files, unmatched links, and drifted links untouched. For a clean break from AltMount, you can separately remove links with no match (status `orphan`); that action writes its own restore archive first.

The wizard can be reset after work reaches a non-active state. Resetting clears the current scan and plan but retains completed migration mappings so later symlink scans can identify releases imported in earlier runs.

## Symlink safety and restore

Set **Library Root** to the media library containing the links. **Backup Directory** defaults to `/config/migration-backups` (do not place it on the AltMount mount you are about to decommission). Apply and restore are confined to the Library Root and reject symlinked or reparse-point parent directories. If a link target changes after planning, the drift guard leaves it untouched.

Pause Arr import automation while Apply, link removal, or restore runs; a rename race with Sonarr or Radarr can leave a drifted link. Restored (and rewritten) symlinks are owned by the infinidysk process user.

You can download a **shell script** of rewrite rows to run on the host (or any container where the library paths are visible). That path does not update the wizard status table; in-container Apply with the restore archive remains the recommended path when the library is mounted.

The dry-run plan classifies every symlink found during the library walk:

| Status | Meaning |
|--------|---------|
| `rewrite` | Points to AltMount and has a verified infinidysk replacement. |
| `orphan` | Points to AltMount, but no safe infinidysk match was found. |
| `unreadable` | The link was found, but its target could not be read or classified. It remains unchanged and may still point at AltMount. Review directory permissions and filenames that are not valid UTF-8, and check whether another process changed the entry during the scan. Applying other rewrites requires explicit acknowledgement of these gaps. |
| `already-nzbdav` | Already points to infinidysk and needs no change. |
| `not-altmount` | Does not correlate to scanned AltMount content and is left unchanged. |
| `applied` | Repointed to infinidysk. |
| `failed` | A verified rewrite was attempted but could not be completed. |
| `removed` | An AltMount symlink with no match was removed after its original target was backed up. |

Use **Restore Symlinks** to select a generated archive. Rewrite restores verify that each link still points to the recorded infinidysk replacement; removal restores require the path to remain absent. Both restore the original AltMount target without overwriting changed library entries.

### Remove AltMount links with no match {#remove-orphaned-altmount-links}

After reviewing the plan, **Remove orphaned links** can delete only the library symlink entries with status `orphan`. The button shows the current count and requires a separate acknowledgement before removal begins. It does not delete the files those links point to, remove AltMount or infinidysk data, touch real files, or act on `unreadable` and unrelated links. Each link target is checked again immediately before removal, and a separately labelled removal archive is written and verified before the first link is deleted.

You can cancel an active removal. Links removed before cancellation remain recorded as `removed`, while untouched or drifted links remain available for review or retry. The verified archive covers every pre-validated candidate, so any link removed before cancellation remains recoverable.

This cleanup does **not** ask Sonarr or Radarr to search for replacements. After removing links, run **Refresh & Scan** for each affected series or movie (or trigger the corresponding refresh job) so the Arr app detects the deleted paths and marks those files as missing. You can then start or schedule re-grabs according to your Arr configuration.

Removal archives appear in the same **Restore Symlinks** control as rewrite archives. Restoring one recreates an absent link with its original AltMount target, but never overwrites a real file, directory, or differently targeted symlink that now occupies that path.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| Basic mode cannot detect AltMount | Confirm the absolute container directory contains `metadata/` and a readable, valid `config.yaml` with at least one SABnzbd category. Basic mode rejects the filesystem root and paths containing `.` or `..`. If the paths are split or `config.yaml` is unavailable, use Advanced mode. |
| No categories discovered | In Basic mode, check the `sabnzbd.categories` block in `config.yaml`; inline flow-style lists such as `categories: [...]` are not supported. In Advanced mode, omit an unusable config and continue to Scan so categories can be discovered from stores. |
| `store_missing` | Mount the `.nzbs` tree and set **Altmount Store Root** to the directory that contains `.nzbs`. |
| A release is already migrated | It is not resubmitted; retained provenance can still be used for symlink matching. |
| Start migration is disabled | Resolve blocking collisions, map or exclude every category, and refresh the review tables. |
| Reset is disabled | Cancel active work and wait for the session to reach a non-active state. A paused run is still active. |
| A symlink is `orphan`, `unreadable`, or `failed` | Review its match/target details. The wizard will not guess or overwrite a link that cannot be verified safely. |
| Removed links are still shown as present in Sonarr or Radarr | Run the relevant **Refresh & Scan** or refresh job so the Arr app detects the missing paths before starting re-grabs. |
| Many releases show `evicted` or `failed` after restoring a database backup | The migration ledger is ahead of the restored main database. Use Reset (or Forget migration data), then re-scan; releases that already imported are re-detected and not resubmitted. |

## Reverse the migration

A complete reversal is safest when the migration used dedicated categories containing no unrelated infinidysk releases. Do not begin cleanup until AltMount is available again and you have the rewrite and removal archives created during the Links step.

1. **Stop migration and library automation.** Cancel or finish any active wizard operation, then pause Sonarr and Radarr imports, refresh jobs, and media-server scans. Do not let another process rename or replace library entries during restore.
2. **Make AltMount available.** Start AltMount if needed and confirm its container mounts and original link targets are accessible. Restoring links to an unavailable AltMount instance leaves the library unusable.
3. **Restore removed and rewritten links.** In the Links step, use **Restore Symlinks** for every removal archive whose links you want back, then restore the rewrite archive created before Apply. Removed links are recreated with their original targets, and rewritten links are pointed back to AltMount. Restore refuses to overwrite real files, directories, or links changed since migration; resolve every reported issue before proceeding.
4. **Verify the restored library.** Inspect representative symlinks, confirm they point to AltMount again, and test playback through the original path. Do not delete the infinidysk copies until this verification succeeds.
5. **Delete only the isolated migration content.** Temporarily disable **Settings → WebDAV → Enforce Read-Only**, open **Explore → content → `<migration-category>`**, and delete every release folder underneath that dedicated category. Repeat for each migration-only category, then immediately re-enable **Enforce Read-Only**.
6. **Refresh the applications.** Run **Refresh & Scan** in each affected Arr app and refresh the media server. Confirm the restored files are present and no migrated infinidysk paths remain in use before resuming automation.
7. **Remove migration bookkeeping last.** After the rollback is verified, open **Manage Migration Data** in the wizard and select **Forget all migration records**. This removes the saved migration provenance and plan but does not delete WebDAV content, SAB history, symlinks, or backup archives. Keep the archives until you are satisfied that the rollback is complete.

:::danger[Keep deletion scoped to the migration category]
Never delete `/content` itself, and never bulk-delete a category that also contains normal infinidysk releases. If an existing production category was reused, identify and remove the migrated release folders individually; the category no longer provides a safe rollback boundary. Deleting folders from Explore is recursive and cannot be undone by the symlink restore archive.
:::

Deleting the release folders does not remove their SAB history entries. After the library and content rollback is verified, you may separately remove the migration-category history entries and remove the temporary categories from infinidysk settings if you no longer need them.

## Extending to other sources

The wizard core (session state machine, runs, provenance, submission lifecycle, claim recovery, reconciler, and history cleaner) is source-neutral. Adding another source needs:

1. A scan runner and metadata/store readers for that source's on-disk layout.
2. A correlation provider that maps library symlinks to imported DavItems (today that seam is `SymlinkPlanner.BuildCorrelationIndexAsync`).
3. Distinct restore-archive prefixes so Links-step backups do not collide across sources.

The symlink retargeting engine (matcher, ops, rewriter, restore, walker) already applies to any mount-to-mount move once correlation is supplied.

## Related

[Migration paths](/v1/getting-started/migration/) · [Backups and upgrades](/v1/guides/backups-upgrades/) · [SABnzbd settings](/v1/configuration/sabnzbd/)
