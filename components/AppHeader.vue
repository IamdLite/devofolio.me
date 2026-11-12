<script setup>
import { profile } from "~/data/profile";

// Slim top bar. Page navigation lives in the spider-web map (WebNav), opened from here.
const route = useRoute();
const paletteOpen = usePaletteOpen();
const terminalOpen = useTerminalOpen();
const webOpen = useWebNavOpen();
const scrolled = ref(false);
const progress = ref(0);

onMounted(() => {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrolled.value = window.scrollY > 8;
    progress.value = max > 0 ? window.scrollY / max : 0;
  };
  onScroll();
  useEventListener(window, "scroll", onScroll, { passive: true });
});

const here = computed(() => (route.path === "/" ? "~" : `~${route.path}`));
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 print:hidden"
    :class="scrolled ? 'border-line/70 bg-void/80 backdrop-blur-xl' : 'border-transparent'"
  >
    <div class="container-cy flex h-16 items-center gap-3">
      <!-- Logo -->
      <NuxtLink to="/" class="group flex items-center gap-2 font-mono text-sm font-bold" aria-label="Home">
        <span class="grid h-8 w-8 place-items-center rounded border border-neon/50 bg-neon/10 text-neon transition group-hover:shadow-glow">&gt;_</span>
        <span class="hidden sm:inline">
          <span class="text-fg">{{ profile.handle }}</span><span class="text-neon blink"></span>
        </span>
      </NuxtLink>

      <!-- Opens the navigation web -->
      <button
        class="group mx-auto flex min-w-0 items-center gap-2 rounded-full border border-neon/40 bg-neon/5 py-1.5 pl-2 pr-3 font-mono text-xs text-neon transition hover:bg-neon/10 hover:shadow-glow"
        aria-label="Open navigation map"
        :aria-expanded="webOpen"
        @click="webOpen = true"
      >
        <span class="relative grid h-6 w-6 place-items-center rounded-full border border-neon/50">
          <span class="absolute inset-0 animate-ping rounded-full border border-neon/40" />
          <Icon name="ph:graph-bold" />
        </span>
        <span class="truncate">{{ here }}</span>
        <Icon name="ph:caret-down-bold" class="shrink-0 opacity-60 transition group-hover:translate-y-0.5" />
      </button>

      <div class="flex items-center gap-2">
        <button
          class="hidden items-center gap-2 rounded border border-line bg-panel/60 px-2.5 py-1.5 font-mono text-xs text-dim transition hover:border-neon/60 hover:text-neon md:flex"
          aria-label="Open command palette"
          @click="paletteOpen = true"
        >
          <Icon name="ph:magnifying-glass-bold" />
          <kbd class="rounded border border-line px-1 text-[10px]">⌘K</kbd>
        </button>
        <button
          class="grid h-9 w-9 place-items-center rounded border border-line bg-panel/60 text-dim transition hover:border-neon/60 hover:text-neon"
          aria-label="Open terminal"
          title="Terminal ( ` )"
          @click="terminalOpen = true"
        >
          <Icon name="ph:terminal-window-bold" size="18" />
        </button>
        <AppThemeToggle />
        <NuxtLink to="/contact" class="btn-neon hidden !py-1.5 lg:inline-flex">
          <Icon name="ph:paper-plane-tilt-bold" /> Contact
        </NuxtLink>
      </div>
    </div>

    <!-- Scroll progress -->
    <div class="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-neon via-ice to-hot" :style="{ transform: `scaleX(${progress})` }" />
  </header>
</template>
