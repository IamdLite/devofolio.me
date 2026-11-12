<script setup>
const props = defineProps({ error: Object });
const is404 = computed(() => props.error?.statusCode === 404);

useHead({ title: is404.value ? "404 · Signal lost" : "Error" });
</script>

<template>
  <HackerBackdrop />
  <AppHeader />
  <main id="main-content" class="container-cy grid min-h-[80vh] place-items-center pt-16">
    <div class="w-full max-w-xl text-center">
      <p class="kicker mb-4">// {{ is404 ? "connection refused" : "kernel panic" }}</p>
      <h1 class="h-display text-7xl sm:text-8xl">
        <span class="glitch is-glitching" :data-text="String(error?.statusCode ?? 500)">{{ error?.statusCode ?? 500 }}</span>
      </h1>
      <div class="hud mt-8 p-5 text-left font-mono text-sm">
        <p><span class="text-neon">guest@iamdLite</span><span class="text-dim">:~$</span> curl {{ $route.fullPath }}</p>
        <p class="text-hot">{{ is404 ? "404: this route does not exist (or it's very well hidden)." : error?.statusMessage || "Something broke." }}</p>
        <p><span class="text-neon">guest@iamdLite</span><span class="text-dim">:~$</span> <span class="blink" /></p>
      </div>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <button class="btn-neon" @click="clearError({ redirect: '/' })"><Icon name="ph:house-bold" /> Return to base</button>
        <button class="btn-ghost" @click="clearError({ redirect: '/projects' })"><Icon name="ph:cube-bold" /> Browse projects</button>
      </div>
    </div>
  </main>
  <CommandPalette />
  <TerminalOverlay />
  <WebNav />
</template>
