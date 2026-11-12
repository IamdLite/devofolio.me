<script setup>
import { categories } from "~/data/projects";

const props = defineProps({
  project: { type: Object, required: true },
  large: { type: Boolean, default: false },
});

// Mouse-follow spotlight on the card border.
const card = ref(null);
const spot = ref({ x: -999, y: -999 });
function track(e) {
  const r = card.value.getBoundingClientRect();
  spot.value = { x: e.clientX - r.left, y: e.clientY - r.top };
}
</script>

<template>
  <article
    ref="card"
    :data-scan="`PROJECT|${project.title}|${categories[project.category]} · ${project.year} · ${project.stack.slice(0, 3).join(', ')}`"
    class="hud group relative flex flex-col overflow-hidden p-3 transition duration-300 hover:border-neon/50"
    @mousemove="track"
    @mouseleave="spot = { x: -999, y: -999 }"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      :style="{ background: `radial-gradient(400px circle at ${spot.x}px ${spot.y}px, rgb(var(--neon) / .08), transparent 45%)` }"
    />
    <!-- z-10 keeps demo controls above the card-wide title link -->
    <div class="relative z-10" :class="large ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[16/10]'">
      <ProjectPreview :project="project" class="absolute inset-0" />
    </div>
    <div class="relative flex flex-1 flex-col px-1 pb-1 pt-4">
      <div class="mb-2 flex flex-wrap items-center gap-2 font-mono text-[11px] text-dim">
        <span class="text-neon">{{ categories[project.category] }}</span>
        <span>·</span>
        <span>{{ project.year }}</span>
        <span v-if="project.private" class="chip !py-0"><Icon name="ph:lock-simple-bold" /> private repo</span>
      </div>
      <h3 class="h-display text-lg leading-snug sm:text-xl">
        <NuxtLink :to="`/projects/${project.slug}`" class="after:absolute after:inset-0 after:content-[''] hover:text-neon focus-visible:ring-0">
          {{ project.title }}
        </NuxtLink>
      </h3>
      <p class="mt-1.5 text-sm text-dim">{{ project.tagline }}</p>
      <div class="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
        <span v-for="s in project.stack.slice(0, large ? 6 : 4)" :key="s" class="chip">{{ s }}</span>
        <span class="relative z-10 ml-auto flex gap-1">
          <a v-if="project.repo" :href="project.repo" target="_blank" rel="noopener" class="grid h-8 w-8 place-items-center rounded border border-line text-dim transition hover:border-neon/60 hover:text-neon" :aria-label="`${project.title} source code`">
            <Icon name="simple-icons:github" />
          </a>
          <a v-if="project.live" :href="project.live" target="_blank" rel="noopener" class="grid h-8 w-8 place-items-center rounded border border-line text-dim transition hover:border-neon/60 hover:text-neon" :aria-label="`${project.title} live`">
            <Icon name="ph:arrow-up-right-bold" />
          </a>
        </span>
      </div>
    </div>
  </article>
</template>
