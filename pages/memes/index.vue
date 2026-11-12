<script setup>
import { memes, memeCategories } from "~/data/memes";

definePageMeta({
  title: "Memes",
  description: "Swipe right if it's funny, left if it isn't. Space and campus memes, judged by you.",
});

// Each visitor's swipes live in their own browser: { [memeId]: "funny" | "nope" }.
const swipes = useLocalStorage("meme-swipes", {}, { initOnMounted: true });
const category = ref("all");
const history = ref([]); // ids swiped this session, for undo

const pool = computed(() => memes.filter((m) => category.value === "all" || m.category === category.value));
const deck = computed(() => pool.value.filter((m) => !swipes.value[m.id]));
const top = computed(() => deck.value[0]);
const done = computed(() => pool.value.length - deck.value.length);
const laughed = computed(() => pool.value.filter((m) => swipes.value[m.id] === "funny"));

const share = (m) => {
  const mine = swipes.value[m.id];
  const funny = m.votes.funny + (mine === "funny" ? 1 : 0);
  const total = m.votes.funny + m.votes.nope + (mine ? 1 : 0);
  return total ? Math.round((funny / total) * 100) : 0;
};

// ── Dragging the top card ──
const drag = reactive({ x: 0, y: 0, active: false, leaving: null });
let origin = null;
const SWIPE_AT = 110;

function onPointerDown(e) {
  if (drag.leaving) return;
  origin = { x: e.clientX, y: e.clientY, t: performance.now() };
  drag.active = true;
  e.currentTarget.setPointerCapture(e.pointerId);
}
function onPointerMove(e) {
  if (!drag.active) return;
  drag.x = e.clientX - origin.x;
  drag.y = e.clientY - origin.y;
}
function onPointerUp() {
  if (!drag.active) return;
  drag.active = false;
  const speed = Math.abs(drag.x) / Math.max(1, performance.now() - origin.t);
  if (Math.abs(drag.x) > SWIPE_AT || speed > 0.8) vote(drag.x > 0 ? "funny" : "nope");
  else Object.assign(drag, { x: 0, y: 0 });
}

const toast = ref(null);
let toastTimer;
function vote(choice) {
  const m = top.value;
  if (!m || drag.leaving) return;
  drag.leaving = choice;
  drag.x = (choice === "funny" ? 1 : -1) * 600;
  drag.y += 40;
  setTimeout(() => {
    swipes.value = { ...swipes.value, [m.id]: choice };
    history.value.push(m.id);
    Object.assign(drag, { x: 0, y: 0, leaving: null });
    toast.value = { choice, pct: share(m) };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.value = null), 1800);
  }, 260);
}
function undo() {
  const id = history.value.pop();
  if (!id) return;
  const { [id]: _, ...rest } = swipes.value;
  swipes.value = rest;
}
function restart() {
  const ids = new Set(pool.value.map((m) => m.id));
  swipes.value = Object.fromEntries(Object.entries(swipes.value).filter(([id]) => !ids.has(id)));
  history.value = [];
}

onKeyStroke("ArrowRight", (e) => !e.target.closest?.("input, textarea") && vote("funny"));
onKeyStroke("ArrowLeft", (e) => !e.target.closest?.("input, textarea") && vote("nope"));
onKeyStroke(["Backspace", "z"], (e) => !e.target.closest?.("input, textarea") && undo());
onBeforeUnmount(() => clearTimeout(toastTimer));

const cardStyle = (i) => {
  if (i === 0) {
    return {
      transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 18}deg)`,
      transition: drag.active ? "none" : "transform 300ms cubic-bezier(.2,.8,.2,1)",
      zIndex: 10,
    };
  }
  return { transform: `translateY(${i * 14}px) scale(${1 - i * 0.05})`, zIndex: 10 - i, transition: "transform 300ms ease" };
};
const stamp = computed(() => Math.min(1, Math.abs(drag.x) / SWIPE_AT));
</script>

<template>
  <div class="container-cy py-14">
    <header class="mx-auto mb-8 max-w-2xl text-center">
      <p class="kicker mb-3">// ./judge --memes</p>
      <h1 class="h-display text-4xl sm:text-5xl"><ScrambleText text="Swipe the memes" /></h1>
      <p class="mt-4 text-lg text-dim">
        Funny? Swipe <span class="text-neon">right</span>. Not funny? Swipe <span class="text-hot">left</span>. Arrow keys work too.
      </p>
    </header>

    <div class="mb-8 flex flex-wrap justify-center gap-1" role="tablist" aria-label="Meme category">
      <button
        v-for="(label, key) in memeCategories"
        :key="key"
        role="tab"
        :aria-selected="category === key"
        class="rounded px-3 py-1.5 font-mono text-xs transition"
        :class="category === key ? 'bg-neon text-void' : 'text-dim hover:bg-panel2 hover:text-fg'"
        @click="category = key"
      >
        {{ label }}
      </button>
    </div>

    <div class="mx-auto max-w-sm">
      <div class="mb-3 flex items-center justify-between font-mono text-xs text-dim">
        <span>{{ done }} / {{ pool.length }} judged</span>
        <span>{{ laughed.length }} 😂</span>
      </div>
      <div class="mb-6 h-1 overflow-hidden rounded-full bg-line/50">
        <div class="h-full bg-neon transition-all duration-500" :style="{ width: `${(done / pool.length) * 100}%` }" />
      </div>

      <!-- Deck -->
      <div v-if="top" class="relative aspect-[4/5] select-none">
        <article
          v-for="(m, i) in deck.slice(0, 3)"
          :key="m.id"
          class="hud absolute inset-0 flex flex-col overflow-hidden bg-panel"
          :class="i === 0 ? 'cursor-grab touch-none active:cursor-grabbing' : 'pointer-events-none'"
          :style="cardStyle(i)"
          :aria-hidden="i !== 0"
          @pointerdown="i === 0 && onPointerDown($event)"
          @pointermove="i === 0 && onPointerMove($event)"
          @pointerup="i === 0 && onPointerUp()"
          @pointercancel="i === 0 && onPointerUp()"
        >
          <div class="relative min-h-0 flex-1 bg-black">
            <img :src="m.image" :alt="m.title" class="h-full w-full object-contain" draggable="false" />
            <template v-if="i === 0">
              <span
                class="absolute left-4 top-6 -rotate-12 rounded-md border-4 border-neon px-3 py-1 font-mono text-2xl font-black text-neon"
                :style="{ opacity: drag.x > 0 ? stamp : 0 }"
              >FUNNY</span>
              <span
                class="absolute right-4 top-6 rotate-12 rounded-md border-4 border-hot px-3 py-1 font-mono text-2xl font-black text-hot"
                :style="{ opacity: drag.x < 0 ? stamp : 0 }"
              >NOPE</span>
            </template>
          </div>
          <div class="border-t border-line/60 p-4">
            <p class="font-mono text-[11px] text-neon">{{ memeCategories[m.category] }}</p>
            <h2 class="font-semibold leading-snug">{{ m.title }}</h2>
          </div>
        </article>

        <Transition enter-from-class="opacity-0 translate-y-2" leave-to-class="opacity-0" enter-active-class="transition" leave-active-class="transition">
          <p
            v-if="toast"
            class="absolute -bottom-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded border px-3 py-1 font-mono text-xs"
            :class="toast.choice === 'funny' ? 'border-neon/60 bg-neon/10 text-neon' : 'border-hot/60 bg-hot/10 text-hot'"
            role="status"
          >
            {{ toast.pct }}% of visitors found it funny
          </p>
        </Transition>
      </div>

      <!-- End of deck -->
      <div v-else class="hud p-6 text-center">
        <p class="text-5xl">{{ laughed.length > pool.length / 2 ? "😂" : laughed.length ? "🙂" : "😐" }}</p>
        <h2 class="h-display mt-3 text-2xl">Deck cleared</h2>
        <p class="mt-2 text-dim">You laughed at {{ laughed.length }} of {{ pool.length }} memes.</p>
        <div v-if="laughed.length" class="mt-5 grid grid-cols-4 gap-2">
          <img v-for="m in laughed" :key="m.id" :src="m.image" :alt="m.title" class="aspect-square rounded border border-line object-cover" />
        </div>
        <button class="btn-neon mt-6" @click="restart"><Icon name="ph:arrow-counter-clockwise-bold" /> Swipe again</button>
      </div>

      <!-- Controls -->
      <div v-if="top" class="mt-16 flex items-center justify-center gap-5">
        <button class="grid h-16 w-16 place-items-center rounded-full border-2 border-hot/60 text-2xl text-hot transition hover:scale-110 hover:bg-hot/10" aria-label="Not funny (swipe left)" @click="vote('nope')">
          <Icon name="ph:x-bold" />
        </button>
        <button class="grid h-11 w-11 place-items-center rounded-full border border-line text-dim transition hover:border-warn hover:text-warn disabled:opacity-30" aria-label="Undo last swipe" :disabled="!history.length" @click="undo">
          <Icon name="ph:arrow-counter-clockwise-bold" />
        </button>
        <button class="grid h-16 w-16 place-items-center rounded-full border-2 border-neon/60 text-2xl transition hover:scale-110 hover:bg-neon/10" aria-label="Funny (swipe right)" @click="vote('funny')">
          😂
        </button>
      </div>
    </div>
  </div>
</template>
