<script setup>
import { projects } from "~/data/projects";
import { profile } from "~/data/profile";

// Site navigation as a living spider web: pages hang on the spokes, the threads bend toward
// the cursor, and hovering Projects fans its projects out as a second strand.
const open = useWebNavOpen();
const route = useRoute();
const { width, height } = useWindowSize();
const reducedMotion = usePreferredReducedMotion();

const nodes = [{ label: "Home", to: "/", icon: "ph:house-bold" }, ...navLinks, { label: "Contact", to: "/contact", icon: "ph:paper-plane-tilt-bold" }];
const RINGS = 4;

const t = ref(0);
const grow = ref(0);
const pointer = reactive({ x: -9999, y: -9999 });
const hovered = ref(null);
const expanded = ref(null);
const firstLink = ref(null);
let raf, start;

const isActive = (to) => (to === "/" ? route.path === "/" : route.path === to || route.path.startsWith(`${to}/`));
const small = computed(() => width.value < 640);
const center = computed(() => ({ x: width.value / 2, y: height.value / 2 + 12 }));
const radius = computed(() => Math.min(width.value * (small.value ? 0.4 : 0.36), height.value * 0.36));

// Pull a point toward the cursor, more strongly the closer it is.
function pull(p, reach, strength) {
  const dx = pointer.x - p.x;
  const dy = pointer.y - p.y;
  const d = Math.hypot(dx, dy);
  if (d > reach) return p;
  const f = (1 - d / reach) * strength;
  return { x: p.x + dx * f, y: p.y + dy * f };
}

const spokes = computed(() => {
  const { x: cx, y: cy } = center.value;
  const R = radius.value * grow.value;
  return nodes.map((n, i) => {
    const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    const anchors = Array.from({ length: RINGS }, (_, k) => {
      const r = (R * (k + 1)) / RINGS;
      const wob = k === RINGS - 1 ? 6 : 2;
      const base = { x: cx + Math.cos(a) * r + Math.sin(t.value * 0.9 + i * 1.7 + k) * wob, y: cy + Math.sin(a) * r + Math.cos(t.value * 0.7 + i + k) * wob };
      return pull(base, 200, k === RINGS - 1 ? 0.28 : 0.18);
    });
    return { ...n, angle: a, anchors, pos: anchors[RINGS - 1] };
  });
});

const ringPaths = computed(() => {
  const { x: cx, y: cy } = center.value;
  return Array.from({ length: RINGS }, (_, k) =>
    spokes.value
      .map((s, i) => {
        const a = s.anchors[k];
        const b = spokes.value[(i + 1) % spokes.value.length].anchors[k];
        // Threads sag slightly toward the hub, like silk under tension.
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const cxp = mx + (cx - mx) * 0.12;
        const cyp = my + (cy - my) * 0.12;
        return `${i === 0 ? `M${a.x},${a.y}` : ""} Q${cxp},${cyp} ${b.x},${b.y}`;
      })
      .join(" ")
  );
});

const children = computed(() => {
  const parent = spokes.value.find((s) => s.label === expanded.value);
  if (!parent || parent.to !== "/projects") return [];
  // Hang the projects as a column on the outer side of the node, kept inside the viewport.
  const side = Math.cos(parent.angle) >= 0 ? 1 : -1;
  const gap = small.value ? 28 : 32;
  const span = (projects.length - 1) * gap;
  const top = Math.min(height.value - 60 - span, Math.max(80, parent.pos.y - span / 2));
  const x = small.value ? width.value / 2 : parent.pos.x + side * 90;
  return projects.map((p, i) => ({
    label: p.title.split(/[:(]/)[0].trim(),
    to: `/projects/${p.slug}`,
    x,
    y: top + i * gap,
    side: small.value ? 0 : side,
    from: parent.pos,
  }));
});

const packets = computed(() => {
  const s = spokes.value.find((x) => x.label === hovered.value);
  if (!s) return [];
  const { x: cx, y: cy } = center.value;
  return [0, 0.33, 0.66].map((o) => {
    const f = (t.value * 0.7 + o) % 1;
    return { x: cx + (s.pos.x - cx) * f, y: cy + (s.pos.y - cy) * f };
  });
});

function frame(now) {
  raf = requestAnimationFrame(frame);
  start ??= now;
  t.value = now / 1000;
  grow.value = Math.min(1, 1 - Math.pow(1 - (now - start) / 650, 3));
}

watch(open, (on) => {
  document.documentElement.style.overflow = on ? "hidden" : "";
  cancelAnimationFrame(raf);
  hovered.value = expanded.value = null;
  if (!on) return;
  start = undefined;
  if (reducedMotion.value === "reduce") grow.value = 1;
  else {
    grow.value = 0;
    raf = requestAnimationFrame(frame);
  }
  nextTick(() => firstLink.value?.$el?.focus?.());
});
watch(() => route.fullPath, () => (open.value = false));
onKeyStroke("Escape", () => (open.value = false));
onBeforeUnmount(() => cancelAnimationFrame(raf));

function enter(n) {
  hovered.value = n.label;
  if (n.to === "/projects") expanded.value = n.label;
}
function onMove(e) {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
}
</script>

<template>
  <Transition enter-from-class="opacity-0" leave-to-class="opacity-0" enter-active-class="transition duration-300" leave-active-class="transition duration-200">
    <div
      v-if="open"
      class="fixed inset-0 z-[70] overflow-hidden bg-void/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      @pointermove="onMove"
      @pointerleave="pointer.x = pointer.y = -9999"
    >
      <svg class="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="web-fade">
            <stop offset="0" stop-color="rgb(var(--neon))" stop-opacity=".9" />
            <stop offset="1" stop-color="rgb(var(--neon))" stop-opacity=".15" />
          </radialGradient>
        </defs>
        <!-- spokes -->
        <polyline
          v-for="s in spokes"
          :key="`spoke-${s.label}`"
          :points="[center, ...s.anchors].map((p) => `${p.x},${p.y}`).join(' ')"
          fill="none"
          :stroke="hovered === s.label || isActive(s.to) ? 'rgb(var(--neon))' : 'rgb(var(--line))'"
          :stroke-width="hovered === s.label ? 1.6 : 1"
          :stroke-opacity="hovered === s.label ? 1 : 0.9"
        />
        <!-- rings -->
        <path v-for="(d, k) in ringPaths" :key="`ring-${k}`" :d="d + ' Z'" fill="none" stroke="rgb(var(--ice))" :stroke-opacity="0.12 + k * 0.07" stroke-width="1" />
        <!-- project strand -->
        <line v-for="c in children" :key="`thread-${c.to}`" :x1="c.from.x" :y1="c.from.y" :x2="c.x" :y2="c.y" stroke="rgb(var(--hot))" stroke-opacity=".5" stroke-dasharray="3 4" />
        <!-- data packets on the hovered thread -->
        <circle v-for="(p, i) in packets" :key="`pk-${i}`" :cx="p.x" :cy="p.y" r="3" fill="rgb(var(--neon))" />
      </svg>

      <!-- hub -->
      <NuxtLink
        to="/"
        class="absolute grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-neon/60 bg-void font-mono text-xs font-bold text-neon shadow-glow transition hover:scale-105"
        :style="{ left: `${center.x}px`, top: `${center.y}px` }"
      >
        <span class="text-center leading-tight">~/<br />{{ profile.handle }}</span>
      </NuxtLink>

      <!-- page nodes -->
      <NuxtLink
        v-for="(s, i) in spokes"
        :ref="i === 0 ? (el) => (firstLink = el) : undefined"
        :key="s.label"
        :to="s.to"
        class="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 focus-visible:ring-0"
        :style="{ left: `${s.pos.x}px`, top: `${s.pos.y}px`, opacity: grow }"
        :aria-current="isActive(s.to) ? 'page' : undefined"
        @pointerenter="enter(s)"
        @focus="enter(s)"
        @pointerleave="hovered = null"
      >
        <span
          class="grid place-items-center rounded-full border bg-void transition duration-200 group-hover:scale-110 group-hover:border-neon group-hover:text-neon group-hover:shadow-glow group-focus-visible:border-neon group-focus-visible:shadow-glow"
          :class="[small ? 'h-11 w-11' : 'h-14 w-14', isActive(s.to) ? 'border-neon text-neon shadow-glow' : 'border-line text-fg']"
        >
          <Icon :name="s.icon" :size="small ? '18' : '22'" />
        </span>
        <span class="rounded bg-void/80 px-1.5 font-mono text-[11px] transition sm:text-xs" :class="isActive(s.to) || hovered === s.label ? 'text-neon' : 'text-dim'">
          {{ s.label.toLowerCase() }}
        </span>
      </NuxtLink>

      <!-- project strand nodes -->
      <TransitionGroup enter-from-class="opacity-0 scale-50" enter-active-class="transition duration-300">
        <NuxtLink
          v-for="(c, i) in children"
          :key="c.to"
          :to="c.to"
          class="absolute -translate-y-1/2 whitespace-nowrap rounded-full border border-hot/50 bg-void px-2.5 py-1 font-mono text-[10px] text-fg transition hover:border-hot hover:text-hot focus-visible:border-hot"
          :class="c.side > 0 ? '' : c.side < 0 ? '-translate-x-full' : '-translate-x-1/2'"
          :style="{ left: `${c.x}px`, top: `${c.y}px`, transitionDelay: `${i * 25}ms` }"
          @pointerenter="hovered = 'Projects'"
        >
          {{ c.label }}
        </NuxtLink>
      </TransitionGroup>

      <div class="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4 sm:px-8">
        <p class="kicker">// network map</p>
        <button class="btn-ghost !px-3 !py-1.5 !text-xs" aria-label="Close navigation" @click="open = false"><Icon name="ph:x-bold" /> esc</button>
      </div>
      <p class="absolute inset-x-0 bottom-5 text-center font-mono text-[11px] text-dim">
        move across the web · hover projects to expand · <kbd class="rounded border border-line px-1">⌘K</kbd> to search
      </p>
    </div>
  </Transition>
</template>
