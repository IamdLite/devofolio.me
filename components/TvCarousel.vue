<script setup>
// A CRT television carousel: every item is a "channel". It changes channel on its own
// (pausing on hover/focus), and can be driven with the knob, buttons, arrow keys, swipes
// or the channel guide underneath.
const props = defineProps({
  items: { type: Array, required: true }, // { id, title, url, image, date, minutes?, excerpt?, tags? }
  interval: { type: Number, default: 7000 },
  label: { type: String, default: "Slideshow" },
});

const index = ref(0);
const switching = ref(false);
const held = ref(false); // hovered or focused: hold the current channel
const playing = ref(true);
const mounted = useMounted();
const reducedMotion = usePreferredReducedMotion();
watch(reducedMotion, (v) => v === "reduce" && (playing.value = false), { immediate: true });

const item = computed(() => props.items[index.value]);
const channel = (i) => String(i + 1).padStart(2, "0");
const fmt = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

let staticTimer;
function go(i) {
  const n = props.items.length;
  if (!n) return;
  index.value = (i + n) % n;
  if (reducedMotion.value === "reduce") return;
  switching.value = true;
  clearTimeout(staticTimer);
  staticTimer = setTimeout(() => (switching.value = false), 380);
}
const next = () => go(index.value + 1);
const prev = () => go(index.value - 1);

// Auto-advance. A timer (not the progress bar's animation, which stalls in background tabs)
// owns the timing; holding the channel keeps the time that was left.
const running = computed(() => mounted.value && playing.value && !held.value && props.items.length > 1);
let advanceTimer;
let remaining = props.interval;
let deadline = 0;
function schedule() {
  clearTimeout(advanceTimer);
  if (!running.value) return;
  deadline = Date.now() + remaining;
  advanceTimer = setTimeout(next, remaining);
}
watch(running, (on) => {
  if (on) return schedule();
  clearTimeout(advanceTimer);
  remaining = Math.max(0, deadline - Date.now());
});
watch(index, () => {
  remaining = props.interval;
  schedule();
});

// Swipe on touch screens
let startX = null;
const onPointerDown = (e) => (startX = e.clientX);
function onPointerUp(e) {
  if (startX === null) return;
  const dx = e.clientX - startX;
  startX = null;
  if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
}

// Keep the active channel visible in the guide
const guide = ref(null);
watch(index, (i) => guide.value?.children[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" }));

onBeforeUnmount(() => {
  clearTimeout(staticTimer);
  clearTimeout(advanceTimer);
});
</script>

<template>
  <section
    aria-roledescription="carousel"
    :aria-label="label"
    @mouseenter="held = true"
    @mouseleave="held = false"
    @focusin="held = true"
    @focusout="held = false"
    @keydown.left.prevent="prev"
    @keydown.right.prevent="next"
  >
    <!-- TV set -->
    <div class="relative rounded-[2rem] border border-line bg-gradient-to-b from-panel2 to-panel p-3 shadow-2xl sm:p-5">
      <div class="grid gap-4 lg:grid-cols-[1fr_8rem] lg:gap-5">
        <!-- Screen (always dark, like a real tube) -->
        <div
          class="dark relative aspect-[4/3] touch-pan-y select-none overflow-hidden rounded-[1.4rem] bg-black ring-1 ring-black sm:aspect-video"
          @pointerdown="onPointerDown"
          @pointerup="onPointerUp"
        >
          <Transition name="tv">
            <article
              v-if="item"
              :key="item.id"
              class="absolute inset-0"
              aria-roledescription="slide"
              :aria-label="`${index + 1} of ${items.length}`"
            >
              <img v-if="item.image" :src="item.image" alt="" class="tv-kenburns absolute inset-0 h-full w-full object-cover" draggable="false" />
              <div v-else class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,214,255,.25),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(0,255,156,.2),transparent_55%)]" />
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10" />
              <div class="absolute inset-x-0 bottom-0 p-5 pb-6 sm:p-8 sm:pb-9">
                <p class="mb-2 font-mono text-[11px] uppercase tracking-widest text-[#00ff9c]">
                  {{ fmt(item.date) }}<template v-if="item.minutes"> · {{ item.minutes }} min read</template>
                </p>
                <h2 class="h-display max-w-3xl text-xl leading-tight !text-white sm:text-3xl">{{ item.title }}</h2>
                <p v-if="item.excerpt" class="mt-2 line-clamp-2 hidden max-w-2xl text-sm text-white/75 sm:block">{{ item.excerpt }}</p>
                <div class="mt-4 flex flex-wrap items-center gap-2">
                  <a :href="item.url" target="_blank" rel="noopener" class="btn-neon !py-1.5" @pointerdown.stop>
                    Read article <Icon name="ph:arrow-up-right-bold" />
                  </a>
                  <span v-for="t in (item.tags ?? []).slice(0, 3)" :key="t" class="hidden rounded border border-white/20 bg-black/40 px-2 py-0.5 font-mono text-[11px] text-white/80 sm:inline">#{{ t }}</span>
                </div>
              </div>
            </article>
          </Transition>

          <!-- On-screen display -->
          <div class="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between font-mono text-xs text-[#00ff9c] [text-shadow:0_0_8px_rgba(0,255,156,.7)]">
            <span class="flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full" :class="playing ? 'animate-pulse bg-[#ff3d6e]' : 'bg-[#7f95a5]'" />
              {{ playing ? "ON AIR" : "PAUSED" }}
            </span>
            <span class="text-base font-bold">CH {{ channel(index) }}</span>
          </div>

          <!-- Tube effects -->
          <div class="tv-scanlines pointer-events-none absolute inset-0" />
          <div class="pointer-events-none absolute inset-0 rounded-[1.4rem] shadow-[inset_0_0_120px_rgba(0,0,0,.85)]" />
          <div v-show="switching" class="tv-static pointer-events-none absolute inset-0" />

          <!-- Time until the next channel -->
          <div class="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
            <div
              v-if="mounted && playing && items.length > 1"
              :key="index"
              class="tv-progress h-full bg-[#00ff9c] shadow-glow"
              :style="{ animationDuration: `${interval}ms`, animationPlayState: held ? 'paused' : 'running' }"
            />
          </div>
        </div>

        <!-- Control panel -->
        <div class="flex items-center justify-between gap-4 lg:flex-col lg:justify-start lg:gap-6 lg:py-3">
          <div class="rounded-md border border-line bg-black px-3 py-1.5 text-center font-mono text-[#00ff9c] [text-shadow:0_0_8px_rgba(0,255,156,.7)]">
            <span class="block text-[9px] uppercase tracking-widest text-[#7f95a5]">channel</span>
            <span class="text-xl font-bold tabular-nums">{{ channel(index) }}<span class="text-[#7f95a5]">/{{ channel(items.length - 1) }}</span></span>
          </div>

          <button
            class="group relative grid h-16 w-16 shrink-0 place-items-center rounded-full border border-line bg-gradient-to-br from-panel2 to-void shadow-[inset_0_2px_6px_rgba(255,255,255,.06),0_6px_14px_rgba(0,0,0,.4)] transition hover:border-neon/60"
            aria-label="Next channel"
            title="Turn to change channel"
            @click="next"
          >
            <span class="absolute inset-2 rounded-full border border-line/70 transition-transform duration-300" :style="{ transform: `rotate(${index * 36}deg)` }">
              <span class="absolute left-1/2 top-1 h-3 w-1 -translate-x-1/2 rounded-full bg-neon shadow-glow" />
            </span>
          </button>

          <div class="flex gap-1.5">
            <button class="tv-btn" aria-label="Previous article" @click="prev"><Icon name="ph:caret-left-bold" /></button>
            <button class="tv-btn" :aria-label="playing ? 'Pause slideshow' : 'Play slideshow'" :aria-pressed="playing" @click="playing = !playing">
              <Icon :name="playing ? 'ph:pause-bold' : 'ph:play-bold'" />
            </button>
            <button class="tv-btn" aria-label="Next article" @click="next"><Icon name="ph:caret-right-bold" /></button>
          </div>

          <div class="hidden grid-cols-6 gap-1.5 opacity-60 lg:grid" aria-hidden="true">
            <span v-for="n in 36" :key="n" class="h-1.5 w-1.5 rounded-full bg-void shadow-[inset_0_1px_1px_rgba(0,0,0,.6)]" />
          </div>
        </div>
      </div>
    </div>
    <!-- Stand -->
    <div class="mx-auto h-3 w-1/3 rounded-b-xl border-x border-b border-line bg-panel2" aria-hidden="true" />

    <!-- Channel guide -->
    <div class="mt-10">
      <p class="kicker mb-3">// channel guide</p>
      <ol ref="guide" class="flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:thin]">
        <li v-for="(p, i) in items" :key="p.id" class="w-56 shrink-0 snap-start">
          <button
            class="group w-full overflow-hidden rounded-lg border text-left transition"
            :class="i === index ? 'border-neon/70 shadow-glow' : 'border-line hover:border-neon/40'"
            :aria-current="i === index"
            @click="go(i)"
          >
            <span class="relative block aspect-video overflow-hidden bg-panel2">
              <img v-if="p.image" :src="p.image" alt="" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" :class="i === index ? '' : 'opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0'" />
              <span class="absolute left-2 top-2 rounded bg-black/70 px-1.5 font-mono text-[10px] text-[#00ff9c]">CH {{ channel(i) }}</span>
            </span>
            <span class="block p-3">
              <span class="line-clamp-2 text-sm font-semibold leading-snug" :class="i === index ? 'text-neon' : 'text-fg'">{{ p.title }}</span>
              <span class="mt-1 block font-mono text-[10px] text-dim">{{ fmt(p.date) }}</span>
            </span>
          </button>
        </li>
      </ol>
    </div>
  </section>
</template>
