<script lang="ts">
	import TerminalSplash from '$lib/components/TerminalSplash.svelte';

	// An entry with no `href` renders as selectable plain text — Discord has no
	// linkable profile URL from a username alone.
	const EMAIL = 'manton2007@gmail.com';
	const DISCORD = 'boyfromgod';
	const TELEGRAM = 'boyfromgod';
	const LINKEDIN = 'anton-matiash-bfg';

	const menu = [
		{ label: `mail ${EMAIL}`, href: `mailto:${EMAIL}` },
		{ label: `discord @${DISCORD}` },
		{ label: `telegram @${TELEGRAM}`, href: `https://t.me/${TELEGRAM}` },
		{ label: `linkedin /in/${LINKEDIN}`, href: `https://www.linkedin.com/in/${LINKEDIN}` }
	];
</script>

<svelte:head>
	<title>Contact</title>
	<meta name="description" content="bfg.dev — contact" />
</svelte:head>

<TerminalSplash
	image="/ayanami.jpg"
	lines={["What's your preferred option?"]}
	{menu}
	back={{ label: 'cd ../', href: '/' }}
/>
