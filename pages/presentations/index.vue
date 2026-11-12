<script setup>
definePageMeta({
  title: "Talks",
  description: "Talks, keynotes and workshops on cybersecurity, space, leadership and open science.",
});

const { data: talks } = await useAsyncData("talks", () => queryContent("/presentations").sort({ date: -1 }).find());

const parseDate = (d) => {
  const [y, m = 1, day = 1] = String(d).split("-").map(Number);
  return new Date(y, m - 1, day);
};
const years = computed(() => [...new Set((talks.value ?? []).map((t) => parseDate(t.date).getFullYear()))].sort((a, b) => b - a));
const year = ref("all");
const shown = computed(() => (talks.value ?? []).filter((t) => year.value === "all" || parseDate(t.date).getFullYear() === year.value));
const fmt = (d) => parseDate(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });
</script>

<template>
  <div class="container-cy py-14">
    <header class="mb-10 max-w-3xl">
      <p class="kicker mb-3">// ./broadcast --list</p>
      <h1 class="h-display text-4xl sm:text-5xl"><ScrambleText text="Talks & workshops" /></h1>
      <p class="mt-4 text-lg text-dim">
        Most of these decks were made less than five hours before I went on stage. Imagine what I can do with a week.
      </p>
    </header>

    <div class="mb-8 flex flex-wrap gap-1">
      <button
        v-for="y in ['all', ...years]"
        :key="y"
        class="rounded px-3 py-1.5 font-mono text-xs transition"
        :class="year === y ? 'bg-neon text-void' : 'text-dim hover:bg-panel2 hover:text-fg'"
        :aria-pressed="year === y"
        @click="year = y"
      >
        {{ y }}
      </button>
    </div>

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <a
        v-for="(t, i) in shown"
        :key="t._path"
        v-reveal="(i % 3) * 80"
        :href="t.url"
        target="_blank"
        rel="noopener"
        class="hud hud-hover group flex flex-col overflow-hidden"
      >
        <div class="relative aspect-video overflow-hidden border-b border-line/60">
          <img :src="t.cover" :alt="`Title slide: ${t.title}`" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <span class="absolute left-2 top-2 rounded bg-void/80 px-2 py-0.5 font-mono text-[10px] text-neon">{{ fmt(t.date) }}</span>
        </div>
        <div class="flex flex-1 flex-col p-4">
          <h2 class="font-semibold leading-snug group-hover:text-neon">{{ t.title }}</h2>
          <p class="mt-auto pt-3 font-mono text-xs text-dim">@ {{ t.community }}</p>
        </div>
      </a>
    </div>
  </div>
</template>
