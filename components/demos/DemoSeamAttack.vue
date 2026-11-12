<script setup>
// Animated walk-through of the four cross-protocol attack chains from the paper's testbed.
defineProps({ full: Boolean });

const nodes = {
  orch: { x: 240, y: 40, label: "Orchestrator", sub: "A2A :9000" },
  specA: { x: 120, y: 125, label: "Specialist A", sub: "low priv" },
  specB: { x: 360, y: 125, label: "Specialist B", sub: "high priv" },
  mcpA: { x: 120, y: 215, label: "MCP Server A", sub: "read-only" },
  mcpB: { x: 360, y: 215, label: "MCP Server B", sub: "admin" },
  rogue: { x: 450, y: 40, label: "Rogue agent", sub: ":9099" },
};

const edges = [
  ["orch", "specA", "A2A"],
  ["orch", "specB", "A2A"],
  ["specA", "mcpA", "MCP"],
  ["specB", "mcpB", "MCP"],
];

const scenarios = {
  A: {
    name: "Token scope bleed",
    seam: "MCP token → cross-server",
    steps: [
      { from: "orch", to: "specA", text: "Orchestrator delegates a read-only task to Specialist A." },
      { from: "specA", to: "mcpA", text: "Server A issues a token scoped to `read`." },
      { from: "specA", to: "mcpB", text: "Specialist A replays the same token against admin Server B…", bad: true },
      { from: "mcpB", to: "specA", text: "…and Server B accepts it. Admin data flows to a low-priv agent.", bad: true },
    ],
  },
  B: {
    name: "Agent identity spoofing",
    seam: "A2A discovery → card forgery",
    steps: [
      { from: "rogue", to: "orch", text: "A rogue agent publishes a forged card claiming to be Specialist B.", bad: true },
      { from: "orch", to: "rogue", text: "No card verification: the orchestrator delegates a high-priv task to it.", bad: true },
      { from: "rogue", to: "orch", text: "The attacker returns poisoned results and keeps the task context.", bad: true },
    ],
  },
  C: {
    name: "Cross-protocol prompt injection",
    seam: "MCP echo → A2A re-routing",
    steps: [
      { from: "specA", to: "mcpA", text: "Specialist A calls the `echo_data` tool on Server A." },
      { from: "mcpA", to: "specA", text: "The tool output carries an injected instruction.", bad: true },
      { from: "specA", to: "orch", text: "The output is forwarded upstream as a normal A2A result.", bad: true },
      { from: "orch", to: "specB", text: "The orchestrator obeys and re-routes to the high-priv agent.", bad: true },
      { from: "specB", to: "mcpB", text: "Specialist B calls `read_secret`. The injection crossed two protocols.", bad: true },
    ],
  },
  D: {
    name: "Privilege persistence",
    seam: "MCP revocation → A2A state",
    steps: [
      { from: "mcpB", to: "mcpB", text: "An admin revokes Specialist B's token on Server B.", revoke: true },
      { from: "orch", to: "specB", text: "A2A state still marks Specialist B as high-priv, so it gets the task.", bad: true },
      { from: "specB", to: "orch", text: "It answers from cached privileged context. Revocation never crossed the seam.", bad: true },
    ],
  },
};

const current = ref("A");
const step = ref(0);
const playing = ref(true);
let timer;

const scenario = computed(() => scenarios[current.value]);
const active = computed(() => scenario.value.steps[step.value]);

function pick(key) {
  current.value = key;
  step.value = 0;
  playing.value = true;
}

function tick() {
  if (!playing.value) return;
  const last = scenario.value.steps.length - 1;
  if (step.value < last) step.value++;
  else {
    const keys = Object.keys(scenarios);
    current.value = keys[(keys.indexOf(current.value) + 1) % keys.length];
    step.value = 0;
  }
}

onMounted(() => (timer = setInterval(tick, 2200)));
onBeforeUnmount(() => clearInterval(timer));

const path = (a, b) => `M${nodes[a].x},${nodes[a].y} L${nodes[b].x},${nodes[b].y}`;
const isActiveEdge = (a, b) =>
  active.value && ((active.value.from === a && active.value.to === b) || (active.value.from === b && active.value.to === a));
const involved = (id) => active.value && (active.value.from === id || active.value.to === id);
</script>

<template>
  <div class="flex h-full flex-col bg-[#03060a] text-[#cfe3ee]">
    <div class="flex flex-wrap items-center gap-1 border-b border-white/5 px-2 py-1.5">
      <button
        v-for="(s, key) in scenarios"
        :key="key"
        class="rounded px-2 py-0.5 font-mono text-[10px] transition"
        :class="current === key ? 'bg-hot/20 text-hot' : 'text-dim hover:text-fg'"
        @click="pick(key)"
      >
        {{ key }}<span class="hidden sm:inline">: {{ s.name }}</span>
      </button>
      <button class="ml-auto rounded px-1.5 text-dim hover:text-neon" :aria-label="playing ? 'Pause' : 'Play'" @click="playing = !playing">
        <Icon :name="playing ? 'ph:pause-bold' : 'ph:play-bold'" />
      </button>
    </div>

    <svg viewBox="0 0 520 250" class="min-h-0 w-full flex-1" role="img" :aria-label="`Scenario ${current}: ${scenario.name}`">
      <defs>
        <pattern id="seam-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgba(56,214,255,.06)" />
        </pattern>
      </defs>
      <rect width="520" height="250" fill="url(#seam-grid)" />
      <!-- The seam -->
      <line x1="10" y1="170" x2="510" y2="170" stroke="rgba(255,56,172,.35)" stroke-dasharray="4 6" />
      <text x="14" y="164" class="fill-hot font-mono text-[8px] uppercase tracking-widest" opacity=".7">A2A ▲ seam ▼ MCP</text>

      <g v-for="[a, b, proto] in edges" :key="a + b">
        <path :d="path(a, b)" :stroke="isActiveEdge(a, b) ? (active.bad ? '#ff38ac' : '#00ff9c') : 'rgba(127,149,165,.35)'" stroke-width="1.5" fill="none" />
      </g>
      <!-- Off-graph hops (rogue, cross-server replay) -->
      <path
        v-if="active && active.from !== active.to && !edges.some(([a, b]) => isActiveEdge(a, b))"
        :d="path(active.from, active.to)"
        stroke="#ff38ac"
        stroke-width="1.5"
        stroke-dasharray="5 4"
        fill="none"
      />
      <!-- Packet -->
      <circle v-if="active && active.from !== active.to" :key="`${current}-${step}`" r="5" :fill="active.bad ? '#ff38ac' : '#00ff9c'">
        <animateMotion :path="path(active.from, active.to)" dur="1.2s" fill="freeze" />
      </circle>

      <g v-for="(n, id) in nodes" v-show="id !== 'rogue' || current === 'B'" :key="id">
        <rect
          :x="n.x - 52"
          :y="n.y - 17"
          width="104"
          height="34"
          rx="5"
          fill="#09121a"
          :stroke="involved(id) ? (active.bad || active.revoke ? '#ff38ac' : '#00ff9c') : id === 'rogue' ? '#ff38ac' : 'rgba(127,149,165,.5)'"
          :stroke-width="involved(id) ? 2 : 1"
        />
        <text :x="n.x" :y="n.y - 1" text-anchor="middle" class="fill-[#dceaf2] font-mono text-[10px] font-bold">{{ n.label }}</text>
        <text :x="n.x" :y="n.y + 11" text-anchor="middle" class="fill-[#7f95a5] font-mono text-[8px]">{{ n.sub }}</text>
        <text v-if="active?.revoke && id === 'mcpB'" :x="n.x + 46" :y="n.y - 12" class="fill-hot text-[14px]">⊘</text>
      </g>
      <text x="300" y="82" class="fill-[#7f95a5] font-mono text-[8px]">A2A delegation</text>
      <text x="368" y="175" class="fill-[#7f95a5] font-mono text-[8px]">MCP tool call</text>
    </svg>

    <div class="border-t border-white/5 px-3 py-2 font-mono text-[11px]" aria-live="polite">
      <div class="mb-0.5 flex items-center gap-2 text-[10px] uppercase tracking-widest text-dim">
        <span class="text-hot">Scenario {{ current }}</span> · {{ scenario.seam }} · step {{ step + 1 }}/{{ scenario.steps.length }}
      </div>
      <p :class="active.bad ? 'text-hot' : 'text-neon'">{{ active.text }}</p>
    </div>
  </div>
</template>
