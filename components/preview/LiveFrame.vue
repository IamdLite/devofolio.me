<script setup>
// Embeds a live site, rendered at a desktop viewport and scaled to fit the container.
const props = defineProps({
  url: { type: String, required: true },
  title: { type: String, default: "Live preview" },
  interactive: { type: Boolean, default: false },
  viewport: { type: Number, default: 1280 },
});

const box = ref(null);
const { width, height } = useElementSize(box);
const seen = ref(false);
const loaded = ref(false);
// Never upscale: narrow viewports (tablet/mobile) render at 1:1 and are centred.
const scale = computed(() => (width.value ? Math.min(1, width.value / props.viewport) : 0.3));
const offset = computed(() => Math.max(0, (width.value - props.viewport * scale.value) / 2));

onMounted(() => {
  // Only start loading the site once the preview scrolls near the viewport.
  const { stop } = useIntersectionObserver(
    box,
    ([entry]) => {
      if (entry.isIntersecting) {
        seen.value = true;
        stop();
      }
    },
    { rootMargin: "200px" }
  );
});
</script>

<template>
  <div ref="box" class="relative h-full w-full overflow-hidden bg-[#03060a]">
    <iframe
      v-if="seen"
      :src="url"
      :title="title"
      loading="lazy"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      referrerpolicy="no-referrer"
      class="absolute left-0 top-0 origin-top-left border-0 bg-white transition-opacity duration-500"
      :class="[loaded ? 'opacity-100' : 'opacity-0', interactive ? '' : 'pointer-events-none']"
      :style="{ width: `${viewport}px`, height: `${height / scale}px`, transform: `translateX(${offset}px) scale(${scale})` }"
      :tabindex="interactive ? 0 : -1"
      @load="loaded = true"
    />
    <div v-if="!loaded" class="absolute inset-0 grid place-items-center font-mono text-xs text-dim">
      <span class="flex items-center gap-2"><Icon name="svg-spinners:bars-scale-fade" class="text-neon" /> establishing uplink…</span>
    </div>
  </div>
</template>
