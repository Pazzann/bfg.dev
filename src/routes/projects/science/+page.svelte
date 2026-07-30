<script lang="ts">
	import ProjectList, { type Project } from '$lib/components/ProjectList.svelte';

	// Placeholder entries — replace with real projects.
	const projects: Project[] = [
		{
			title: 'Shitty Belousov–Zhabotinsky reaction study',
			description: 'No references, in Russian, but plots are so cool there! Hope you can forgive young me, but I really want to share it.',
			media: '/bzexample.gif',
            href: 'https://figshare.com/articles/conference_contribution/___-_____/16910188?file=31473176',
			start: '2021',
			end: '2021'
		}
	];
</script>

<svelte:head>
	<title>Science</title>
	<meta name="description" content="bfg.dev — science projects" />
</svelte:head>

<ProjectList
	image="/reiscience.jpg"
	title="ls ./science"
	{projects}
	back={{ label: 'cd ../', href: '/projects' }}
/>
