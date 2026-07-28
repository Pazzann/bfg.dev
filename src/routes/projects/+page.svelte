<script lang="ts">
	import TerminalSplash from '$lib/components/TerminalSplash.svelte';

	const menu = [
		{ label: 'cd ./engineering', href: '/projects/engineering' },
		{ label: 'cd ./programming', href: '/projects/programming' },
		{ label: 'cd ./science', href: '/projects/science' }
	];
</script>

<svelte:head>
	<title>Projects</title>
	<meta name="description" content="bfg.dev — projects" />
</svelte:head>

<TerminalSplash
	image="/hitoru.jpg"
	lines={['What project types are you interested in?']}
	{menu}
	back={{ label: 'cd ../', href: '/' }}
/>
