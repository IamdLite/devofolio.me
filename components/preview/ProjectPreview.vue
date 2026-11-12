<script setup>
// Window chrome around a project's preview: live iframe, interactive demo, scripted replay or image.
const props = defineProps({
  project: { type: Object, required: true },
  full: { type: Boolean, default: false },
});

const demos = {
  DemoSeamAttack: defineAsyncComponent(() => import("~/components/demos/DemoSeamAttack.vue")),
  DemoSocPipeline: defineAsyncComponent(() => import("~/components/demos/DemoSocPipeline.vue")),
  DemoScholarion: defineAsyncComponent(() => import("~/components/demos/DemoScholarion.vue")),
  DemoGeahancer: defineAsyncComponent(() => import("~/components/demos/DemoGeahancer.vue")),
  DemoHpa: defineAsyncComponent(() => import("~/components/demos/DemoHpa.vue")),
};

const preview = computed(() => props.project.preview);
const viewports = { desktop: 1280, tablet: 820, mobile: 400 };
const device = ref("desktop");

const badge = computed(
  () =>
    ({
      iframe: { label: "LIVE", cls: "text-neon border-neon/50 bg-neon/10" },
      demo: { label: "INTERACTIVE", cls: "text-ice border-ice/50 bg-ice/10" },
      replay: { label: "REPLAY", cls: "text-warn border-warn/50 bg-warn/10" },
      image: { label: "SNAPSHOT", cls: "text-dim border-line bg-panel2" },
    })[preview.value.type]
);

const address = computed(() => {
  if (preview.value.type === "iframe") return preview.value.url.replace(/^https?:\/\//, "");
  return `iamdlite://lab/${props.project.slug}`;
});
</script>

<template>
  <div class="dark flex h-full flex-col overflow-hidden rounded-lg border border-line bg-[#03060a]">
    <!-- Window chrome -->
    <div class="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2">
      <span class="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span class="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span class="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      <span class="ml-2 flex min-w-0 flex-1 items-center gap-1.5 truncate rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-[#7f95a5]">
        <Icon name="ph:lock-simple-bold" class="shrink-0 text-neon/80" />
        <span class="truncate">{{ address }}</span>
      </span>
      <template v-if="full && preview.type === 'iframe'">
        <button
          v-for="(w, name) in viewports"
          :key="name"
          class="hidden h-6 w-6 place-items-center rounded text-[#7f95a5] hover:text-neon sm:grid"
          :class="device === name ? '!text-neon bg-white/5' : ''"
          :aria-label="`${name} viewport`"
          :aria-pressed="device === name"
          @click="device = name"
        >
          <Icon :name="{ desktop: 'ph:desktop-bold', tablet: 'ph:device-tablet-bold', mobile: 'ph:device-mobile-bold' }[name]" />
        </button>
        <a :href="preview.url" target="_blank" rel="noopener" class="grid h-6 w-6 place-items-center rounded text-[#7f95a5] hover:text-neon" aria-label="Open live site in new tab">
          <Icon name="ph:arrow-square-out-bold" />
        </a>
      </template>
      <span class="shrink-0 rounded border px-1.5 py-px font-mono text-[9px] font-bold tracking-widest" :class="badge.cls">
        <span v-if="preview.type === 'iframe'" class="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-neon align-middle" />{{ badge.label }}
      </span>
    </div>

    <!-- Body -->
    <div class="relative min-h-0 flex-1">
      <LiveFrame
        v-if="preview.type === 'iframe'"
        :url="preview.url"
        :title="`${project.title} live site`"
        :interactive="full"
        :viewport="full ? viewports[device] : 1280"
      />
      <component :is="demos[preview.component]" v-else-if="preview.type === 'demo'" :full="full" />
      <ReplayTerminal v-else-if="preview.type === 'replay'" :script="preview.script" :prompt="preview.prompt" :chat="preview.chat" />
      <img v-else-if="preview.type === 'image'" :src="preview.src" :alt="`${project.title} preview`" loading="lazy" class="h-full w-full object-cover" />
    </div>
  </div>
</template>
