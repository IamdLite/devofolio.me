<script setup>
const { isDark, toggleTheme } = useTheme();
// The server always renders dark; Vue keeps mismatched attributes on hydration, so
// report dark until mounted, then switch to the stored preference.
const mounted = useMounted();
const dark = computed(() => !mounted.value || isDark.value);
</script>

<!-- Theme toggle: cyber night ⇄ daylight ops -->
<template>
  <button
    class="grid h-9 w-9 place-items-center rounded border border-line bg-panel/60 text-dim transition hover:border-neon/60 hover:text-neon"
    :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'"
    :title="dark ? 'Daylight ops' : 'Cyber night'"
    @click="toggleTheme"
  >
    <Icon :name="dark ? 'ph:sun-bold' : 'ph:moon-stars-bold'" size="18" />
  </button>
</template>
