<script lang="ts">
	import ProjectList, { type Project } from '$lib/components/ProjectList.svelte';

	// Placeholder entries — replace with real projects.
	const projects: Project[] = [
        {
            title: 'Voxel Engine tools',
            description: 'Voxel engine that can be used to generate voxels! Still in development though.',
            href: "https://github.com/Pazzann/voxel_engine_tools",
            media: '/voxel_engine_tools.gif',
            start: '2026'
        },
		{
			title: 'Project timer',
			description: 'A timer with stages that was used in international competitions.',
			media: 'https://github.com/Pazzann/project-timer/raw/master/demo.gif',
            href: "https://github.com/Pazzann/project-timer",
			start: '2024'
		},
        {
            title: 'Europe Domination',
            description: 'A grand strategy game that was never meant to be finished. A huge pile of 13k lines of code /:',
            media: 'https://github.com/Pazzann/EuropeDomination/blob/master/demo.gif?raw=true',
            href: "https://github.com/Pazzann/EuropeDomination",
            start: '2023',
            end: '2024'
        },
		{
			title: 'Mafia Bot',
			description: 'A bot that host board mafia games with lots of features. Was added to more than 150 servers. Still live!',
            href: "https://github.com/Pazzann/mafia-bot",
			media: '/mafiabot.png',
			start: '2023',
            end: '2024'
		},
        {
            title: 'Zenitka',
            description: 'The project is an anti-air system tester, created in accordance with the task of the Tournament of Young Informatics 2023-2024.',
            href: "https://github.com/Pazzann/Zenitka",
            media: '/zenitka.gif',
            start: '2023',
            end: '2024'
        },
        {
            title: 'Landscape Generator',
            description: 'The project is a landscape generator, created in accordance with the task of the Tournament of Young Informatics 2022-2023. It implements detailed generation parameters, 2D and 3D, operations with maps, and other features.',
            href: "https://github.com/yegorvk/LGTYI",
            media: '/landscapegenerator.jpg',
            start: '2022',
            end: '2023'
        },
	];
</script>

<svelte:head>
	<title>Programming</title>
	<meta name="description" content="bfg.dev — programming projects" />
</svelte:head>

<ProjectList
	image="/hitoru2.jpg"
	title="ls ./programming"
	{projects}
	back={{ label: 'cd ../', href: '/projects' }}
/>
