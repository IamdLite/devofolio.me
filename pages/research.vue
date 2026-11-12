<script setup>
import { research, researchStatus } from "~/data/research";
import { profile } from "~/data/profile";
import { toneText, toneBorder } from "~/data/tones";

definePageMeta({
  title: "Research",
  description: "Agentic-AI security, social engineering, secure code, evolutionary computing and space systems research by iamdLite.",
});

const areas = ["All", ...new Set(research.map((r) => r.area))];
const area = ref("All");
const shown = computed(() => (area.value === "All" ? research : research.filter((r) => r.area === area.value)));
const open = ref(research[0].title);
</script>

<template>
  <div class="container-cy py-14">
    <header class="mb-12 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
      <div>
        <p class="kicker mb-3">// cat ~/research/*</p>
        <h1 class="h-display text-4xl sm:text-5xl"><ScrambleText text="Research & papers" /></h1>
        <p class="mt-4 text-lg text-dim">
          I study where systems fail when they're combined: AI agents across protocols, people across organisations, code across
          authors. I'm a NASA-trained open-science researcher (TOPS Open Science 101).
        </p>
      </div>
      <a :href="profile.orcid" target="_blank" rel="noopener" class="hud hud-hover flex items-center gap-4 p-5">
        <Icon name="simple-icons:orcid" size="36" class="text-[#a6ce39]" />
        <span>
          <span class="block font-semibold">ORCID profile</span>
          <span class="font-mono text-xs text-dim">0009-0003-6958-9159</span>
        </span>
        <Icon name="ph:arrow-up-right-bold" class="ml-auto text-neon" />
      </a>
    </header>

    <div class="mb-8 flex flex-wrap gap-1">
      <button
        v-for="a in areas"
        :key="a"
        class="rounded px-3 py-1.5 font-mono text-xs transition"
        :class="area === a ? 'bg-neon text-void' : 'text-dim hover:bg-panel2 hover:text-fg'"
        :aria-pressed="area === a"
        @click="area = a"
      >
        {{ a }}
      </button>
    </div>

    <ol class="grid gap-4">
      <li v-for="(r, i) in shown" :key="r.title" v-reveal="i * 60" class="hud transition hover:border-neon/40">
        <button class="flex w-full items-start gap-4 p-5 text-left sm:p-6" :aria-expanded="open === r.title" @click="open = open === r.title ? '' : r.title">
          <span class="hidden w-14 shrink-0 font-mono text-2xl font-bold text-line sm:block">{{ String(research.indexOf(r) + 1).padStart(2, "0") }}</span>
          <span class="flex-1">
            <span class="mb-2 flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span class="chip" :class="toneBorder[researchStatus[r.status].tone]"><span :class="toneText[researchStatus[r.status].tone]">● {{ researchStatus[r.status].label }}</span></span>
              <span class="text-dim">{{ r.year }} · {{ r.venue }} · {{ r.area }}</span>
            </span>
            <span class="h-display block text-lg leading-snug sm:text-xl">{{ r.title }}</span>
          </span>
          <Icon name="ph:caret-down-bold" class="mt-1 shrink-0 text-dim transition" :class="open === r.title ? 'rotate-180 text-neon' : ''" />
        </button>
        <div v-if="open === r.title" class="border-t border-line/60 px-5 pb-6 pt-4 sm:pl-24 sm:pr-6">
          <p class="text-dim">{{ r.abstract }}</p>
          <ul v-if="r.findings.length" class="mt-4 grid gap-2 sm:grid-cols-2">
            <li v-for="(f, j) in r.findings" :key="f" class="flex gap-2 rounded border border-hot/30 bg-hot/5 p-3 text-sm">
              <span class="font-mono text-hot">{{ "ABCD"[j] }}</span>{{ f }}
            </li>
          </ul>
          <div class="mt-5 flex flex-wrap gap-2">
            <NuxtLink v-if="r.project" :to="r.project" class="btn-neon !py-1.5 !text-xs"><Icon name="ph:play-bold" /> Interactive demo</NuxtLink>
            <a v-for="l in r.links" :key="l.url" :href="l.url" target="_blank" rel="noopener" class="btn-ghost !py-1.5 !text-xs"><Icon :name="l.icon" /> {{ l.label }}</a>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>
