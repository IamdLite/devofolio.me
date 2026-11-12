<script setup>
// Interactive shell. Used inline on the home page and inside the global overlay.
const props = defineProps({
  autofocus: { type: Boolean, default: false },
  height: { type: String, default: "h-80" },
  intro: { type: Array, default: () => [] },
});
const emit = defineEmits(["exit"]);

const { lines, history, busy, cwd, run, abort, complete } = useTerminal({ onExit: () => emit("exit") });
const input = ref("");
const inputEl = ref(null);
const inputId = useId();
const screen = ref(null);
let cursor = -1;

const toneClass = {
  neon: "text-neon",
  ice: "text-ice",
  hot: "text-hot",
  warn: "text-warn",
  dim: "text-dim",
};

async function submit() {
  if (busy.value) return;
  const value = input.value;
  input.value = "";
  cursor = -1;
  await run(value);
  nextTick(() => inputEl.value?.focus({ preventScroll: true }));
}

function onKey(e) {
  if (e.key === "Tab") {
    e.preventDefault();
    input.value = complete(input.value);
  } else if (e.key === "ArrowUp" && history.value.length) {
    e.preventDefault();
    cursor = cursor < 0 ? history.value.length - 1 : Math.max(cursor - 1, 0);
    input.value = history.value[cursor];
  } else if (e.key === "ArrowDown" && cursor >= 0) {
    e.preventDefault();
    cursor = cursor + 1 >= history.value.length ? -1 : cursor + 1;
    input.value = cursor < 0 ? "" : history.value[cursor];
  } else if (e.key === "l" && e.ctrlKey) {
    e.preventDefault();
    lines.value = [];
  } else if (e.key === "c" && e.ctrlKey && !window.getSelection()?.toString()) {
    e.preventDefault();
    if (busy.value) abort();
    else {
      lines.value.push({ text: `${input.value}^C`, prompt: true, cwd: cwd.value });
      input.value = "";
    }
  }
}

// Replays intro commands with a typing effect, then hands over to the user.
async function playIntro() {
  for (const cmd of props.intro) {
    for (const ch of cmd) {
      input.value += ch;
      await new Promise((r) => setTimeout(r, 45));
    }
    await new Promise((r) => setTimeout(r, 250));
    await submit();
    await new Promise((r) => setTimeout(r, 500));
  }
}

watch(
  () => lines.value.length,
  () => nextTick(() => screen.value && (screen.value.scrollTop = screen.value.scrollHeight))
);

onMounted(() => {
  if (props.autofocus) inputEl.value?.focus();
  if (props.intro.length) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) (async () => { for (const c of props.intro) await run(c); })();
    else setTimeout(playIntro, 600);
  }
});

defineExpose({ focus: () => inputEl.value?.focus() });
</script>

<template>
  <div class="dark overflow-hidden rounded-lg border border-line bg-[#03060a]/95 font-mono text-[13px] text-[#cfe3ee] shadow-2xl">
    <div class="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2">
      <span class="h-3 w-3 rounded-full bg-[#ff5f57]" />
      <span class="h-3 w-3 rounded-full bg-[#febc2e]" />
      <span class="h-3 w-3 rounded-full bg-[#28c840]" />
      <span class="ml-2 text-xs text-[#7f95a5]">iamdLite@portfolio: {{ cwd }}</span>
      <slot name="actions" />
    </div>
    <div ref="screen" class="overflow-y-auto p-4 leading-relaxed" :class="height" @click="inputEl?.focus()">
      <div v-for="(line, i) in lines" :key="i" class="whitespace-pre-wrap break-words">
        <template v-if="line.prompt">
          <span class="text-[#00ff9c]">guest@iamdLite</span><span class="text-[#7f95a5]">:</span><span class="text-[#38d6ff]">{{ line.cwd }}</span><span class="text-[#7f95a5]">$ </span>{{ line.text }}
        </template>
        <NuxtLink v-else-if="line.to" :to="line.to" class="hover:underline" :class="toneClass[line.tone] ?? ''">{{ line.text }}</NuxtLink>
        <a v-else-if="line.href" :href="line.href" target="_blank" rel="noopener" class="hover:underline" :class="toneClass[line.tone] ?? 'text-[#38d6ff]'">{{ line.text }}</a>
        <span v-else :class="toneClass[line.tone] ?? ''">{{ line.text }}</span>
      </div>
      <form class="flex items-center" :class="busy ? 'opacity-0' : ''" @submit.prevent="submit">
        <label :for="inputId" class="shrink-0">
          <span class="text-[#00ff9c]">guest@iamdLite</span><span class="text-[#7f95a5]">:</span><span class="text-[#38d6ff]">{{ cwd }}</span><span class="text-[#7f95a5]">$&nbsp;</span>
        </label>
        <input
          :id="inputId"
          ref="inputEl"
          v-model="input"
          class="w-full bg-transparent text-[#cfe3ee] caret-[#00ff9c] outline-none focus-visible:ring-0"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          aria-label="Terminal input"
          @keydown="onKey"
        />
      </form>
    </div>
  </div>
</template>
