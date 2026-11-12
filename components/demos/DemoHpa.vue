<script setup>
// Horizontal Pod Autoscaler playground: push load, watch CPU climb and pods scale.
// Uses the real HPA formula: desired = ceil(current * currentUtil / targetUtil).
defineProps({ full: Boolean });

const TARGET = 50;
const MAX = 10;
const load = ref(10);
const pods = ref(1);
const cpu = ref(0);
const samples = ref([]);
const event = ref("hpa/web: steady at 1 replica");
const k6 = ref(false);
let timer, k6Timer, lowFor = 0;

function tick() {
  // Each virtual user costs ~7.5% of one pod's CPU request.
  cpu.value = Math.min(100, (load.value * 7.5) / pods.value);
  const desired = Math.min(MAX, Math.max(1, Math.ceil((pods.value * cpu.value) / TARGET)));
  if (desired > pods.value) {
    event.value = `scaled up ${pods.value} → ${desired}: cpu ${cpu.value.toFixed(0)}% > ${TARGET}% target`;
    pods.value = desired;
    lowFor = 0;
  } else if (desired < pods.value) {
    // Scale-down stabilisation window: wait before removing pods.
    if (++lowFor >= 4) {
      event.value = `scaled down ${pods.value} → ${desired} after stabilisation window`;
      pods.value = desired;
      lowFor = 0;
    }
  } else lowFor = 0;
  samples.value = [...samples.value.slice(-59), { cpu: cpu.value, pods: pods.value }];
}

function runK6() {
  if (k6.value) return;
  k6.value = true;
  const profile = [10, 30, 60, 90, 100, 100, 70, 40, 10, 5];
  let i = 0;
  event.value = "k6: ramping 100 virtual users…";
  k6Timer = setInterval(() => {
    load.value = profile[i++];
    if (i >= profile.length) {
      clearInterval(k6Timer);
      k6.value = false;
    }
  }, 2400);
}

onMounted(() => (timer = setInterval(tick, 800)));
onBeforeUnmount(() => {
  clearInterval(timer);
  clearInterval(k6Timer);
});

const line = (key, max) => samples.value.map((s, i) => `${(i / 59) * 200},${60 - (s[key] / max) * 56}`).join(" ");
</script>

<template>
  <div class="flex h-full flex-col bg-[#03060a] text-[#cfe3ee]">
    <div class="flex flex-wrap items-center gap-3 border-b border-white/5 px-3 py-1.5 font-mono text-[10px]">
      <label class="flex flex-1 items-center gap-2 text-dim">
        load
        <input v-model.number="load" type="range" min="0" max="100" class="flex-1 accent-[#00ff9c]" aria-label="Virtual users" />
        <b class="w-10 tabular-nums text-fg">{{ load }} VU</b>
      </label>
      <button class="rounded border px-2 py-0.5" :class="k6 ? 'border-warn text-warn' : 'border-white/10 text-dim hover:text-fg'" :disabled="k6" @click="runK6">
        <Icon name="ph:rocket-launch-bold" /> {{ k6 ? "k6 running" : "run k6 profile" }}
      </button>
    </div>

    <div class="grid min-h-0 flex-1 grid-cols-[1fr_1.2fr] gap-3 p-3">
      <div class="flex flex-col">
        <p class="mb-1 font-mono text-[9px] uppercase tracking-widest text-dim">pods {{ pods }}/{{ MAX }}</p>
        <div class="grid flex-1 grid-cols-5 content-start gap-1.5">
          <div
            v-for="i in MAX"
            :key="i"
            class="relative aspect-square overflow-hidden rounded border transition-all duration-500"
            :class="i <= pods ? 'border-neon/60 bg-neon/5' : 'border-dashed border-white/10 opacity-40'"
          >
            <div v-if="i <= pods" class="absolute inset-x-0 bottom-0 transition-all duration-700" :class="cpu > 80 ? 'bg-hot/60' : cpu > TARGET ? 'bg-warn/50' : 'bg-neon/40'" :style="{ height: `${cpu}%` }" />
            <Icon v-if="i <= pods" name="ph:cube-bold" class="absolute inset-0 m-auto text-[11px] text-fg/80" />
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <p class="mb-1 flex justify-between font-mono text-[9px] uppercase tracking-widest">
          <span class="text-warn">cpu {{ cpu.toFixed(0) }}%</span><span class="text-neon">replicas</span>
        </p>
        <svg viewBox="0 0 200 60" class="w-full flex-1" preserveAspectRatio="none" role="img" aria-label="CPU and replica history">
          <line x1="0" :y1="60 - (TARGET / 100) * 56" x2="200" :y2="60 - (TARGET / 100) * 56" stroke="rgba(255,200,61,.35)" stroke-dasharray="3 3" vector-effect="non-scaling-stroke" />
          <polyline :points="line('cpu', 100)" fill="none" stroke="#ffc83d" stroke-width="1.5" vector-effect="non-scaling-stroke" />
          <polyline :points="line('pods', MAX)" fill="none" stroke="#00ff9c" stroke-width="1.5" vector-effect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
    <p class="truncate border-t border-white/5 px-3 py-1.5 font-mono text-[10px] text-neon" aria-live="polite">› {{ event }}</p>
  </div>
</template>
