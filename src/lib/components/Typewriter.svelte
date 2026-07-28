<script lang="ts">
	interface Props {
		/** Text to type out. Pass a single string or an array of lines. */
		text: string | string[];
		/**
		 * Total time (ms) to type the whole content ("typing time limit").
		 * Per-character delay is derived so short and long text finish in a
		 * similar time. Ignored when `speed` is set.
		 */
		duration?: number;
		/** Fixed delay (ms) per character. Overrides `duration` when set. */
		speed?: number;
		/** Delay (ms) before typing starts once the element appears. */
		startDelay?: number;
		/** Show a cursor block while/after typing. */
		cursor?: boolean;
		/** Keep the cursor after typing finishes (blinking). */
		cursorOnComplete?: boolean;
		/** Re-type each time the element scrolls back into view. */
		repeat?: boolean;
		/** Start on mount instead of waiting to scroll into view. Use when a
		 *  parent sequence controls when this appears. */
		eager?: boolean;
		/** Called once the full text has been typed. */
		oncomplete?: () => void;
		class?: string;
	}

	let {
		text,
		duration = 1500,
		speed,
		startDelay = 0,
		cursor = true,
		cursorOnComplete = false,
		repeat = false,
		eager = false,
		oncomplete,
		class: className = ''
	}: Props = $props();

	const full = $derived(Array.isArray(text) ? text.join('\n') : text);

	let shown = $state('');
	let done = $state(false);
	let started = false;
	let node: HTMLElement;

	function type() {
		shown = '';
		done = false;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			shown = full;
			done = true;
			oncomplete?.();
			return;
		}

		const perChar = speed ?? Math.max(8, duration / Math.max(full.length, 1));
		let i = 0;

		const startTimer = setTimeout(function step() {
			if (i >= full.length) {
				done = true;
				oncomplete?.();
				return;
			}
			shown += full[i];
			i += 1;
			setTimeout(step, perChar);
		}, startDelay);

		return () => clearTimeout(startTimer);
	}

	$effect(() => {
		if (eager) {
			if (!started) {
				started = true;
				type();
			}
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && (repeat || !started)) {
						started = true;
						type();
					}
				}
			},
			{ threshold: 0.2 }
		);
		observer.observe(node);
		return () => observer.disconnect();
	});
</script>

<span bind:this={node} class={className} aria-label={full}
	><span aria-hidden="true">{shown}</span>{#if cursor && (!done || cursorOnComplete)}<span
			class="cursor"
			class:blink={done}>█</span
		>{/if}</span
>

<style>
	span {
		white-space: pre-wrap;
	}

	.cursor {
		display: inline-block;
		margin-left: 1px;
	}

	.cursor.blink {
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}
</style>
