<script setup>
definePageMeta({
  title: "Projects",
  description: "Discover my projects",
});

// Fetch all featured projects
const { pending, data: allProjects } = await useLazyAsyncData("projects", () =>
  queryContent("/projects")
    .where({ title: { $ne: "More" } })
    .find()
);
</script>

<!-- Projects Page -->
<template>
  <article>
    <h1 class="mb-4 text-3xl font-bold text-left">My Projects</h1>
    <p class="mb-6 text-zinc-700 dark:text-zinc-300">
      The list is not exhaustive! Just that there are many projects I haven't yet completed. When I do, 'will sure add 'em up here.
    </p>
    <!-- Featured Projects -->
    <section
      class="grid grid-cols-1 grid-rows-2 gap-4 mb-10 lg:grid-cols-2 lg:grid-flow-row"
    >
      <template v-if="pending">
        <app-project-skeleton
          v-for="skeletonId in generateKeys(5)"
          :key="skeletonId"
        />
      </template>
      <template v-else>
        <app-project-card
          v-for="project in allProjects"
          :key="project.title"
          :icon="project.icon"
          :project-title="project.title"
          :project-description="project.description"
          :project-url="project._path"
        />
      </template>
    </section>
    <!-- Link to More Projects -->
    <nuxt-link
      to="/projects/more"
      class="flex items-center justify-center w-24 py-2 font-semibold no-underline duration-150 bg-blue-500 rounded-md focus-visible:global-focus text-zinc-800 group/hover-effect"
      >hacking
      <Icon
        name="heroicons:chevron-right-20-solid"
        class="ml-1 group-hover/hover-effect:translate-x-1"
      />
    </nuxt-link>
  </article>
</template>
