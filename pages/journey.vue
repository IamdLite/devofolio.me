<script setup>
import { timeline, timelineKinds } from "~/data/timeline";
import { profile, certifications } from "~/data/profile";
import { toneText, toneBg, toneBorder } from "~/data/tones";

definePageMeta({
  title: "Journey",
  description: "iamdLite's resume as a timeline: penetration testing, research, education, awards and leadership since 2018.",
});

const active = ref(new Set(Object.keys(timelineKinds)));
const toggle = (k) => {
  const s = new Set(active.value);
  if (s.has(k) && s.size > 1) s.delete(k);
  else s.add(k);
  active.value = s;
};
const only = (k) => (active.value = new Set([k]));
const sorted = [...timeline].sort((a, b) => b.date.localeCompare(a.date));
const entries = computed(() => sorted.filter((t) => active.value.has(t.kind)));

const yearOf = (t) => t.date.slice(0, 4);
const firstOfYear = (i) => i === 0 || yearOf(entries.value[i]) !== yearOf(entries.value[i - 1]);
const isExternal = (link) => /^https?:/.test(link);

// ── Scroll-driven flow: the rail fills and the entry under the reading line lights up ──
const list = ref(null);
const cards = ref([]);
const fill = ref(0);
const current = ref(-1);
const currentYear = computed(() => (current.value >= 0 ? yearOf(entries.value[current.value]) : yearOf(sorted[0])));

function sync() {
  if (!list.value) return;
  const line = window.innerHeight * 0.5;
  const rect = list.value.getBoundingClientRect();
  fill.value = Math.min(1, Math.max(0, (line - rect.top) / rect.height));
  let idx = -1;
  cards.value.forEach((el, i) => {
    if (el && el.getBoundingClientRect().top < line) idx = i;
  });
  current.value = idx;
}

let frame = 0;
const onScroll = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(sync);
};
onMounted(() => {
  sync();
  useEventListener(window, "scroll", onScroll, { passive: true });
  useEventListener(window, "resize", onScroll, { passive: true });
});
watch(entries, () => {
  cards.value = [];
  nextTick(sync);
});

// ── Autoplay: walks through the entries until the visitor takes over ──
const playing = ref(false);
const reducedMotion = usePreferredReducedMotion();
let timer;
function stop() {
  playing.value = false;
  clearTimeout(timer);
}
function play() {
  if (playing.value) return stop();
  playing.value = true;
  let i = current.value < 0 || current.value >= entries.value.length - 1 ? 0 : current.value + 1;
  const step = () => {
    if (!playing.value) return;
    if (i >= entries.value.length) return stop();
    cards.value[i]?.scrollIntoView({ behavior: reducedMotion.value === "reduce" ? "auto" : "smooth", block: "center" });
    i++;
    timer = setTimeout(step, 3000);
  };
  step();
}
onMounted(() => {
  // Any manual scroll or key press hands control back to the visitor.
  useEventListener(window, ["wheel", "touchstart", "keydown"], () => playing.value && stop(), { passive: true });
});
onBeforeUnmount(() => {
  stop();
  cancelAnimationFrame(frame);
});
</script>

<template>
  <div class="container-cy py-14">
    <header class="mb-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
      <div>
        <p class="kicker mb-3">// git log --author=<span class="normal-case">{{ profile.handle }}</span></p>
        <h1 class="h-display text-4xl sm:text-5xl"><ScrambleText text="The journey so far" /></h1>
        <p class="mt-4 text-lg text-dim">
          From founding a cybersecurity non-profit in 2018 to penetration testing and social-engineering research. This is my resume as a
          timeline: scroll through it, or press play and let it run.
        </p>
      </div>
      <div class="flex flex-wrap gap-3 lg:justify-end">
        <a :href="profile.resumeUrl" target="_blank" rel="noopener" class="btn-neon"><Icon name="ph:file-arrow-down-bold" /> Resume PDF</a>
        <a :href="profile.certificatesUrl" target="_blank" rel="noopener" class="btn-ghost"><Icon name="ph:certificate-bold" /> Certificates</a>
      </div>
    </header>

    <div class="sticky top-16 z-30 -mx-4 mb-10 border-y border-line/50 bg-void/80 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-lg sm:border">
      <div class="flex items-center gap-3">
        <div class="-mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto px-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible">
          <button
            v-for="(k, key) in timelineKinds"
            :key="key"
            class="flex shrink-0 items-center gap-2 rounded border px-3 py-1.5 font-mono text-xs transition"
            :class="active.has(key) ? [toneBorder[k.color], toneText[k.color]] : 'border-line text-dim opacity-60'"
            :aria-pressed="active.has(key)"
            :title="`Toggle ${k.label} · double-click to isolate`"
            @click="toggle(key)"
            @dblclick="only(key)"
          >
            <Icon :name="k.icon" /> {{ k.label }}
          </button>
        </div>
        <span class="hidden font-mono text-2xl font-bold tabular-nums text-neon sm:block" aria-live="polite">{{ currentYear }}</span>
        <button class="btn-ghost shrink-0 !px-3 !py-1.5 !text-xs" :aria-pressed="playing" @click="play">
          <Icon :name="playing ? 'ph:pause-bold' : 'ph:play-bold'" /> {{ playing ? "Pause" : "Play" }}
        </button>
      </div>
      <div class="absolute inset-x-0 bottom-0 h-px bg-line/40">
        <div class="h-full origin-left bg-neon shadow-glow" :style="{ transform: `scaleX(${fill})` }" />
      </div>
    </div>

    <ol ref="list" class="relative">
      <!-- Rail: a dim track, the part already travelled, and pulses flowing down it -->
      <div class="absolute bottom-0 left-[4.5rem] top-0 w-px bg-line/60 sm:left-[7.5rem] md:left-1/2" aria-hidden="true">
        <div class="absolute inset-x-0 top-0 bg-gradient-to-b from-neon via-ice to-neon shadow-glow" :style="{ height: `${fill * 100}%` }">
          <span class="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-neon shadow-glow" />
        </div>
        <span class="rail-pulse" />
        <span class="rail-pulse [animation-delay:-3s]" />
      </div>

      <li v-for="(t, i) in entries" :key="t.title + t.date" class="relative">
        <p v-if="firstOfYear(i)" class="relative z-10 mb-6 mt-2 w-16 font-mono text-sm font-bold sm:w-28 md:mx-auto md:w-auto md:text-center">
          <span class="rounded border bg-void px-2 py-0.5 transition-colors duration-500" :class="i <= current ? 'border-neon/60 text-neon' : 'border-line text-dim'">
            {{ yearOf(t) }}
          </span>
        </p>
        <div class="relative mb-8 grid grid-cols-[4.5rem_1fr] sm:grid-cols-[7.5rem_1fr] md:grid-cols-2 md:gap-12">
          <span class="absolute left-[4.5rem] top-5 z-10 -translate-x-1/2 sm:left-[7.5rem] md:left-1/2">
            <span v-if="i === current" class="absolute inset-0 animate-ping rounded-full" :class="toneBg[timelineKinds[t.kind].color]" />
            <span
              class="relative block h-3 w-3 rounded-full ring-4 ring-void transition duration-500"
              :class="[toneBg[timelineKinds[t.kind].color], i === current ? 'scale-150' : i < current ? '' : 'opacity-40']"
            />
          </span>
          <p class="pr-4 pt-3.5 text-right font-mono text-[11px] transition-colors duration-500 md:pr-0" :class="[i % 2 ? 'md:order-2 md:text-left' : '', i <= current ? 'text-fg' : 'text-dim']">
            {{ t.when }}
          </p>
          <div
            :ref="(el) => (cards[i] = el)"
            v-reveal
            :data-from="i % 2 ? 'left' : 'right'"
            :data-scan="`${timelineKinds[t.kind].label.toUpperCase()}|${t.title}|${t.when}`"
            class="hud ml-5 p-5 transition duration-500 md:ml-0"
            :class="[i % 2 ? 'md:order-1' : '', i === current ? 'border-neon/60 shadow-glow' : '']"
          >
            <p class="mb-1 flex items-center gap-1.5 font-mono text-[11px]" :class="toneText[timelineKinds[t.kind].color]">
              <Icon :name="timelineKinds[t.kind].icon" /> {{ timelineKinds[t.kind].label }}
            </p>
            <h2 class="text-lg font-semibold leading-snug">{{ t.title }}</h2>
            <p class="text-sm text-ice">{{ t.org }}</p>
            <ul v-if="t.points.length" class="mt-3 space-y-1.5 text-sm text-dim">
              <li v-for="p in t.points" :key="p" class="flex gap-2"><span class="text-neon">›</span>{{ p }}</li>
            </ul>
            <NuxtLink
              v-if="t.link"
              :to="t.link"
              :target="isExternal(t.link) ? '_blank' : undefined"
              class="mt-3 inline-flex items-center gap-1 font-mono text-xs text-neon hover:underline"
            >
              {{ isExternal(t.link) ? "visit" : "read more" }} <Icon :name="isExternal(t.link) ? 'ph:arrow-up-right-bold' : 'ph:arrow-right-bold'" />
            </NuxtLink>
          </div>
        </div>
      </li>
    </ol>

    <section class="mt-20">
      <SectionHeading kicker="credentials" title="Certifications">
        Professional certifications from my current resume. The full set lives in the
        <a :href="profile.certificatesUrl" target="_blank" rel="noopener" class="link-cy">certificates folder</a>.
      </SectionHeading>
      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="(c, i) in certifications" :key="c.name" v-reveal="(i % 3) * 80">
          <a :href="c.url" target="_blank" rel="noopener" class="hud hud-hover group flex h-full items-start gap-3 p-4">
            <Icon name="ph:seal-check-bold" class="mt-0.5 shrink-0 text-neon" size="20" />
            <span class="flex-1">
              <span class="block text-sm font-semibold group-hover:text-neon">{{ c.name }}</span>
              <span class="font-mono text-xs text-dim">{{ c.issuer }}</span>
            </span>
            <Icon name="ph:arrow-up-right-bold" class="shrink-0 text-dim group-hover:text-neon" />
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
