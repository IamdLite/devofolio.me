<script setup>
// Hacker-game style profiler. A corner HUD "profiles" the visitor from what their own browser
// already exposes (nothing is sent anywhere), and scan mode (Q) shows a readout for anything
// marked with data-scan="TYPE|Name|detail".
const route = useRoute();
const scanMode = useScanMode();
const collapsed = useLocalStorage("profiler-collapsed", true, { initOnMounted: true });
const hidden = useLocalStorage("profiler-hidden", false, { initOnMounted: true });
const mounted = useMounted();

const visitor = ref(null);
const clock = ref("");
const scanned = ref(new Set());

function detect() {
  const ua = navigator.userAgent;
  const os = /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Unknown";
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Unknown";
  const id = sessionStorage.getItem("visitor-id") ?? Math.random().toString(16).slice(2, 8);
  sessionStorage.setItem("visitor-id", id);
  return {
    id: `visitor_${id}`,
    device: `${os} · ${browser}`,
    screen: `${screen.width}×${screen.height}`,
    lang: navigator.language,
    link: navigator.connection?.effectiveType?.toUpperCase() ?? "—",
  };
}

// A playful guess from the pages visited so far.
const occupation = computed(() => {
  const seen = scanned.value;
  if (seen.has("/contact") || seen.has("/journey")) return "Recruiter (probably)";
  if (seen.has("/research")) return "Researcher";
  if (seen.has("/memes")) return "Professional procrastinator";
  if ([...seen].some((p) => p.startsWith("/projects"))) return "Engineer";
  return "Unknown";
});

let clockTimer;
onMounted(() => {
  try {
    visitor.value = detect();
  } catch {
    visitor.value = { id: "visitor_anon", device: "—", screen: "—", lang: "—", link: "—" };
  }
  const tick = () => (clock.value = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  tick();
  clockTimer = setInterval(tick, 1000);
});
onBeforeUnmount(() => clearInterval(clockTimer));
watch(() => route.path, (p) => (scanned.value = new Set([...scanned.value, p])), { immediate: true });

// ── Scan mode ──
const target = ref(null);
onKeyStroke("q", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest?.("input, textarea, [contenteditable]")) return;
  scanMode.value = !scanMode.value;
});
onKeyStroke("Escape", () => (scanMode.value = false));
watch(scanMode, (on) => {
  document.documentElement.classList.toggle("scan-mode", on);
  if (!on) target.value = null;
});
function onMove(e) {
  if (!scanMode.value) return;
  const el = e.target.closest?.("[data-scan]");
  if (!el) return (target.value = null);
  const [type, name, detail] = el.dataset.scan.split("|");
  const r = el.getBoundingClientRect();
  target.value = { type, name, detail, x: Math.min(e.clientX + 18, window.innerWidth - 280), y: Math.min(e.clientY + 18, window.innerHeight - 140), rect: r };
}
onMounted(() => useEventListener(window, "pointermove", onMove, { passive: true }));
</script>

<template>
  <div class="print:hidden">
    <!-- Visitor profiler -->
    <aside
      v-if="mounted && visitor && !hidden"
      class="dark fixed bottom-4 left-4 z-40 hidden w-64 overflow-hidden sm:block rounded-md border border-[#38d6ff]/40 bg-[#03060a]/90 font-mono text-[11px] text-[#cfe3ee] shadow-2xl backdrop-blur"
      aria-label="Visitor profiler"
    >
      <div class="flex items-center gap-2 border-b border-[#38d6ff]/30 bg-[#38d6ff]/10 px-3 py-1.5">
        <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#38d6ff]" />
        <span class="flex-1 tracking-widest text-[#38d6ff]">PROFILER</span>
        <button class="text-[#7f95a5] hover:text-white" :aria-label="collapsed ? 'Expand profiler' : 'Collapse profiler'" @click="collapsed = !collapsed">
          <Icon :name="collapsed ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" />
        </button>
        <button class="text-[#7f95a5] hover:text-white" aria-label="Hide profiler" @click="hidden = true"><Icon name="ph:x-bold" /></button>
      </div>
      <div v-if="!collapsed" class="space-y-0.5 px-3 py-2">
        <p class="text-[13px] font-bold text-white">{{ visitor.id }}</p>
        <p><span class="text-[#7f95a5]">occupation </span>{{ occupation }}</p>
        <p><span class="text-[#7f95a5]">device     </span>{{ visitor.device }}</p>
        <p><span class="text-[#7f95a5]">screen     </span>{{ visitor.screen }}</p>
        <p><span class="text-[#7f95a5]">language   </span>{{ visitor.lang }}</p>
        <p><span class="text-[#7f95a5]">link       </span>{{ visitor.link }}</p>
        <p><span class="text-[#7f95a5]">local time </span>{{ clock }}</p>
        <p><span class="text-[#7f95a5]">pages      </span>{{ scanned.size }} scanned</p>
        <p><span class="text-[#7f95a5]">threat     </span><span class="text-[#00ff9c]">LOW</span></p>
        <button
          class="mt-2 w-full rounded border px-2 py-1 transition"
          :class="scanMode ? 'border-[#ff3d6e] text-[#ff3d6e]' : 'border-[#38d6ff]/50 text-[#38d6ff] hover:bg-[#38d6ff]/10'"
          @click="scanMode = !scanMode"
        >
          {{ scanMode ? "■ stop scan (Q)" : "▶ scan mode (Q)" }}
        </button>
        <p class="pt-1 text-[9px] text-[#7f95a5]">read from your own browser · nothing leaves it</p>
      </div>
    </aside>
    <button
      v-else-if="mounted && hidden"
      class="dark fixed bottom-4 left-4 z-40 hidden h-9 w-9 sm:grid place-items-center rounded-md border border-[#38d6ff]/40 bg-[#03060a]/90 text-[#38d6ff]"
      aria-label="Show profiler"
      @click="hidden = false"
    >
      <Icon name="ph:fingerprint-bold" />
    </button>

    <!-- Scan readout -->
    <template v-if="scanMode && target">
      <div
        class="pointer-events-none fixed z-[85] rounded-sm border border-[#38d6ff] shadow-[0_0_0_1px_rgba(56,214,255,.3),0_0_24px_rgba(56,214,255,.25)] transition-all duration-150"
        :style="{ left: `${target.rect.left - 4}px`, top: `${target.rect.top - 4}px`, width: `${target.rect.width + 8}px`, height: `${target.rect.height + 8}px` }"
      />
      <div
        class="dark pointer-events-none fixed z-[86] w-64 border-l-2 border-[#38d6ff] bg-[#03060a]/95 px-3 py-2 font-mono text-[11px] text-[#cfe3ee] shadow-2xl"
        :style="{ left: `${target.x}px`, top: `${target.y}px` }"
      >
        <p class="tracking-widest text-[#38d6ff]">{{ target.type }}</p>
        <p class="text-[13px] font-bold text-white">{{ target.name }}</p>
        <p v-if="target.detail" class="text-[#7f95a5]">{{ target.detail }}</p>
        <p class="mt-1 text-[#00ff9c]">▸ click to breach</p>
      </div>
    </template>
    <div v-if="scanMode" class="dark pointer-events-none fixed inset-x-0 top-16 z-[84] mx-auto w-fit rounded-b border border-t-0 border-[#38d6ff]/50 bg-[#03060a]/90 px-3 py-1 font-mono text-[11px] tracking-widest text-[#38d6ff]">
      SCAN MODE · hover to profile · Q or Esc to exit
    </div>
  </div>
</template>
