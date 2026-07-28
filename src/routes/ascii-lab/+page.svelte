<script lang="ts">
	import { dev } from '$app/environment';
	import AsciiImage from '$lib/components/AsciiImage.svelte';

	// Dev-only tuning bench for <AsciiImage>. Safe to delete once defaults are settled.
	let src = $state('/cc.png');
	let cols = $state(100);
	let metric = $state<'lum' | 'white' | 'sobel' | 'combo'>('lum');
	let gamma = $state(1);
	let threshold = $state(0.06);
	let edgeGain = $state(3);
	let fillGain = $state(0.55);
	let minLight = $state(0.42);
	let size = $state(0.5);
	let color = $state(true);
	let ramp = $state(' .:-=+*#%@');

	const snippet = $derived(
		`<AsciiImage\n  src="${src}"\n  cols={${cols}}\n  metric="${metric}"\n  gamma={${gamma}}\n  threshold={${threshold}}` +
			(metric === 'sobel' || metric === 'combo' ? `\n  edgeGain={${edgeGain}}` : '') +
			(metric === 'combo' ? `\n  fillGain={${fillGain}}` : '') +
			(color ? `\n  minLight={${minLight}}` : `\n  color={false}`) +
			`\n  ramp={${JSON.stringify(ramp)}}\n/>`
	);
</script>

<svelte:head><title>ascii lab</title></svelte:head>

{#if !dev}
	<p class="note">The tuning bench only runs in development.</p>
{:else}
	<div class="lab">
		<aside class="controls">
			<label>image <input bind:value={src} /></label>

			<label>metric
				<select bind:value={metric}>
					<option value="lum">lum — darkness (line art)</option>
					<option value="white">white — distance from white (solid)</option>
					<option value="sobel">sobel — edges only</option>
					<option value="combo">combo — fill + edges</option>
				</select>
			</label>

			<label>cols <b>{cols}</b><input type="range" min="30" max="200" step="2" bind:value={cols} /></label>
			<label>gamma <b>{gamma.toFixed(2)}</b><input type="range" min="0.3" max="3" step="0.05" bind:value={gamma} /></label>
			<label>threshold <b>{threshold.toFixed(3)}</b><input type="range" min="0" max="0.5" step="0.005" bind:value={threshold} /></label>

			{#if metric === 'sobel' || metric === 'combo'}
				<label>edgeGain <b>{edgeGain.toFixed(2)}</b><input type="range" min="0.5" max="8" step="0.1" bind:value={edgeGain} /></label>
			{/if}
			{#if metric === 'combo'}
				<label>fillGain <b>{fillGain.toFixed(2)}</b><input type="range" min="0" max="1.5" step="0.05" bind:value={fillGain} /></label>
			{/if}

			<label><input type="checkbox" bind:checked={color} /> colour from pixels</label>
			{#if color}
				<label>minLight <b>{minLight.toFixed(2)}</b><input type="range" min="0" max="0.8" step="0.02" bind:value={minLight} /></label>
			{/if}

			<label>font size <b>{size.toFixed(2)}rem</b><input type="range" min="0.15" max="1.2" step="0.01" bind:value={size} /></label>
			<label>ramp <input bind:value={ramp} /></label>

			<pre class="snippet">{snippet}</pre>
		</aside>

		<div class="stage" style="--ascii-size: {size}rem">
			{#key `${src}|${cols}|${metric}|${gamma}|${threshold}|${edgeGain}|${fillGain}|${color}|${minLight}|${ramp}`}
				<AsciiImage
					{src}
					{cols}
					{metric}
					{gamma}
					{threshold}
					{edgeGain}
					{fillGain}
					{color}
					{minLight}
					{ramp}
					lineDelay={0}
					alt="tuning preview"
				/>
			{/key}
		</div>
	</div>
{/if}

<style>
	.lab {
		display: flex;
		gap: 1.5rem;
		padding: 1rem;
		align-items: flex-start;
		font-family: 'Fira Mono', monospace;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		width: 20rem;
		flex: none;
		font-size: 0.8rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	label b {
		color: #00dfd8;
		font-weight: normal;
	}

	input:not([type]),
	select {
		background: #111;
		color: white;
		border: 1px solid #444;
		padding: 0.25rem;
		font-family: inherit;
	}

	.snippet {
		background: #111;
		border: 1px solid #333;
		padding: 0.5rem;
		font-size: 0.7rem;
		white-space: pre-wrap;
		user-select: all;
	}

	.stage {
		flex: 1;
		overflow: auto;
	}

	.note {
		padding: 2rem;
		font-family: monospace;
	}
</style>
