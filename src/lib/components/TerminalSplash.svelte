<script lang="ts">
	import { base } from '$app/paths';
	import AsciiImage from './AsciiImage.svelte';
	import Typewriter from './Typewriter.svelte';

	type Metric = 'lum' | 'white' | 'sobel' | 'combo';
	/**
	 * An entry with no `href` renders as plain text (e.g. a handle you can't link to).
	 * `download` saves the target instead of navigating, using the given filename.
	 */
	export type MenuItem = { label: string; href?: string; download?: string };
	/** The back entry always navigates, so its href is required. */
	export type BackItem = { label: string; href: string };

	interface Props {
		/** Image for the ASCII portrait, app-relative (e.g. "/cc.png"). */
		image: string;
		alt?: string;
		/** Prompt lines, typed one after another. */
		lines: string[];
		/** Revealed once the last line finishes typing. */
		menu?: MenuItem[];
		/** Optional "go back" entry, rendered under the menu with a gap. */
		back?: BackItem;
		/** Typing speed in ms per character. */
		typeSpeed?: number;
		cols?: number;
		metric?: Metric;
		gamma?: number;
		/** Delay (ms) between revealed art lines. */
		lineDelay?: number;
	}

	let {
		image,
		alt = 'ASCII portrait',
		lines,
		menu = [],
		back,
		typeSpeed = 40,
		cols = 100,
		metric = 'sobel',
		gamma = 1.5,
		lineDelay = 14
	}: Props = $props();

	// Leave mailto:/https: and fragment links alone; prefix app-relative ones.
	const withBase = (p: string) => (/^[a-z]+:/i.test(p) || p.startsWith('#') ? p : `${base}${p}`);
	const isExternal = (p: string) => /^https?:\/\//i.test(p);

	let artDone = $state(false);
	// Number of prompt lines finished typing; also the index of the active one.
	let typed = $state(0);

	const ready = $derived(artDone && typed >= lines.length);
</script>

<section>
	<div class="splash">
		<AsciiImage
			src={withBase(image)}
			{alt}
			{cols}
			{metric}
			{gamma}
			{lineDelay}
			eager
			oncomplete={() => (artDone = true)}
			class="portrait"
		/>

		<div class="terminal">
			{#if artDone}
				{#each lines as line, i (i)}
					{#if i <= typed}
						<p class="line">
							<span class="prompt">$</span>
							<Typewriter
								text={line}
								speed={typeSpeed}
								eager
								cursor={i === typed}
								oncomplete={() => (typed = i + 1)}
							/>
						</p>
					{/if}
				{/each}
			{/if}

			{#if ready && menu.length}
				<nav class="menu">
					{#each menu as item, i (item.label)}
						{#if item.href}
							<a
								href={withBase(item.href)}
								download={item.download}
								style="--i: {i}"
								target={isExternal(item.href) ? '_blank' : undefined}
								rel={isExternal(item.href) ? 'noopener noreferrer' : undefined}
							>
								<span class="prompt">&gt;</span>{item.label}
							</a>
						{:else}
							<span class="static" style="--i: {i}">
								<span class="prompt">&gt;</span>{item.label}
							</span>
						{/if}
					{/each}
				</nav>
			{/if}

			{#if ready && back}
				<nav class="menu back">
					<a href={withBase(back.href)} style="--i: {menu.length}">
						<span class="prompt">&gt;</span>{back.label}
					</a>
				</nav>
			{/if}
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
		padding: 0.5rem 1rem;
	}

	.splash {
		display: flex;
		align-items: center;
		gap: clamp(1rem, 4vw, 3rem);
		flex-wrap: wrap;
		justify-content: center;
	}

	.splash :global(.portrait) {
		/* The art is ~100 cols x 60 rows, so height is the binding constraint on a
		   wide screen. Sizing off vh as well keeps it filling the viewport instead
		   of sitting small in the middle of it. */
		--ascii-size: clamp(0.26rem, min(1.15vh, 0.95vw), 0.95rem);
	}

	.terminal {
		font-family: 'Courier Prime', monospace;
		font-size: clamp(1rem, 2.2vw, 1.7rem);
		line-height: 1.7;
		/* Reserve the height so the menu appearing doesn't shift the art. */
		min-height: 9rem;
	}

	.line {
		margin: 0;
	}

	.prompt {
		color: #00dfd8;
		margin-right: 0.6ch;
		user-select: none;
	}

	.menu {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		margin-top: 1.2rem;
	}

	.menu a,
	.menu .static {
		display: inline-block;
		width: fit-content;
		padding: 0.1rem 0.6rem;
		font-weight: lighter;
		text-decoration: none;
		color: white;
		transition:
			background 0.2s,
			color 0.2s;
		animation: appear 0.35s ease both;
		animation-delay: calc(var(--i) * 0.1s);
	}

	/* Unlinked entries are selectable so the handle can be copied. */
	.menu .static {
		user-select: text;
		cursor: text;
	}

	.menu .static .prompt {
		color: #ff0080;
	}

	.menu.back {
		margin-top: 0.9rem;
	}

	.menu a .prompt {
		color: #ff0080;
	}

	.menu.back a .prompt {
		color: #7928ca;
	}

	.menu a:hover {
		background: white;
		color: black;
	}

	.menu a:hover .prompt {
		color: black;
	}

	@keyframes appear {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.menu a,
		.menu .static {
			animation: none;
		}
	}
</style>
