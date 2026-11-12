<script setup>
import { projects, categories } from "~/data/projects";

definePageMeta({
  title: "Projects",
  description: "Offensive security, agentic-AI research, cloud infrastructure and products, each with a live preview or runnable demo.",
});

const route = useRoute();
const router = useRouter();
const filter = ref(categories[route.query.c] ? route.query.c : "all");
const query = ref("");

watch(filter, (c) => router.replace({ query: c === "all" ? {} : { c } }));

const counts = computed(() =>
  Object.fromEntries(Object.keys(categories).map((c) => [c, c === "all" ? projects.length : projects.filter((p) => p.category === c).length]))
);

const visible = computed(() => {
  const q = query.value.trim().toLowerCase();
  return projects.filter(
    (p) =>
      (filter.value === "all" || p.category === filter.value) &&
      (!q || `${p.title} ${p.tagline} ${p.stack.join(" ")}`.toLowerCase().includes(q))
  );
});
</script>

<template>
  <div class="container-cy py-14">
    <header class="mb-10 max-w-3xl">
      <p class="kicker mb-3">// ls ~/projects</p>
      <h1 class="h-display text-4xl sm:text-5xl"><ScrambleText text="Projects lab" /></h1>
      <p class="mt-4 text-lg text-dim">
        Every card is a preview you can use. <span class="text-neon">LIVE</span> cards embed the deployed site,
        <span class="text-ice">INTERACTIVE</span> ones are runnable demos of the system,
        <span class="text-warn">REPLAY</span> ones are simulated sessions.
      </p>
    </header>

    <div class="sticky top-16 z-30 -mx-4 mb-8 border-y border-line/50 bg-void/80 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-lg sm:border">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div class="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible" role="tablist" aria-label="Filter projects">
          <button
            v-for="(label, key) in categories"
            :key="key"
            role="tab"
            :aria-selected="filter === key"
            class="shrink-0 rounded px-3 py-1.5 font-mono text-xs transition"
            :class="filter === key ? 'bg-neon text-void' : 'text-dim hover:bg-panel2 hover:text-fg'"
            @click="filter = key"
          >
            {{ label }} <span class="opacity-60">{{ counts[key] }}</span>
          </button>
        </div>
        <label class="relative lg:ml-auto lg:w-64 lg:shrink-0">
          <Icon name="ph:magnifying-glass-bold" class="absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
          <input v-model="query" class="input-cy !pl-9" placeholder="grep stack, e.g. python" aria-label="Search projects" />
        </label>
      </div>
    </div>

    <TransitionGroup tag="div" class="grid gap-5 md:grid-cols-2" move-class="transition duration-500" enter-from-class="opacity-0 scale-95" enter-active-class="transition duration-300" leave-active-class="hidden">
      <ProjectCard v-for="p in visible" :key="p.slug" :project="p" />
    </TransitionGroup>
    <p v-if="!visible.length" class="py-16 text-center font-mono text-dim">grep: no matches. try another keyword.</p>

    <p class="mt-16 text-center font-mono text-sm text-dim">
      older experiments live on <a href="https://github.com/IamdLite" target="_blank" rel="noopener" class="link-cy text-fg">github.com/IamdLite</a>
    </p>
  </div>
</template>
