<script setup>
// Plays a scripted terminal (or chat) session in a loop while visible.
const props = defineProps({
  script: { type: Array, required: true },
  prompt: { type: String, default: "user@host" },
  chat: { type: Boolean, default: false },
});

const root = ref(null);
const screen = ref(null);
const shown = ref([]);
const typing = ref("");
const visible = useElementVisibility(root);
let alive = true;

const tone = { ok: "text-neon", warn: "text-warn", hot: "text-hot", dim: "text-dim" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function play() {
  while (alive) {
    if (!visible.value) {
      await sleep(400);
      continue;
    }
    shown.value = [];
    for (const step of props.script) {
      if (!alive) return;
      if (step.cmd) {
        for (const ch of step.cmd) {
          typing.value += ch;
          await sleep(28);
        }
        await sleep(200);
        shown.value.push({ ...step });
        typing.value = "";
        await sleep(350);
      } else {
        shown.value.push({ ...step });
        await sleep(160);
      }
      nextTick(() => screen.value && (screen.value.scrollTop = screen.value.scrollHeight));
    }
    await sleep(3500);
  }
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    shown.value = props.script;
    return;
  }
  play();
});
onBeforeUnmount(() => (alive = false));
</script>

<template>
  <div ref="root" class="flex h-full flex-col bg-[#03060a] font-mono text-[11.5px] leading-relaxed text-[#cfe3ee] sm:text-xs">
    <div ref="screen" class="flex-1 overflow-hidden p-3">
      <template v-if="chat">
        <div v-for="(l, i) in shown" :key="i" class="mb-1.5 flex" :class="l.cmd ? 'justify-end' : ''">
          <span
            class="max-w-[85%] rounded-lg px-2.5 py-1.5"
            :class="l.cmd ? 'bg-ice/20 text-ice' : ['bg-white/5', tone[l.tone] ?? '']"
            >{{ l.cmd ?? l.out }}</span
          >
        </div>
        <div v-if="typing" class="flex justify-end"><span class="blink rounded-lg bg-ice/10 px-2.5 py-1.5 text-ice/80">{{ typing }}</span></div>
      </template>
      <template v-else>
        <div v-for="(l, i) in shown" :key="i" class="whitespace-pre-wrap break-all">
          <template v-if="l.cmd"><span class="text-neon">{{ prompt }}</span><span class="text-dim">$ </span>{{ l.cmd }}</template>
          <span v-else :class="tone[l.tone] ?? 'text-[#9fb4c2]'">{{ l.out }}</span>
        </div>
        <div><span class="text-neon">{{ prompt }}</span><span class="text-dim">$ </span><span class="blink">{{ typing }}</span></div>
      </template>
    </div>
    <div class="border-t border-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-dim">simulated session</div>
  </div>
</template>
