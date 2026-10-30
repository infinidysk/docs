---
title: Library folders
description: Tell infinidysk 2.x where your Arrs keep their libraries, so it can convert the library, move the mount and clean up.
---

Library folders are the folders that hold your Arrs' libraries: their root folders. infinidysk only reads its own pointers in them: symlinks into `<mount>/.ids/` and its own `.strm` files. Nothing else is read or changed.

They are needed for:

- [switching the import strategy](/v2/install/import-strategy/#switching-strategy), changing the STRM key or public URL, and [moving the mount](/v2/upgrade/rclone/#moving-the-mount-later);
- the [maintenance jobs](/v2/operate/maintenance/) that remove unlinked files and dead links. They refuse to run without library folders.

## Set them

Add each folder under Settings > Automation > Library > Folders:

| Field | What it is |
|-------|------------|
| **Folder here** | The path inside the infinidysk container. |
| **Folder as the Arrs see it** | The path inside the Arr containers. Leave it blank when it is the same. |

Bind each folder into the infinidysk container with write access, because conversions and maintenance change the pointers in it:

```yaml
services:
  infinidysk:
    volumes:
      - /data/media:/data/media
```

Paths must be absolute. A library folder cannot be inside the mount or the STRM folder, and library folders cannot overlap. The mount and the STRM folder may sit inside a library folder.

The setting is `imports.library_dirs`, a list of `path` and `arr_path`.
