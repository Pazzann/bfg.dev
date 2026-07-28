<script lang="ts">
	import TerminalSplash from '$lib/components/TerminalSplash.svelte';

	const menu = [
		{ label: 'cd ~/projects', href: '/projects' },
		{ label: 'cat ~/cv.pdf', href: '/cv.pdf', download: 'anton-matiash-cv.pdf' },
		{ label: 'ls ~/contact', href: '/contact' },
		{ label: 'curl socials', href: 'https://bio.link/boyfromgod' }
	];
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="bfg.dev — home" />
</svelte:head>

<TerminalSplash
	image="/cc.png"
	lines={['Welcome!', 'where do you want to start?']}
	{menu}
/>
