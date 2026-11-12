<script setup>
import { profile, socials, stats } from "~/data/profile";
import { projects } from "~/data/projects";
import { research, researchStatus } from "~/data/research";
import { timeline, timelineKinds } from "~/data/timeline";
import { toneText, toneBg, toneBorder } from "~/data/tones";

definePageMeta({
  title: "iamdLite",
  description:
    "iamdLite: red teamer and agentic-AI security researcher. I break systems so organisations can build resilient ones.",
});

const terminalOpen = useTerminalOpen();
const featured = projects.filter((p) => p.featured);
const latestResearch = research.slice(0, 4);
const recent = timeline.slice(0, 5);

// Brief glitch on the name every few seconds.
const glitching = ref(false);
let glitchTimer;
onMounted(() => {
  glitchTimer = setInterval(() => {
    glitching.value = true;
    setTimeout(() => (glitching.value = false), 350);
  }, 4500);
});
onBeforeUnmount(() => clearInterval(glitchTimer));

// The ID card alternates between my photo and an anonymous avatar.
const masked = ref(false);
const swapping = ref(false);
let swapTimer;
onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  swapTimer = setInterval(() => {
    swapping.value = true;
    setTimeout(() => (masked.value = !masked.value), 260);
    setTimeout(() => (swapping.value = false), 620);
  }, 4800);
});
onBeforeUnmount(() => clearInterval(swapTimer));
</script>

<template>
  <div>
    <!-- ───────────── Hero ───────────── -->
    <section class="container-cy grid min-h-[calc(100svh-4rem)] items-center gap-12 py-12 lg:grid-cols-[1.25fr_1fr]">
      <div>
        <p class="kicker mb-5 flex items-center gap-2">
          <span class="h-2 w-2 animate-pulse rounded-full bg-neon shadow-glow" />
          <span>connection established · <span class="whitespace-nowrap">identity masked</span></span>
        </p>
        <h1 class="h-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
          <span class="glitch" :class="{ 'is-glitching': glitching }" :data-text="profile.name">{{ profile.name }}</span>
        </h1>
        <p class="mt-4 font-mono text-lg text-ice sm:text-xl">
          <span class="text-dim">&gt;</span> <TypeWriter :phrases="profile.roles" />
        </p>
        <p class="mt-6 max-w-xl text-lg leading-relaxed text-dim">
          Beyond CTFs, I run <span class="hl">red team operations</span> against hardened infrastructure and study how
          <span class="hl">AI agents</span> get exploited where their protocols meet. I'm also a NASA-trained
          <span class="hl">open-science</span> researcher and the founder of a cybersecurity non-profit that has reached
          <span class="hl">8,000+ people</span>.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <NuxtLink to="/projects" class="btn-neon"><Icon name="ph:cube-bold" /> Explore projects</NuxtLink>
          <NuxtLink to="/journey" class="btn-ghost"><Icon name="ph:path-bold" /> My journey</NuxtLink>
          <button class="btn-ghost" @click="terminalOpen = true"><Icon name="ph:terminal-window-bold" /> Open a shell</button>
        </div>
        <div class="mt-8 flex flex-wrap items-center gap-2">
          <a
            v-for="s in socials"
            :key="s.name"
            :href="s.url"
            target="_blank"
            rel="noopener"
            :aria-label="s.name"
            :title="s.name"
            :data-scan="`NODE|${s.name}|${s.url.replace(/^https?:\/\//, '')}`"
            class="grid h-9 w-9 place-items-center rounded border border-line/70 bg-panel/50 text-dim transition hover:-translate-y-0.5 hover:border-neon/60 hover:text-neon"
          >
            <Icon :name="s.icon" size="16" />
          </a>
        </div>
      </div>

      <!-- Identity card -->
      <div class="relative mx-auto w-full max-w-sm">
        <div class="absolute -inset-6 -z-10 rounded-full bg-neon/10 blur-3xl" />
        <div class="hud overflow-hidden p-3">
          <div class="relative aspect-square overflow-hidden rounded">
            <!-- Identity swap: real photo ⇄ anonymous avatar, crossed with a glitch -->
            <div class="absolute inset-0" :class="{ 'swap-glitch': swapping }">
              <picture class="absolute inset-0 transition-opacity duration-150" :class="masked ? 'opacity-0' : 'opacity-100'">
                <source srcset="/content/avatar.webp" type="image/webp" />
                <img src="/content/avatar.jpg" alt="iamdLite smiling, arms crossed" width="512" height="512" class="h-full w-full object-cover" />
              </picture>
              <!-- Photo: Unsplash, free licence (unsplash.com/photos/UgcHo_IZIkg) -->
              <picture class="absolute inset-0 transition-opacity duration-150" :class="masked ? 'opacity-100' : 'opacity-0'">
                <source srcset="/content/anon.webp" type="image/webp" />
                <img src="/content/anon.jpg" alt="Masked figure in green smoke" width="800" height="800" class="h-full w-full object-cover" />
              </picture>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-[#04070b] via-transparent to-transparent" />
            <div class="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,156,.06)_50%)] bg-[length:100%_4px]" />
            <div class="absolute inset-x-0 h-16 animate-[scan_4s_linear_infinite] bg-gradient-to-b from-transparent via-neon/25 to-transparent" />
            <div class="absolute bottom-3 left-3 right-3 font-mono text-[11px] text-[#cfe3ee]">
              <p class="text-neon">ID: {{ masked ? "█████████" : `@${profile.handle}` }}</p>
              <p>{{ masked ? "IDENTITY: MASKED" : "CLEARANCE: red team · researcher" }}</p>
            </div>
          </div>
          <dl class="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div class="rounded border border-line/60 p-2">
              <dt class="text-dim">current op</dt>
              <dd class="text-fg">Agentic AI security</dd>
            </div>
            <div class="rounded border border-line/60 p-2">
              <dt class="text-dim">role</dt>
              <dd class="text-fg">Red Teamer</dd>
            </div>
            <div class="rounded border border-line/60 p-2">
              <dt class="text-dim">rank</dt>
              <dd class="text-fg">THM Guru</dd>
            </div>
            <div class="rounded border border-line/60 p-2">
              <dt class="text-dim">since</dt>
              <dd class="text-fg">2018 · eOfbit</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- ───────────── Stats ───────────── -->
    <section class="container-cy">
      <div class="hud grid grid-cols-2 divide-line/60 lg:grid-cols-4 lg:divide-x">
        <div v-for="s in stats" :key="s.label" class="p-5 sm:p-6">
          <p class="h-display text-3xl text-neon sm:text-4xl"><CountUp :value="s.value" :suffix="s.suffix" /></p>
          <p class="mt-1 text-sm text-dim">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- ───────────── Featured projects ───────────── -->
    <section class="container-cy mt-28">
      <SectionHeading index="01" kicker="featured work" title="Things I've built & broken" to="/projects" cta="all projects">
        Every preview below is live. Some are the real deployed sites, others are runnable demos of the system, right in your browser.
      </SectionHeading>
      <div class="grid gap-5 md:grid-cols-2">
        <ProjectCard v-for="(p, i) in featured" :key="p.slug" v-reveal="(i % 2) * 120" :project="p" :large="i < 2" />
      </div>
    </section>

    <!-- ───────────── Research ───────────── -->
    <section class="container-cy mt-28">
      <SectionHeading index="02" kicker="research" title="Questions I'm chasing" to="/research" cta="all research" />
      <div class="grid gap-4 lg:grid-cols-3">
        <NuxtLink
          v-for="(r, i) in latestResearch"
          :key="r.title"
          v-reveal="i * 100"
          :to="r.project ?? '/research'"
          class="hud hud-hover flex flex-col p-5"
          :class="i === 0 ? 'lg:col-span-3 lg:flex-row lg:items-center lg:gap-8' : ''"
        >
          <div class="flex-1">
            <div class="mb-3 flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span class="chip" :class="toneBorder[researchStatus[r.status].tone]"><span :class="toneText[researchStatus[r.status].tone]">● {{ researchStatus[r.status].label }}</span></span>
              <span class="text-dim">{{ r.year }} · {{ r.area }}</span>
            </div>
            <h3 class="h-display leading-snug" :class="i === 0 ? 'text-2xl' : 'text-lg'">{{ r.title }}</h3>
            <p class="mt-2 text-sm text-dim" :class="i === 0 ? '' : 'line-clamp-3'">{{ r.abstract }}</p>
          </div>
          <ul v-if="i === 0" class="mt-4 grid gap-2 font-mono text-xs lg:mt-0 lg:w-80">
            <li v-for="(f, j) in r.findings" :key="f" class="flex gap-2 rounded border border-hot/30 bg-hot/5 p-2 text-fg">
              <span class="text-hot">{{ "ABCD"[j] }}</span>{{ f }}
            </li>
          </ul>
        </NuxtLink>
      </div>
    </section>

    <!-- ───────────── Journey teaser + terminal ───────────── -->
    <section class="container-cy mt-28 grid gap-10 lg:grid-cols-2">
      <div>
        <SectionHeading index="03" kicker="journey" title="Recent log entries" to="/journey" cta="full timeline" />
        <ol class="relative ml-2 border-l border-line">
          <li v-for="(t, i) in recent" :key="t.title" v-reveal="i * 80" class="relative mb-6 pl-6">
            <span class="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-void" :class="toneBg[timelineKinds[t.kind].color]" />
            <p class="font-mono text-[11px] text-dim">{{ t.when }} · <span :class="toneText[timelineKinds[t.kind].color]">{{ timelineKinds[t.kind].label }}</span></p>
            <p class="font-semibold">{{ t.title }}</p>
            <p class="text-sm text-dim">{{ t.org }}</p>
          </li>
        </ol>
      </div>
      <div>
        <SectionHeading index="04" kicker="shell access" title="Prefer the command line?" />
        <CyberTerminal height="h-80" :intro="['cat about.txt', 'ls']" />
        <p class="mt-3 font-mono text-xs text-dim">try <span class="text-neon">help</span>, <span class="text-neon">tree</span>, <span class="text-neon">hack scholarion</span>, <span class="text-neon">what are your skills?</span>…</p>
      </div>
    </section>

    <!-- ───────────── CTA ───────────── -->
    <section class="container-cy mt-28">
      <div class="hud relative overflow-hidden p-8 sm:p-12">
        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-hot/10 blur-3xl" />
        <div class="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-neon/10 blur-3xl" />
        <div class="relative grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p class="kicker mb-3">// open channel</p>
            <h2 class="h-display text-3xl sm:text-4xl">Want to learn how to hack, or hire someone who does?</h2>
            <p class="mt-3 text-dim">
              Join the eOfbit Society community for free training, or send me a message about red teaming, research or speaking.
            </p>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row md:flex-col">
            <NuxtLink to="/contact" class="btn-neon"><Icon name="ph:paper-plane-tilt-bold" /> Send a transmission</NuxtLink>
            <a :href="profile.community" target="_blank" rel="noopener" class="btn-ghost"><Icon name="simple-icons:telegram" /> Join eOfbit Society</a>
            <a :href="profile.resumeUrl" target="_blank" rel="noopener" class="btn-ghost"><Icon name="ph:file-arrow-down-bold" /> Resume (PDF)</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
