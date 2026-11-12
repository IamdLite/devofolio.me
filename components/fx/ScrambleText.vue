<script setup>
// Decrypts text from random glyphs when it first enters the viewport (and again on hover).
const props = defineProps({
  text: { type: String, required: true },
  tag: { type: String, default: "span" },
});

const el = ref(null);
const shown = ref(props.text);
const glyphs = "!<>-_\\/[]{}—=+*^?#01";
let raf;

function scramble() {
  cancelAnimationFrame(raf);
  const target = props.text;
  const start = performance.now();
  const duration = Math.min(900, 30 * target.length + 300);
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const revealed = Math.floor(progress * target.length);
    shown.value = target
      .split("")
      .map((ch, i) => (i < revealed || ch === " " ? ch : glyphs[(Math.random() * glyphs.length) | 0]))
      .join("");
    if (progress < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { stop } = useIntersectionObserver(el, ([entry]) => {
    if (entry.isIntersecting) {
      scramble();
      stop();
    }
  });
});
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <component :is="tag" ref="el" :aria-label="text" @mouseenter="scramble">
    <span aria-hidden="true">{{ shown }}</span>
  </component>
</template>
