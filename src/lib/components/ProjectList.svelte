<script lang="ts">
	import { base } from '$app/paths';
	import AsciiImage from './AsciiImage.svelte';
	import Typewriter from './Typewriter.svelte';

	export type Project = {
		title: string;
		description: string;
		/** Small still or gif shown beside the entry. */
		media?: string;
		/** "learn more" target. Omitted renders the button disabled. */
		href?: string;
		/** Shown top-right. With `start` but no `end`, reads "2024 — present". */
		start?: string;
		end?: string;
	};

	interface Props {
		/** Image for the ASCII portrait, app-relative. */
		image: string;
		alt?: string;
		/** Typed heading, e.g. "ls ./engineering". */
		title: string;
		projects: Project[];
		back?: { label: string; href: string };
		typeSpeed?: number;
		cols?: number;
		metric?: 'lum' | 'white' | 'sobel' | 'combo';
		gamma?: number;
		lineDelay?: number;
	}

	let {
		image,
		alt = 'ASCII portrait',
		title,
		projects,
		back,
		typeSpeed = 40,
		cols = 150,
		metric = 'sobel',
		gamma = 1.5,
		lineDelay = 14
	}: Props = $props();

	const withBase = (p: string) => (/^[a-z]+:/i.test(p) || p.startsWith('#') ? p : `${base}${p}`);
	const isExternal = (p: string) => /^https?:\/\//i.test(p);

	/** "2023 — 2024", "2026" when it starts and ends the same year, "2025 — present" when open-ended. */
	function dateRange({ start, end }: Project) {
		if (!start) return '';
		if (!end) return `${start} — present`;
		return start === end ? start : `${start} — ${end}`;
	}

	let artDone = $state(false);
	let titleDone = $state(false);
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
			class="ascii-portrait"
		/>

		<div class="panel">
			{#if artDone}
				<h1 class="title">
					<span class="prompt">$</span>
					<Typewriter
						text={title}
						speed={typeSpeed}
						eager
						cursor={!titleDone}
						oncomplete={() => (titleDone = true)}
					/>
				</h1>
			{/if}

			{#if titleDone}
				<ul class="list">
					{#each projects as project, i (project.title)}
						<li>
							<!-- The whole card is the link. It renders as a plain <div> when there's
							     no href, which is also what the `a.project` hover styles key off. -->
							<svelte:element
								this={project.href ? 'a' : 'div'}
								class="project"
								style="--i: {i}"
								href={project.href ? withBase(project.href) : undefined}
								target={project.href && isExternal(project.href) ? '_blank' : undefined}
								rel={project.href && isExternal(project.href) ? 'noopener noreferrer' : undefined}
							>
								{#if project.media}
									<img class="thumb" src={withBase(project.media)} alt="" loading="lazy" />
								{:else}
									<div class="thumb placeholder" aria-hidden="true">?</div>
								{/if}

								<div class="body">
									<header>
										<h2>{project.title}</h2>
										{#if project.start}
											<span class="dates">{dateRange(project)}</span>
										{/if}
									</header>

									<p>{project.description}</p>

									{#if project.href}
										<div class="actions">
											<!-- A label, not a link: nesting <a> inside <a> is invalid. -->
											<span class="more">learn more <span class="arrow" aria-hidden="true">&#8599;</span></span>
										</div>
									{/if}
								</div>
							</svelte:element>
						</li>
					{/each}
				</ul>

				{#if back}
					<nav class="back">
						<a href={withBase(back.href)}>
							<span class="prompt">&gt;</span>{back.label}
						</a>
					</nav>
				{/if}
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
		width: 100%;
		max-width: 100rem;
	}

	.panel {
		font-family: 'Courier Prime', monospace;
		display: flex;
		flex-direction: column;
		flex: 1 1 26rem;
		min-width: 0;
		max-height: 80vh;
	}

	.title {
		font-size: clamp(1.1rem, 2.2vw, 1.7rem);
		line-height: 1.7;
		margin: 0 0 0.8rem;
		font-weight: normal;
	}

	.prompt {
		color: #00dfd8;
		margin-right: 0.6ch;
		user-select: none;
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0 0.75rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		overflow-y: auto;
		min-height: 0;
		scrollbar-width: thin;
		scrollbar-color: #7928ca transparent;
	}

	.list::-webkit-scrollbar {
		width: 8px;
	}
	.list::-webkit-scrollbar-track {
		background: #111;
	}
	.list::-webkit-scrollbar-thumb {
		background: #7928ca;
	}

	.project {
		display: flex;
		gap: 0.9rem;
		/* stretch so .body fills the card and the button can sit on its bottom edge */
		align-items: stretch;
		border: 1px solid #333;
		padding: 0.7rem;
		color: white;
		text-decoration: none;
		transition:
			background 0.2s,
			border-color 0.2s,
			color 0.2s;
		animation: appear 0.35s ease both;
		animation-delay: calc(var(--i) * 0.08s);
	}

	/* Only linkable cards react — an inert card shouldn't look clickable.
	   `p` and `.dates` set their own colour, so they need explicit overrides. */
	a.project:hover {
		background: white;
		color: black;
		border-color: white;
	}

	a.project:hover .dates,
	a.project:hover p {
		color: black;
	}

	a.project:hover .thumb {
		border-color: black;
	}

	.thumb {
		width: clamp(4.5rem, 8vw, 7rem);
		aspect-ratio: 1;
		object-fit: cover;
		flex: none;
		border: 1px solid #333;
	}

	.placeholder {
		display: grid;
		place-items: center;
		color: #555;
		font-size: 1.5rem;
	}

	.body {
		min-width: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.body header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	.body h2 {
		margin: 0 0 0.3rem;
		font-size: 1.05rem;
		font-weight: 700;
	}

	.dates {
		flex: none;
		font-size: 0.8rem;
		font-weight: lighter;
		color: #888;
		white-space: nowrap;
	}

	.body p {
		margin: 0 0 0.5rem;
		font-size: 0.9rem;
		font-weight: lighter;
		color: #bbb;
		line-height: 1.5;
	}

	/* margin-top:auto pins the row to the bottom of the stretched card. */
	.actions {
		margin-top: auto;
		display: flex;
		justify-content: flex-end;
	}

	/* A label inside the card link, so it just follows the card's colour. */
	.more {
		display: inline-flex;
		align-items: center;
		gap: 0.5ch;
		font-size: 0.85rem;
		color: inherit;
	}

	/* Nudges right on hover — the usual affordance for this control. */
	.arrow {
		transition: transform 0.2s;
	}

	a.project:hover .arrow {
		transform: translate(2px, -2px);
	}

	@media (prefers-reduced-motion: reduce) {
		.arrow {
			transition: none;
		}
	}

	.back {
		margin-top: 1rem;
		flex: none;
	}

	.back a {
		display: inline-block;
		width: fit-content;
		padding: 0.1rem 0.6rem;
		font-weight: lighter;
		text-decoration: none;
		color: white;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.back .prompt {
		color: #7928ca;
	}

	.back a:hover {
		background: white;
		color: black;
	}

	.back a:hover .prompt {
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
		.project {
			animation: none;
		}
	}
</style>
