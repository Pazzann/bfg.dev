<script lang="ts">
	type Metric = 'lum' | 'white' | 'sobel' | 'combo';
	type Run = { c: string | null; t: string };

	interface Props {
		/** Image URL. Must be same-origin (or CORS-enabled) so pixels are readable. */
		src: string;
		/** Screen-reader description. The art itself is decorative. */
		alt?: string;
		/** Width of the art in characters. Higher = more detail. */
		cols?: number;
		/**
		 * How a pixel becomes ink:
		 *  lum   — darkness. Outlines go dense, flat fills stay light. Best for line art.
		 *  white — distance from white. Fills solid shapes; drops a white background.
		 *  sobel — edges only. Sketchy outline look.
		 *  combo — `white` fill plus `sobel` edges on top.
		 */
		metric?: Metric;
		/** Contrast curve on the ink value. >1 thins it out, <1 fattens it. */
		gamma?: number;
		/** Ink below this renders as a blank cell. */
		threshold?: number;
		/** Edge strength, for the sobel/combo metrics. */
		edgeGain?: number;
		/** Fill strength, for the combo metric. */
		fillGain?: number;
		/** Character ramp, lightest to densest. */
		ramp?: string;
		/** Tint each character with its source pixel. Off = inherits CSS `color`. */
		color?: boolean;
		/** Lightness floor for tinted characters, so dark pixels stay legible on black. */
		minLight?: number;
		/** Cell height ÷ width for the font. 1.667 suits a 0.6em-advance mono at line-height 1. */
		aspect?: number;
		/** Convert on mount instead of waiting to scroll into view. Use for above-the-fold art. */
		eager?: boolean;
		/** Delay (ms) between revealed lines. 0 shows the whole thing at once. */
		lineDelay?: number;
		oncomplete?: () => void;
		class?: string;
	}

	let {
		src,
		alt = '',
		cols = 100,
		metric = 'lum',
		gamma = 1,
		threshold = 0.06,
		edgeGain = 3,
		fillGain = 0.55,
		ramp = ' .:-=+*#%@',
		color = true,
		minLight = 0.42,
		aspect = 1.667,
		eager = false,
		lineDelay = 18,
		oncomplete,
		class: className = ''
	}: Props = $props();

	let lines = $state<Run[][]>([]);
	let revealed = $state(0);
	let failed = $state(false);
	let visible = $state(false);
	let node: HTMLPreElement;

	function hsl(r: number, g: number, b: number): [number, number, number] {
		r /= 255;
		g /= 255;
		b /= 255;
		const mx = Math.max(r, g, b);
		const mn = Math.min(r, g, b);
		const l = (mx + mn) / 2;
		const d = mx - mn;
		if (!d) return [0, 0, l];
		const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
		const h = (mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) / 6;
		return [h, s, l];
	}

	function rgb(h: number, s: number, l: number): [number, number, number] {
		if (!s) {
			const v = Math.round(l * 255);
			return [v, v, v];
		}
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		const f = (t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		return [Math.round(f(h + 1 / 3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1 / 3) * 255)];
	}

	// Quantised so neighbouring cells collapse into shared runs.
	const hex = (v: number) => Math.min(255, Math.round(v / 24) * 24).toString(16).padStart(2, '0');

	async function build() {
		// `decode()` can hang indefinitely for images that are never rendered
		// (background tab, art still off-screen), so wait on `load` instead.
		const img = await new Promise<HTMLImageElement>((resolve, reject) => {
			const el = new Image();
			el.crossOrigin = 'anonymous';
			el.onload = () => resolve(el);
			el.onerror = () => reject(new Error(`failed to load ${src}`));
			el.src = src;
		});

		const ss = 2; // supersample, so each cell averages a 2x2 patch
		const rows = Math.max(1, Math.round((cols * img.naturalHeight) / img.naturalWidth / aspect));
		const cv = document.createElement('canvas');
		cv.width = cols * ss;
		cv.height = rows * ss;
		const ctx = cv.getContext('2d', { willReadFrequently: true })!;
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		ctx.fillStyle = '#fff'; // flatten transparency onto white
		ctx.fillRect(0, 0, cv.width, cv.height);
		ctx.drawImage(img, 0, 0, cv.width, cv.height);

		const W = cv.width;
		const H = cv.height;
		const N = W * H;
		const d = ctx.getImageData(0, 0, W, H).data;
		const gray = new Float32Array(N);
		for (let i = 0; i < N; i++) {
			gray[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
		}

		const mag = new Float32Array(N);
		if (metric === 'sobel' || metric === 'combo') {
			let mx = 0;
			for (let y = 1; y < H - 1; y++) {
				for (let x = 1; x < W - 1; x++) {
					const i = y * W + x;
					const gx =
						-gray[i - W - 1] - 2 * gray[i - 1] - gray[i + W - 1] +
						gray[i - W + 1] + 2 * gray[i + 1] + gray[i + W + 1];
					const gy =
						-gray[i - W - 1] - 2 * gray[i - W] - gray[i - W + 1] +
						gray[i + W - 1] + 2 * gray[i + W] + gray[i + W + 1];
					const m = Math.hypot(gx, gy);
					mag[i] = m;
					if (m > mx) mx = m;
				}
			}
			if (mx > 0) for (let i = 0; i < N; i++) mag[i] /= mx;
		}

		const S3 = 255 * Math.sqrt(3);
		const out: Run[][] = [];

		for (let y = 0; y < rows; y++) {
			const runs: Run[] = [];
			for (let x = 0; x < cols; x++) {
				let sr = 0, sg = 0, sb = 0, sl = 0, sm = 0;
				for (let dy = 0; dy < ss; dy++) {
					for (let dx = 0; dx < ss; dx++) {
						const i = (y * ss + dy) * W + (x * ss + dx);
						sr += d[i * 4];
						sg += d[i * 4 + 1];
						sb += d[i * 4 + 2];
						sl += gray[i];
						sm += mag[i];
					}
				}
				const n = ss * ss;
				const R = sr / n, G = sg / n, B = sb / n, L = sl / n, M = sm / n;

				let ink: number;
				if (metric === 'lum') ink = 1 - L;
				else if (metric === 'white')
					ink = Math.hypot(255 - R, 255 - G, 255 - B) / S3;
				else if (metric === 'sobel') ink = M * edgeGain;
				else ink = Math.max((1 - L) * fillGain, M * edgeGain);

				ink = Math.pow(Math.min(1, Math.max(0, ink)), gamma);
				const ch =
					ink < threshold ? ' ' : ramp[Math.min(ramp.length - 1, Math.round(ink * (ramp.length - 1)))];

				let c: string | null = null;
				if (color && ch !== ' ') {
					const [h, s, l] = hsl(R, G, B);
					// Dark pixels (line art) carry no useful hue — lift them to a light neutral.
					const [rr, gg, bb] =
						s < 0.12
							? rgb(0, 0, minLight + 0.35 * l)
							: rgb(h, Math.min(1, s * 1.2), minLight + 0.36 * l);
					c = `#${hex(rr)}${hex(gg)}${hex(bb)}`;
				}

				const prev = runs[runs.length - 1];
				const use = ch === ' ' ? (prev ? prev.c : null) : c;
				if (prev && prev.c === use) prev.t += ch;
				else runs.push({ c: use, t: ch });
			}
			while (runs.length) {
				const last = runs[runs.length - 1];
				last.t = last.t.replace(/\s+$/, '');
				if (last.t) break;
				runs.pop();
			}
			out.push(runs);
		}
		return out;
	}

	function reveal(total: number) {
		if (!lineDelay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			revealed = total;
			oncomplete?.();
			return;
		}
		revealed = 0;
		setTimeout(function step() {
			revealed += 1;
			if (revealed >= total) {
				oncomplete?.();
				return;
			}
			setTimeout(step, lineDelay);
		}, lineDelay);
	}

	$effect(() => {
		if (eager) {
			visible = true;
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				for (const e of entries) if (e.isIntersecting) visible = true;
			},
			{ threshold: 0.05, rootMargin: '200px' }
		);
		observer.observe(node);
		return () => observer.disconnect();
	});

	// Re-runs whenever a tuning prop changes, which is what makes live tweaking work.
	$effect(() => {
		if (!visible) return;
		const params = [src, cols, metric, gamma, threshold, edgeGain, fillGain, ramp, color, minLight, aspect];
		void params;

		let stale = false;
		failed = false;
		build()
			.then((out) => {
				if (stale) return;
				lines = out;
				reveal(out.length);
			})
			.catch(() => {
				if (!stale) failed = true;
			});
		return () => {
			stale = true;
		};
	});
</script>

<!-- Markup stays on one line: stray whitespace would render inside `pre`. -->
<pre
	bind:this={node}
	class={className}
	class:mono={!color}
	role="img"
	aria-label={alt}
	style="--cols: {cols}; --rows: {lines.length || 1}"
>{#each lines as runs, i (i)}<span
			class="ln"
			class:show={i < revealed}>{#each runs as run, j (j)}{#if run.c}<span
					style="color:{run.c}">{run.t}</span
				>{:else}{run.t}{/if}{/each}</span
		>{/each}{#if failed}<span class="err">[ could not load {src} ]</span>{/if}</pre>

<style>
	pre {
		font-family: 'Fira Mono', ui-monospace, monospace;
		font-size: var(--ascii-size, 0.5rem);
		line-height: 1;
		margin: 0;
		white-space: pre;
		/* Cells are transparent, so the page background shows through. */
	}

	.ln {
		display: block;
		min-height: 1em;
		opacity: 0;
	}

	.ln.show {
		opacity: 1;
		transition: opacity 0.16s ease;
	}

	/* Monochrome mode inherits whatever `color` the caller sets. */
	.mono {
		color: currentColor;
	}

	.err {
		font-family: inherit;
		color: #ff6b6b;
	}
</style>
