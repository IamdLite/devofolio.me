<script setup>
import { projects, categories, getProject } from "~/data/projects";

const route = useRoute();
const project = getProject(route.params.slug);

if (!project) {
  throw createError({ statusCode: 404, statusMessage: "Project not found", fatal: true });
}

// Optional long-form write-up in content/projects/<slug>.md
const { data: writeup } = await useAsyncData(`writeup-${project.slug}`, () =>
  // find() instead of findOne(): a missing write-up is normal, not a 404
  queryContent("projects").where({ _path: `/projects/${project.slug}` }).find().then((docs) => docs[0] ?? null)
);

const index = projects.indexOf(project);
const prev = projects[(index - 1 + projects.length) % projects.length];
const next = projects[(index + 1) % projects.length];

useHead({ title: project.title });
useSeoMeta({
  description: project.tagline,
  ogTitle: `${project.title} · iamdLite`,
  ogDescription: project.tagline,
});
</script>

<template>
  <article class="container-cy py-12">
    <nav class="mb-8 font-mono text-xs text-dim" aria-label="Breadcrumb">
      <NuxtLink to="/projects" class="hover:text-neon">~/projects</NuxtLink>
      <span class="mx-1">/</span>
      <span class="text-neon">{{ project.slug }}</span>
    </nav>

    <header class="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
      <div>
        <p class="kicker mb-3">{{ categories[project.category] }} · {{ project.year }}</p>
        <h1 class="h-display text-4xl leading-tight sm:text-5xl">{{ project.title }}</h1>
        <p class="mt-4 text-lg text-dim">{{ project.tagline }}</p>
      </div>
      <div class="flex flex-wrap gap-3 lg:justify-end">
        <a v-if="project.repo" :href="project.repo" target="_blank" rel="noopener" class="btn-ghost"><Icon name="simple-icons:github" /> Source</a>
        <a v-if="project.live" :href="project.live" target="_blank" rel="noopener" class="btn-neon"><Icon name="ph:arrow-up-right-bold" /> Visit live</a>
        <span v-if="project.private" class="chip !px-3 !py-2 !text-xs"><Icon name="ph:lock-simple-bold" /> Private repository</span>
      </div>
    </header>

    <div class="mt-10" :class="project.preview.type === 'iframe' ? 'h-[70vh] max-h-[44rem] min-h-[22rem]' : 'h-[26rem] sm:h-[30rem]'">
      <ProjectPreview :project="project" full />
    </div>

    <div class="mt-12 grid gap-10 lg:grid-cols-[1fr_18rem]">
      <div>
        <section>
          <h2 class="kicker mb-4">// highlights</h2>
          <ul class="grid gap-3">
            <li v-for="(h, i) in project.highlights" :key="h" class="flex gap-4 rounded-lg border border-line/60 bg-panel/50 p-4">
              <span class="font-mono text-sm text-neon">0{{ i + 1 }}</span>
              <span class="text-fg/90">{{ h }}</span>
            </li>
          </ul>
        </section>
        <section v-if="writeup" class="mt-12">
          <h2 class="kicker mb-2">// write-up</h2>
          <ContentRenderer :value="writeup" class="prose-cy" />
        </section>
      </div>
      <aside class="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div class="hud p-5">
          <h2 class="kicker mb-3">// stack</h2>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="s in project.stack" :key="s" class="chip">{{ s }}</span>
          </div>
        </div>
        <div class="hud p-5 font-mono text-xs">
          <h2 class="kicker mb-3">// meta</h2>
          <dl class="grid grid-cols-[5rem_1fr] gap-y-2">
            <dt class="text-dim">year</dt><dd>{{ project.year }}</dd>
            <dt class="text-dim">category</dt><dd>{{ categories[project.category] }}</dd>
            <dt class="text-dim">preview</dt><dd>{{ { iframe: "live site", demo: "interactive demo", replay: "simulated session", image: "snapshot" }[project.preview.type] }}</dd>
          </dl>
        </div>
      </aside>
    </div>

    <nav class="mt-16 grid gap-4 sm:grid-cols-2" aria-label="More projects">
      <NuxtLink :to="`/projects/${prev.slug}`" class="hud hud-hover p-5">
        <p class="font-mono text-xs text-dim">← previous</p>
        <p class="mt-1 font-semibold">{{ prev.title }}</p>
      </NuxtLink>
      <NuxtLink :to="`/projects/${next.slug}`" class="hud hud-hover p-5 text-right">
        <p class="font-mono text-xs text-dim">next →</p>
        <p class="mt-1 font-semibold">{{ next.title }}</p>
      </NuxtLink>
    </nav>
  </article>
</template>
