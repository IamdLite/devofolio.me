<script setup>
import { profile, socials } from "~/data/profile";

const terminalOpen = useTerminalOpen();
const year = new Date().getFullYear();
</script>

<template>
  <footer class="mt-24 border-t border-line/70 bg-void/60 backdrop-blur print:hidden">
    <div class="container-cy grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        <p class="kicker mb-3">// end of transmission</p>
        <p class="max-w-sm text-dim">
          Got a target, a research idea or a meme? My inbox is open.
        </p>
        <a :href="`mailto:${profile.email}`" class="link-cy mt-3 inline-block font-mono text-sm text-fg">{{ profile.email }}</a>
        <div class="mt-5 flex flex-wrap gap-2">
          <a
            v-for="s in socials"
            :key="s.name"
            :href="s.url"
            target="_blank"
            rel="noopener"
            :aria-label="s.name"
            :title="s.name"
            :data-scan="`NODE|${s.name}|${s.url.replace(/^https?:\/\//, '')}`"
            class="grid h-9 w-9 place-items-center rounded border border-line bg-panel/60 text-dim transition hover:border-neon/60 hover:text-neon"
          >
            <Icon :name="s.icon" size="16" />
          </a>
        </div>
      </div>
      <div>
        <p class="kicker mb-3">// navigate</p>
        <ul class="grid gap-1.5 font-mono text-sm">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink :to="link.to" class="text-dim transition hover:text-neon">./{{ link.label.toLowerCase() }}</NuxtLink>
          </li>
        </ul>
      </div>
      <div>
        <p class="kicker mb-3">// shortcuts</p>
        <ul class="grid gap-2 font-mono text-xs text-dim">
          <li><kbd class="rounded border border-line px-1.5 py-0.5">⌘/Ctrl K</kbd> command palette</li>
          <li><kbd class="rounded border border-line px-1.5 py-0.5">`</kbd> terminal</li>
          <li><kbd class="rounded border border-line px-1.5 py-0.5">Q</kbd> scan mode</li>
          <li><kbd class="rounded border border-line px-1.5 py-0.5">konami code</kbd> ???</li>
        </ul>
        <button class="btn-ghost mt-4 !text-xs" @click="terminalOpen = true">
          <Icon name="ph:terminal-window-bold" /> open shell
        </button>
      </div>
    </div>
    <div class="border-t border-line/50">
      <div class="container-cy flex flex-col items-center justify-between gap-2 py-4 font-mono text-[11px] text-dim sm:flex-row">
        <span>© {{ year }} {{ profile.name }} · built with Nuxt, Tailwind & too much coffee</span>
        <span class="flex items-center gap-2"><span class="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" /> all systems nominal</span>
      </div>
    </div>
  </footer>
</template>
