<script lang="ts">
	import TerminalSplash from '$lib/components/TerminalSplash.svelte';


	const menu = [
		{ label: `wget MyAnimeList`, href: `https://myanimelist.net/profile/boyfromgod` },
		{ label: `wget iMDb`, href: 'https://www.imdb.com/user/p.2ctuxmu2cswx5tgixjyz6t2z4y?ref_=hm_nv_profile' },
		{ label: `wget PlayTracker`, href: `https://playtracker.net/profile/boyfromgod` }
	];
</script>

<svelte:head>
	<title>Interests</title>
	<meta name="description" content="bfg.dev — interests" />
</svelte:head>

<TerminalSplash
	image="/askainterests.jpg"
	lines={["Well, maybe this way you will get to know me better?"]}
	{menu}
	back={{ label: 'cd ../', href: '/' }}
/>
