<script setup>
defineProps({
  index: { type: String, default: "" },
  kicker: { type: String, default: "" },
  title: { type: String, required: true },
  to: { type: String, default: "" },
  cta: { type: String, default: "view all" },
});
</script>

<template>
  <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      <p class="kicker mb-2">
        <span v-if="index" class="text-dim">{{ index }} //</span> {{ kicker }}
      </p>
      <h2 class="h-display text-3xl sm:text-4xl">
        <ScrambleText :text="title" />
      </h2>
      <p v-if="$slots.default" class="mt-3 max-w-2xl text-dim"><slot /></p>
    </div>
    <NuxtLink v-if="to" :to="to" class="group inline-flex items-center gap-1 font-mono text-sm text-dim transition hover:text-neon">
      {{ cta }} <Icon name="ph:arrow-right-bold" class="transition group-hover:translate-x-1" />
    </NuxtLink>
  </div>
</template>
