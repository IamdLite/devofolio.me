<script setup>
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";

const paletteOpen = usePaletteOpen();
const terminalOpen = useTerminalOpen();
const matrixBoost = useMatrixBoost();

const isTyping = (e) => e.target.closest?.("input, textarea, [contenteditable]");

// Global shortcuts: ⌘/Ctrl+K palette, ` terminal, Konami code → matrix mode.
const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiPos = 0;

onKeyStroke((e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    paletteOpen.value = !paletteOpen.value;
    return;
  }
  if (isTyping(e)) return;
  if (e.key === "`") {
    e.preventDefault();
    terminalOpen.value = !terminalOpen.value;
  }
  konamiPos = e.key === konami[konamiPos] ? konamiPos + 1 : e.key === konami[0] ? 1 : 0;
  if (konamiPos === konami.length) {
    matrixBoost.value = !matrixBoost.value;
    konamiPos = 0;
  }
});

onMounted(() => {
  console.log(
    "%c ESDRAS//OS %c Looking under the hood? Respect. Press ` for a shell, or say hi: diffouo44@gmail.com",
    "background:#00ff9c;color:#04070b;font-weight:700;padding:2px 6px",
    "color:#00ff9c"
  );
});
</script>

<template>
  <a
    href="#main-content"
    class="btn-neon fixed left-1/2 top-2 z-[90] -translate-x-1/2 -translate-y-24 focus:translate-y-0"
    >Skip to main content</a
  >
  <HackerBackdrop />
  <div class="scanlines" aria-hidden="true" />
  <AppHeader />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <AppFooter />
  <CommandPalette />
  <TerminalOverlay />
  <WebNav />
  <ProfilerHud />
  <GlitchOverlay />
</template>
