<script setup>
// A short burst of colour bands on every page change (and when a hack lands).
const route = useRoute();
const pulse = useGlitchPulse();
const burst = ref(0);
const bands = ref([]);
const reducedMotion = usePreferredReducedMotion();
const colors = ["#00ff9c", "#ff3d6e", "#38d6ff", "#ffd23f", "#ffffff"];

function fire() {
  if (reducedMotion.value === "reduce") return;
  bands.value = Array.from({ length: 7 }, () => ({
    top: Math.random() * 100,
    height: 0.6 + Math.random() * 5,
    left: Math.random() * 30,
    width: 30 + Math.random() * 70,
    color: colors[(Math.random() * colors.length) | 0],
  }));
  burst.value++;
}

watch(() => route.path, () => pulse.value++);
watch(pulse, fire);
</script>

<template>
  <div v-if="burst" :key="burst" class="glitch-flash pointer-events-none fixed inset-0 z-[80] mix-blend-screen" aria-hidden="true">
    <span
      v-for="(b, i) in bands"
      :key="i"
      class="absolute opacity-70"
      :style="{ top: `${b.top}%`, height: `${b.height}%`, left: `${b.left}%`, width: `${b.width}%`, background: b.color }"
    />
  </div>
</template>
