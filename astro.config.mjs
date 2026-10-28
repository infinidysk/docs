// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import starlightLinksValidator from 'starlight-links-validator';

const site = 'https://www.infinidysk.com';
const socialCard = `${site}/assets/social/social-card.png`;

export default defineConfig({
	site,
	outDir: './site',
	trailingSlash: 'always',
	markdown: {
		processor: satteri({ features: { headingAttributes: true } }),
	},
	integrations: [
		mermaid({ autoTheme: true }),
		starlight({
			title: 'infinidysk',
			description:
				'infinidysk, the NzbDAV SuperFork, mounts NZBs as a virtual filesystem and streams media directly from Usenet, with a SABnzbd-compatible API for Sonarr and Radarr.',
			logo: { src: './src/assets/logo.svg' },
			favicon: '/favicon.svg',
			customCss: [
				'@fontsource-variable/geist',
				'@fontsource-variable/geist-mono',
				'./src/styles/custom.css',
			],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/infinidysk/infinidysk' },
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/DAya7W6QMa' },
			],
			editLink: { baseUrl: 'https://github.com/infinidysk/docs/edit/main/' },
			head: [
				{ tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '32x32' } },
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', href: '/assets/favicon.png', sizes: '96x96' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/assets/apple-touch-icon.png', sizes: '180x180' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: socialCard } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: socialCard } },
			],
			plugins: [starlightLinksValidator()],
			sidebar: [
				{
					label: 'Getting started',
					items: [
						{ label: 'Overview', slug: 'getting-started' },
						{ label: 'Docker', slug: 'getting-started/docker' },
						{ label: 'Prebuilt Linux archives', slug: 'getting-started/prebuilt-archives' },
						{ label: 'Migration', slug: 'getting-started/migration' },
						{ label: 'First run', slug: 'getting-started/first-run' },
						{ label: 'Setup guide', slug: 'getting-started/setup-guide' },
						{ label: 'Connect Radarr/Sonarr', slug: 'getting-started/connect-arr' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Architecture', slug: 'guides/architecture' },
						{ label: 'Compare alternatives', slug: 'guides/compare' },
						{ label: 'Migrate from Altmount', slug: 'guides/altmount-migration' },
						{ label: 'Import strategies', slug: 'guides/import-strategies' },
						{ label: 'Mounting WebDAV', slug: 'guides/mounting-webdav' },
						{ label: 'Media servers', slug: 'guides/media-servers' },
						{ label: 'Stremio', slug: 'guides/stremio' },
						{ label: 'Backups and upgrades', slug: 'guides/backups-upgrades' },
						{ label: 'Troubleshooting', slug: 'guides/troubleshooting' },
					],
				},
				{
					label: 'Features',
					items: [
						{ label: 'Overview', slug: 'features' },
						{ label: 'WebDAV filesystem', slug: 'features/webdav-filesystem' },
						{ label: 'Streaming and seeking', slug: 'features/streaming-seeking' },
						{ label: 'Archives', slug: 'features/archives' },
						{ label: 'Multi-provider', slug: 'features/multi-provider' },
						{ label: 'Indexer search', slug: 'features/indexer-search' },
						{ label: 'Watchtower', slug: 'features/watchtower' },
						{ label: 'Warden, Watchdog, Preflight', slug: 'features/warden-watchdog-preflight' },
						{ label: 'NNTP pipelining', slug: 'features/nntp-pipelining' },
						{ label: 'Connection warming', slug: 'features/connection-warming' },
						{ label: 'SABnzbd API', slug: 'features/sab-api' },
					],
				},
				{
					label: 'Configuration',
					items: [
						{ label: 'Overview', slug: 'configuration' },
						{ label: 'Headless environment config', slug: 'configuration/headless' },
						{ label: 'Usenet', slug: 'configuration/usenet' },
						{ label: 'Indexers', slug: 'configuration/indexers' },
						{ label: 'Search profiles', slug: 'configuration/profiles' },
						{ label: 'Queue', slug: 'configuration/queue' },
						{ label: 'SABnzbd', slug: 'configuration/sabnzbd' },
						{ label: 'Streaming', slug: 'configuration/streaming' },
						{ label: 'WebDAV', slug: 'configuration/webdav' },
						{ label: 'URL base (sub-path hosting)', slug: 'configuration/url-base' },
						{ label: 'Watchdog', slug: 'configuration/watchdog' },
						{ label: 'Preflight', slug: 'configuration/preflight' },
						{ label: 'Watchtower', slug: 'configuration/watchtower' },
						{ label: 'Warden', slug: 'configuration/warden' },
						{ label: 'Arr instances', slug: 'configuration/arrs' },
						{ label: 'Rclone', slug: 'configuration/rclone' },
						{ label: 'Health and repairs', slug: 'configuration/repairs' },
						{ label: 'Maintenance', slug: 'configuration/maintenance' },
						{ label: 'Backup and restore', slug: 'configuration/backup' },
						{ label: 'Support', slug: 'configuration/support' },
						{ label: 'OIDC / SSO', slug: 'configuration/oidc' },
						{ label: 'Environment variables', slug: 'configuration/environment-variables' },
					],
				},
				{
					label: 'Use cases',
					items: [
						{ label: 'Overview', slug: 'use-cases' },
						{ label: 'Infinite library with Arrs', slug: 'use-cases/infinite-library-arr' },
						{ label: 'Streaming only', slug: 'use-cases/streaming-only' },
						{ label: 'Multi-provider failover', slug: 'use-cases/multi-provider-failover' },
					],
				},
				{
					label: 'Operations',
					items: [
						{ label: 'Health and repairs', slug: 'operations/health-repairs' },
						{ label: 'Prometheus metrics', slug: 'operations/prometheus' },
						{ label: 'Memory-constrained hosts', slug: 'operations/memory-constrained-hosts' },
						{ label: 'Retention and cleanup', slug: 'operations/retention-cleanup' },
						{ label: 'Logs and crash dumps', slug: 'operations/logs-crash-dumps' },
						{ label: 'Deletion audit', slug: 'operations/deletion-audit' },
						{ label: 'Plex re-added episodes', slug: 'operations/plex-readd-diagnosis' },
						{ label: 'Database corruption', slug: 'operations/database-corruption' },
						{ label: 'PostgreSQL', slug: 'operations/postgresql' },
					],
				},
				{
					label: 'Community',
					items: [
						{ label: 'Rename FAQ', slug: 'community/renaming-to-infinidysk' },
						{ label: 'Connect', slug: 'community/github' },
						{ label: 'Contributing', slug: 'community/contributing' },
						{
							label: 'Code boundaries',
							link: 'https://github.com/infinidysk/infinidysk/blob/main/docs/decisions/0001-code-boundaries.md',
						},
						{
							label: 'DI topology',
							link: 'https://github.com/infinidysk/infinidysk/blob/main/docs/decisions/0002-di-topology.md',
						},
						{ label: 'Changelog', slug: 'community/changelog' },
						{ label: 'About', slug: 'community/about' },
						{ label: '0.7 stack announcement', slug: 'community/history/release-0.7' },
					],
				},
			],
		}),
	],
});
