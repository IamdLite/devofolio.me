<script setup>
// A tiny playable slice of Scholarion's path map: complete nodes, earn XP, watch Scholi thaw.
defineProps({ full: Boolean });

const nodes = [
  { type: "learn", icon: "📖", title: "What Chevening looks for" },
  { type: "do", icon: "✍️", title: "Draft your leadership essay" },
  { type: "learn", icon: "📖", title: "Networking essay patterns" },
  { type: "review", icon: "🔁", title: "Review: eligibility quiz" },
  { type: "do", icon: "🎯", title: "Pick 3 UK courses" },
  { type: "boss", icon: "👑", title: "Boss: mock interview" },
];

const done = ref(1);
const xp = ref(40);
const streak = ref(3);
const burst = ref(false);

const progress = computed(() => done.value / nodes.length);
const level = computed(() => 1 + Math.floor(xp.value / 100));

function advance() {
  if (done.value >= nodes.length) {
    done.value = 0;
    xp.value = 0;
    streak.value = 1;
    return;
  }
  done.value++;
  xp.value += nodes[done.value - 1].type === "boss" ? 60 : 25;
  streak.value++;
  burst.value = true;
  setTimeout(() => (burst.value = false), 600);
}

const windowed = computed(() => {
  const start = Math.max(0, Math.min(done.value - 1, nodes.length - 4));
  return [0, 1, 2, 3].map((k) => start + k);
});

const state = (i) => (i < done.value ? "done" : i === done.value ? "current" : "locked");
</script>

<template>
  <div class="flex h-full items-center justify-center gap-6 bg-[radial-gradient(circle_at_50%_0%,rgba(56,214,255,.15),transparent_60%)] p-3">
    <!-- Phone -->
    <div class="relative flex h-full max-h-[22rem] w-[11.5rem] shrink-0 flex-col overflow-hidden rounded-[1.4rem] border-4 border-[#1b2733] bg-[#f7fbff] text-[#0b1a2a] shadow-2xl">
      <div class="flex items-center justify-between bg-white px-3 pb-1.5 pt-2 text-[10px] font-bold">
        <span>🔥 {{ streak }}</span>
        <span class="text-[#7c3aed]">Lv {{ level }}</span>
        <span>⭐ {{ xp }} XP</span>
      </div>
      <div class="mx-3 h-1.5 overflow-hidden rounded-full bg-[#e2e8f0]">
        <div class="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#06b6d4] transition-all duration-500" :style="{ width: `${progress * 100}%` }" />
      </div>
      <p class="mt-2 text-center text-[9px] font-bold uppercase tracking-widest text-[#64748b]">Chevening · Unit 1</p>
      <!-- A window of nodes around the current one keeps the path readable at card size -->
      <div class="flex min-h-0 flex-1 flex-col items-center justify-evenly overflow-hidden py-1">
        <div
          v-for="i in windowed"
          :key="i"
          class="grid h-8 w-8 shrink-0 place-items-center rounded-full border-b-4 text-sm transition-all duration-300"
          :class="{
            'border-[#15803d] bg-[#22c55e] text-white': state(i) === 'done',
            'border-[#6d28d9] bg-[#8b5cf6] ring-4 ring-[#8b5cf6]/30': state(i) === 'current',
            'border-[#cbd5e1] bg-[#e2e8f0] grayscale': state(i) === 'locked',
          }"
          :style="{ transform: `translateX(${Math.sin(i * 1.3) * 34}px)` }"
          :title="nodes[i].title"
        >
          {{ state(i) === "done" ? "✓" : nodes[i].icon }}
        </div>
      </div>
      <button class="m-2 rounded-xl border-b-4 border-[#15803d] bg-[#22c55e] py-1.5 text-[11px] font-extrabold uppercase text-white active:translate-y-0.5 active:border-b-2" @click="advance">
        {{ done >= nodes.length ? "Restart" : "Continue" }}
      </button>
    </div>

    <!-- Scholi -->
    <div class="hidden flex-col items-center gap-2 text-center sm:flex">
      <div
        class="relative text-6xl transition-[filter] duration-700"
        :style="{ filter: `saturate(${0.1 + progress * 1.4}) hue-rotate(${(1 - progress) * 160}deg) brightness(${1.3 - progress * 0.3})` }"
      >
        🐦
        <span v-if="burst" class="absolute -right-3 -top-2 animate-ping text-2xl">✨</span>
      </div>
      <p class="font-mono text-[10px] uppercase tracking-widest text-dim">Scholi is</p>
      <p class="font-mono text-xs text-ice">{{ progress < 0.34 ? "frosty ❄️" : progress < 0.8 ? "thawing 💧" : "full colour 🌈" }}</p>
      <p class="mt-1 max-w-[9rem] font-mono text-[10px] text-dim">Next: {{ nodes[done]?.title ?? "Submit day 🎉" }}</p>
    </div>
  </div>
</template>
