<script setup>
// Evolves semi-transparent polygons towards a target image, live in the browser.
// A compact (1+1) evolutionary loop, the same idea as GEAhancer's polygon genome at toy scale.
defineProps({ full: Boolean });

const S = 64; // working resolution
const POLYS = 48;

const root = ref(null);
const targetCanvas = ref(null);
const outCanvas = ref(null);
const visible = useElementVisibility(root);
const running = ref(true);
const generation = ref(0);
const fitness = ref(0);
const history = ref([]);
const preset = ref("sunset");

let targetData, work, workCtx, best, bestErr, startErr, raf, uploaded;

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function randomPoly() {
  const cx = rand(0, S), cy = rand(0, S);
  return {
    pts: Array.from({ length: 3 }, () => [cx + rand(-12, 12), cy + rand(-12, 12)]),
    c: [rand(0, 255), rand(0, 255), rand(0, 255), rand(0.08, 0.5)],
  };
}

function draw(ctx, genome, scale = 1) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, S * scale, S * scale);
  for (const p of genome) {
    ctx.fillStyle = `rgba(${p.c[0] | 0},${p.c[1] | 0},${p.c[2] | 0},${p.c[3]})`;
    ctx.beginPath();
    p.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * scale, y * scale) : ctx.moveTo(x * scale, y * scale)));
    ctx.fill();
  }
}

function error(genome) {
  draw(workCtx, genome);
  const d = workCtx.getImageData(0, 0, S, S).data;
  let e = 0;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i] - targetData[i], g = d[i + 1] - targetData[i + 1], b = d[i + 2] - targetData[i + 2];
    e += r * r + g * g + b * b;
  }
  return e;
}

function mutate(genome) {
  const child = genome.map((p) => ({ pts: p.pts.map((q) => [...q]), c: [...p.c] }));
  const p = child[(Math.random() * child.length) | 0];
  const r = Math.random();
  if (r < 0.45) {
    const q = p.pts[(Math.random() * 3) | 0];
    q[0] = clamp(q[0] + rand(-8, 8), -4, S + 4);
    q[1] = clamp(q[1] + rand(-8, 8), -4, S + 4);
  } else if (r < 0.9) {
    const k = (Math.random() * 4) | 0;
    p.c[k] = k === 3 ? clamp(p.c[3] + rand(-0.1, 0.1), 0.03, 0.8) : clamp(p.c[k] + rand(-40, 40), 0, 255);
  } else {
    child[(Math.random() * child.length) | 0] = randomPoly();
  }
  return child;
}

function paintTarget(ctx) {
  if (preset.value === "sunset") {
    const g = ctx.createLinearGradient(0, 0, 0, S);
    g.addColorStop(0, "#1b0b3a");
    g.addColorStop(0.55, "#ff3d7f");
    g.addColorStop(1, "#ffb347");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = "#ffe066";
    ctx.beginPath();
    ctx.arc(S / 2, S * 0.6, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0b0f1a";
    ctx.beginPath();
    ctx.moveTo(0, S);
    ctx.lineTo(0, 46);
    ctx.lineTo(18, 34);
    ctx.lineTo(30, 44);
    ctx.lineTo(46, 30);
    ctx.lineTo(S, 44);
    ctx.lineTo(S, S);
    ctx.fill();
  } else {
    ctx.fillStyle = "#04070b";
    ctx.fillRect(0, 0, S, S);
    ctx.strokeStyle = "#00ff9c";
    ctx.lineWidth = 5;
    ctx.strokeRect(8, 8, 48, 48);
    ctx.fillStyle = "#38d6ff";
    ctx.font = "bold 26px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("eF", S / 2, S / 2 + 1);
  }
}

function setTarget(img) {
  const t = targetCanvas.value.getContext("2d", { willReadFrequently: true });
  t.clearRect(0, 0, S, S);
  if (img) {
    const side = Math.min(img.width, img.height);
    t.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, S, S);
  } else paintTarget(t);
  targetData = t.getImageData(0, 0, S, S).data;
  best = Array.from({ length: POLYS }, randomPoly);
  bestErr = startErr = error(best);
  generation.value = 0;
  history.value = [];
}

function loop() {
  raf = requestAnimationFrame(loop);
  if (!running.value || !visible.value) return;
  for (let i = 0; i < 40; i++) {
    const child = mutate(best);
    const e = error(child);
    if (e <= bestErr) {
      best = child;
      bestErr = e;
    }
    generation.value++;
  }
  // Share of the starting (random) genome's error that evolution has removed.
  fitness.value = Math.max(0, 1 - bestErr / startErr);
  if (generation.value % 400 < 40) history.value = [...history.value.slice(-59), fitness.value];
  draw(outCanvas.value.getContext("2d"), best, 2);
}

function upload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    uploaded = img;
    preset.value = "upload";
    setTarget(img);
    URL.revokeObjectURL(img.src);
  };
  img.src = URL.createObjectURL(file);
}

function restart() {
  setTarget(preset.value === "upload" ? uploaded : null);
}

function choose(p) {
  preset.value = p;
  setTarget();
}

onMounted(() => {
  work = document.createElement("canvas");
  work.width = work.height = S;
  workCtx = work.getContext("2d", { willReadFrequently: true });
  setTarget();
  raf = requestAnimationFrame(loop);
});
onBeforeUnmount(() => cancelAnimationFrame(raf));

const spark = computed(() => history.value.map((v, i) => `${(i / 59) * 100},${30 - v * 30}`).join(" "));
</script>

<template>
  <div ref="root" class="flex h-full flex-col bg-[#03060a] text-[#cfe3ee]">
    <div class="flex flex-wrap items-center gap-1 border-b border-white/5 px-2 py-1.5 font-mono text-[10px]">
      <button v-for="p in ['sunset', 'logo']" :key="p" class="rounded px-2 py-0.5" :class="preset === p ? 'bg-neon/15 text-neon' : 'text-dim hover:text-fg'" @click="choose(p)">
        {{ p }}
      </button>
      <label class="cursor-pointer rounded px-2 py-0.5" :class="preset === 'upload' ? 'bg-neon/15 text-neon' : 'text-dim hover:text-fg'">
        <Icon name="ph:upload-simple-bold" /> your image
        <input type="file" accept="image/*" class="sr-only" @change="upload" />
      </label>
      <button class="ml-auto rounded px-1.5 text-dim hover:text-neon" :aria-label="running ? 'Pause' : 'Resume'" @click="running = !running">
        <Icon :name="running ? 'ph:pause-bold' : 'ph:play-bold'" />
      </button>
      <button class="rounded px-1.5 text-dim hover:text-neon" aria-label="Restart evolution" @click="restart">
        <Icon name="ph:arrow-counter-clockwise-bold" />
      </button>
    </div>
    <div class="flex min-h-0 flex-1 items-center justify-center gap-3 p-3">
      <figure class="flex h-full max-h-40 flex-col items-center gap-1">
        <canvas ref="targetCanvas" :width="S" :height="S" class="aspect-square h-full rounded border border-white/10 [image-rendering:pixelated]" />
        <figcaption class="font-mono text-[9px] uppercase tracking-widest text-dim">target</figcaption>
      </figure>
      <Icon name="ph:arrow-right-bold" class="shrink-0 text-dim" />
      <figure class="flex h-full max-h-40 flex-col items-center gap-1">
        <canvas ref="outCanvas" :width="S * 2" :height="S * 2" class="aspect-square h-full rounded border border-neon/40" />
        <figcaption class="font-mono text-[9px] uppercase tracking-widest text-neon">{{ POLYS }} polygons</figcaption>
      </figure>
    </div>
    <div class="flex items-center gap-3 border-t border-white/5 px-3 py-1.5 font-mono text-[10px]">
      <span class="text-dim">gen <b class="tabular-nums text-fg">{{ generation.toLocaleString("en-US") }}</b></span>
      <span class="text-dim">error ↓ <b class="tabular-nums text-neon">{{ (fitness * 100).toFixed(1) }}%</b></span>
      <svg viewBox="0 0 100 30" class="h-5 flex-1" preserveAspectRatio="none" aria-hidden="true">
        <polyline :points="spark" fill="none" stroke="#00ff9c" stroke-width="1.5" vector-effect="non-scaling-stroke" />
      </svg>
    </div>
  </div>
</template>
