<script setup>
// Simulated alert flow through the distributed SOC: Wazuh → NATS JetStream → runtime replicas (HPA) → LLM triage → cases.
defineProps({ full: Boolean });

const W = 520;
const H = 250;
const lanes = [62, 125, 188];
const X = { wazuh: 48, nats: 160, runtime: 280, triage: 395, cases: 480 };
const colors = { low: "#38d6ff", med: "#ffc83d", high: "#ff38ac" };

const root = ref(null);
const visible = useElementVisibility(root);
const storm = ref(false);
const natsDown = ref(-1);
const replicas = ref(1);
const triaged = ref(0);
const queued = ref(0);
const log = ref(["cluster healthy · leader: runtime-0"]);
const particles = shallowRef([]);
let raf, last = 0, spawnAcc = 0, hpaAcc = 0, id = 0;

const runtimeY = (i, n = replicas.value) => 125 + (i - (n - 1) / 2) * Math.min(38, 160 / n);

function say(msg) {
  log.value = [msg, ...log.value].slice(0, 3);
}

function spawn() {
  const alive = [0, 1, 2].filter((i) => i !== natsDown.value);
  const r = Math.random();
  particles.value.push({
    id: id++,
    sev: r > 0.85 ? "high" : r > 0.55 ? "med" : "low",
    stage: 0,
    t: 0,
    from: { x: X.wazuh, y: lanes[(Math.random() * 3) | 0] },
    nats: alive[(Math.random() * alive.length) | 0],
    rep: (Math.random() * replicas.value) | 0,
  });
}

// Waypoints for a particle at each stage.
function waypoint(p, stage) {
  switch (stage) {
    case 0: return p.from;
    case 1: return { x: X.nats, y: lanes[p.nats] };
    case 2: return { x: X.runtime, y: runtimeY(Math.min(p.rep, replicas.value - 1)) };
    case 3: return { x: X.triage, y: 125 };
    default: return { x: X.cases, y: p.sev === "high" ? 190 : 80 };
  }
}

function step(now) {
  raf = requestAnimationFrame(step);
  if (!visible.value) return (last = now);
  const dt = Math.min((now - (last || now)) / 1000, 0.1);
  last = now;

  const rate = storm.value ? 14 : 2.5;
  spawnAcc += dt * rate;
  while (spawnAcc > 1) {
    spawn();
    spawnAcc--;
  }

  // Each replica processes ~4 alerts/s; the HPA reacts to the backlog.
  const capacity = replicas.value * 4;
  hpaAcc += dt;
  if (hpaAcc > 1.2) {
    hpaAcc = 0;
    const desired = Math.min(5, Math.max(1, Math.ceil(rate / 3.5)));
    if (desired > replicas.value) {
      replicas.value++;
      say(`HPA: scaled runtime → ${replicas.value} replicas`);
    } else if (desired < replicas.value) {
      replicas.value--;
      say(`HPA: scaled down → ${replicas.value} replicas`);
    }
  }

  const speed = 0.9 * Math.min(1.6, capacity / rate);
  const next = [];
  let waiting = 0;
  for (const p of particles.value) {
    p.t += dt * (p.stage === 1 ? speed : 1.4);
    if (p.stage === 1) waiting++;
    if (p.t >= 1) {
      p.t = 0;
      p.stage++;
      if (p.stage === 1 && p.nats === natsDown.value) p.nats = (p.nats + 1) % 3;
      if (p.stage === 4) {
        triaged.value++;
        if (p.sev === "high" && Math.random() > 0.7) say("triage: high-severity case opened → Slack");
        continue;
      }
    }
    next.push(p);
  }
  queued.value = waiting;
  particles.value = next;
}

function pos(p) {
  const a = waypoint(p, p.stage);
  const b = waypoint(p, p.stage + 1);
  return { x: a.x + (b.x - a.x) * p.t, y: a.y + (b.y - a.y) * p.t };
}

function toggleStorm() {
  storm.value = !storm.value;
  say(storm.value ? "⚠ alert storm: 14 alerts/s incoming" : "storm over: back to baseline");
}

function toggleNode() {
  if (natsDown.value === -1) {
    natsDown.value = 1;
    say("js-2 down · stream replicated on js-1, js-3 · 0 messages lost");
  } else {
    natsDown.value = -1;
    say("js-2 rejoined · JetStream cluster healthy");
  }
}

onMounted(() => (raf = requestAnimationFrame(step)));
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <div ref="root" class="flex h-full flex-col bg-[#03060a] text-[#cfe3ee]">
    <div class="flex flex-wrap items-center gap-2 border-b border-white/5 px-2 py-1.5 font-mono text-[10px]">
      <button class="rounded border px-2 py-0.5 transition" :class="storm ? 'border-hot text-hot' : 'border-white/10 text-dim hover:text-fg'" @click="toggleStorm">
        <Icon name="ph:lightning-bold" /> alert storm
      </button>
      <button class="rounded border px-2 py-0.5 transition" :class="natsDown > -1 ? 'border-warn text-warn' : 'border-white/10 text-dim hover:text-fg'" @click="toggleNode">
        <Icon name="ph:plugs-bold" /> {{ natsDown > -1 ? "restore js-2" : "kill js-2" }}
      </button>
      <span class="ml-auto text-dim">pods <b class="text-neon">{{ replicas }}</b> · queued <b class="text-warn">{{ queued }}</b> · triaged <b class="text-ice">{{ triaged }}</b></span>
    </div>

    <svg :viewBox="`0 0 ${W} ${H}`" class="min-h-0 w-full flex-1" role="img" aria-label="Simulated alert pipeline">
      <g class="font-mono text-[8px]" fill="#7f95a5">
        <text :x="X.wazuh" y="22" text-anchor="middle">WAZUH</text>
        <text :x="X.nats" y="22" text-anchor="middle">NATS JETSTREAM</text>
        <text :x="X.runtime" y="22" text-anchor="middle">RUNTIME · HPA</text>
        <text :x="X.triage" y="22" text-anchor="middle">LLM TRIAGE</text>
        <text :x="X.cases" y="22" text-anchor="middle">CASES</text>
      </g>
      <g v-for="(y, i) in lanes" :key="'w' + i">
        <rect :x="X.wazuh - 26" :y="y - 11" width="52" height="22" rx="4" fill="#09121a" stroke="rgba(56,214,255,.5)" />
        <text :x="X.wazuh" :y="y + 3" text-anchor="middle" class="fill-[#dceaf2] font-mono text-[8px]">agent-{{ i + 1 }}</text>
      </g>
      <g v-for="(y, i) in lanes" :key="'n' + i">
        <rect :x="X.nats - 26" :y="y - 11" width="52" height="22" rx="4" fill="#09121a" :stroke="natsDown === i ? '#ff38ac' : 'rgba(0,255,156,.5)'" :stroke-dasharray="natsDown === i ? '3 3' : ''" />
        <text :x="X.nats" :y="y + 3" text-anchor="middle" class="font-mono text-[8px]" :class="natsDown === i ? 'fill-hot' : 'fill-[#dceaf2]'">{{ natsDown === i ? "✕ js-" : "js-" }}{{ i + 1 }}</text>
      </g>
      <g v-for="i in replicas" :key="'r' + i">
        <rect :x="X.runtime - 30" :y="runtimeY(i - 1) - 10" width="60" height="20" rx="4" fill="#09121a" stroke="rgba(0,255,156,.6)" class="transition-all duration-500" />
        <text :x="X.runtime" :y="runtimeY(i - 1) + 3" text-anchor="middle" class="fill-[#dceaf2] font-mono text-[8px]">runtime-{{ i - 1 }}{{ i === 1 ? " ★" : "" }}</text>
      </g>
      <rect :x="X.triage - 32" y="105" width="64" height="40" rx="5" fill="#09121a" stroke="rgba(255,200,61,.6)" />
      <text :x="X.triage" y="122" text-anchor="middle" class="fill-[#dceaf2] font-mono text-[8px]">OpenClaw</text>
      <text :x="X.triage" y="134" text-anchor="middle" class="fill-[#7f95a5] font-mono text-[7px]">agents</text>
      <rect :x="X.cases - 28" y="66" width="56" height="28" rx="4" fill="#09121a" stroke="rgba(56,214,255,.5)" />
      <text :x="X.cases" y="83" text-anchor="middle" class="fill-[#dceaf2] font-mono text-[8px]">Redis</text>
      <rect :x="X.cases - 28" y="176" width="56" height="28" rx="4" fill="#09121a" stroke="rgba(255,56,172,.5)" />
      <text :x="X.cases" y="193" text-anchor="middle" class="fill-[#dceaf2] font-mono text-[8px]">Slack</text>

      <circle v-for="p in particles" :key="p.id" :cx="pos(p).x" :cy="pos(p).y" r="3" :fill="colors[p.sev]" />
    </svg>

    <div class="border-t border-white/5 px-3 py-1.5 font-mono text-[10px]" aria-live="polite">
      <p v-for="(l, i) in log" :key="l + i" :class="i ? 'text-dim' : 'text-neon'" class="truncate">› {{ l }}</p>
    </div>
  </div>
</template>
