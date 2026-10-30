---
title: "Deletion audit"
---
Mounted content under `/content` can vanish for several independent reasons. “Files disappeared by themselves” usually conflates these paths:

| Cause | What happens |
|-------|--------------|
| History delete with delete-files | Triggered from the admin UI or `del_completed_files=1`. Mounted items for that history row are deleted. |
| Cascading child sweep | After a directory is deleted, its children are removed in the background. |
| Health repair | Triggered by repairs and missing articles. Unlinked or blocklisted files are deleted along with their generated STRM sidecars <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>; linked releases are removed and blocklisted through Arr. |
| Clean Missing Payloads | Manual, after an approved dry run. Deletes only mounts whose streaming payload blob **and** legacy metadata are both absent; verified Arr files request replacement without blocklisting <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>. |
| Remove Orphaned Files | Manual or scheduled. Deletes files with **no** library symlink or STRM and **no** history link, along with their generated STRM sidecars <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>. Aborts if too few links are found; sidecars under the configured completed-downloads directory never count as library links. |
| History retention / Prune Completed History | Retention days above 0, or the Maintenance task. Prunes history with `deleteFiles: false`: mounts stay but lose their history link, so Remove Orphaned Files can then remove unlinked mounts. |
| SAB/Arr history delete without delete-files | Arr Remove Completed, queue rules with `removeFromClient=true`, or a `/completed-symlinks` folder DELETE. The history row is gone; mounts stay. Logged as `history-remove source=… deleteFiles=false`. |
| Manual delete | WebDAV DELETE or admin API. Explicit user action. |
| Blocklist filter | Files matching the download file blocklist are removed during queue post-process and never appear in `/content`. |
| Non-persistent `/config` | Volume missing or wiped. Empty database on restart, so the entire library looks gone. |

## Grep the audit log

Every DavItem deletion emits a structured Serilog line. Search for:

```text
dav-delete
```

Examples:

```text
dav-delete source=history-cleanup ... reason=DeleteMountedFiles=true ...
dav-delete source=dav-cleanup ... reason=cascading child sweep ...
dav-delete source=health-repair ... reason=health validation failed; not library linked and ...
dav-delete source=remove-missing-payloads ... reason=streaming payload and legacy metadata ...
dav-delete source=remove-orphaned ... reason=no library symlink/strm link
dav-delete source=remove-orphaned ... reason=generated strm sidecar of orphaned file
dav-delete source=webdav-delete ... reason=client DELETE on UsenetFile
dav-delete source=blocklist-filter ... reason=blacklisted filename during queue post-process
history-remove source=sab-history-delete count=1 deleteFiles=false ...
```

Large history deletes may also emit `dav-delete-bulk`.

## Persist `/config`

Always map a durable host directory to `/config`. Without it, every recreate looks like a total wipe.
