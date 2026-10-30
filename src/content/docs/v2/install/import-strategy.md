---
title: Choose an import strategy
description: How completed jobs are handed to the Arrs in 2.x, as symlinks or STRM files, and how to switch between them.
---

When a job completes, the Arr imports it in one of two forms. Pick one under Settings > Automation > Library > Import strategy; the setting applies to the whole install.

| Strategy | What the Arr imports | Media server reads |
|----------|----------------------|--------------------|
| Symlinks (default) | Symlinks from `<mount>/completed-symlinks/<category>/<job>` | The mount, through the symlink |
| STRM | `.strm` files written to the STRM folder, each holding a signed playback URL | An HTTP URL; it does not need the mount |

Categories owned by a music or book Arr always hand off as symlinks.

STRM needs a [public URL](/v2/operate/reverse-proxy/#public-url) that your media server can reach, because every `.strm` file points to it.

## Switching strategy

Switching needs [library folders](/v2/operate/library-folders/), so infinidysk can find the files to convert.

Picking the other strategy starts a preview. It walks the library folders without writing and lists what will change, the files each Arr will rescan, name conflicts and any problems with a folder. Confirm it to start the conversion.

- Symlinks to videos become `.strm` files, and the other way around.
- Subtitle symlinks become real subtitle files in STRM mode.
- Each Sonarr and Radarr rescans the converted series or movies, and infinidysk restores their quality, language and monitored state afterwards.
- A conversion resumes after a restart or crash. Cancel stops after the current file and leaves a mixed library, which still plays.

Settings saved without a preview (through the API or environment variables) apply to new jobs only, and every page shows "Library not in the current form" until a preview applies them.
