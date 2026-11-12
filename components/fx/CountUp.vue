<script setup>
const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: "" },
  duration: { type: Number, default: 1400 },
});

const el = ref(null);
const shown = ref(props.value);

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  shown.value = 0;
  const { stop } = useIntersectionObserver(el, ([entry]) => {
    if (!entry.isIntersecting) return;
    stop();
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / props.duration, 1);
      shown.value = Math.round(props.value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
});
</script>

<template>
  <span ref="el" class="tabular-nums">{{ shown.toLocaleString("en-US") }}{{ suffix }}</span>
</template>
