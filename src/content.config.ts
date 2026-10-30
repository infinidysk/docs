import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { changelogsLoader } from 'starlight-changelogs/loader';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	changelogs: defineCollection({
		loader: changelogsLoader([
			{
				provider: 'conventional-changelog',
				base: 'v1/changelog',
				changelog: 'https://raw.githubusercontent.com/infinidysk/infinidysk/main/CHANGELOG.md',
				title: 'Changelog',
				pageSize: 20,
				// A custom process gets the raw heading, so return the bare version (the date is still parsed).
				// Pre-1.0 entries predate the project and reference other projects.
				process: ({ title }) => {
					const version = /^v?(\d+\.\d+\.\d+\S*)/.exec(title)?.[1];
					return version?.startsWith('0.') ? undefined : version;
				},
			},
		]),
	}),
};
