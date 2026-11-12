<script setup>
import { profile, socials } from "~/data/profile";
import { projects } from "~/data/projects";

const open = usePaletteOpen();
const terminalOpen = useTerminalOpen();
const matrixBoost = useMatrixBoost();
const { toggleTheme } = useTheme();
const router = useRouter();

const query = ref("");
const active = ref(0);
const inputEl = ref(null);
const copied = ref(false);

const items = computed(() => [
  { group: "Pages", label: "Home", icon: "ph:house-bold", run: () => router.push("/") },
  ...navLinks.map((l) => ({ group: "Pages", label: l.label, icon: l.icon, run: () => router.push(l.to) })),
  { group: "Pages", label: "Contact", icon: "ph:paper-plane-tilt-bold", run: () => router.push("/contact") },
  ...projects.map((p) => ({
    group: "Projects",
    label: p.title,
    hint: p.tagline,
    icon: "ph:cube-bold",
    run: () => router.push(`/projects/${p.slug}`),
  })),
  { group: "Actions", label: "Open terminal", icon: "ph:terminal-window-bold", run: () => (terminalOpen.value = true) },
  { group: "Actions", label: "Toggle theme", icon: "ph:circle-half-bold", run: toggleTheme },
  {
    group: "Actions",
    label: copied.value ? "Email copied!" : "Copy email address",
    hint: profile.email,
    icon: "ph:copy-bold",
    keep: true,
    run: async () => {
      await navigator.clipboard?.writeText(profile.email).catch(() => {});
      copied.value = true;
      setTimeout(() => (copied.value = false), 1500);
    },
  },
  { group: "Actions", label: "Download resume (PDF)", icon: "ph:file-arrow-down-bold", run: () => window.open(profile.resumeUrl, "_blank", "noopener") },
  { group: "Actions", label: "Enter the matrix", icon: "ph:binary-bold", run: () => (matrixBoost.value = !matrixBoost.value) },
  ...socials.map((s) => ({ group: "Socials", label: s.name, icon: s.icon, run: () => window.open(s.url, "_blank", "noopener") })),
]);

const results = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(q));
});

watch(results, () => (active.value = 0));
watch(open, (v) => {
  if (!v) return;
  query.value = "";
  nextTick(() => inputEl.value?.focus());
});

function select(item) {
  if (!item) return;
  item.run();
  if (!item.keep) open.value = false;
}

function onKey(e) {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    active.value = (active.value + 1) % results.value.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    active.value = (active.value - 1 + results.value.length) % results.value.length;
  } else if (e.key === "Enter") {
    e.preventDefault();
    select(results.value[active.value]);
  } else if (e.key === "Escape") {
    open.value = false;
  }
}

watch(active, (i) => nextTick(() => document.getElementById(`cmd-${i}`)?.scrollIntoView({ block: "nearest" })));
</script>

<template>
  <Teleport to="body">
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0" enter-active-class="transition duration-150" leave-active-class="transition duration-100">
      <div v-if="open" class="fixed inset-0 z-[80] flex items-start justify-center bg-void/70 px-3 pt-[12vh] backdrop-blur-sm" @mousedown.self="open = false">
        <div class="hud w-full max-w-xl overflow-hidden !bg-panel shadow-2xl" role="dialog" aria-label="Command palette">
          <div class="flex items-center gap-3 border-b border-line px-4">
            <Icon name="ph:magnifying-glass-bold" class="text-neon" />
            <input
              ref="inputEl"
              v-model="query"
              class="h-14 w-full bg-transparent font-mono text-sm text-fg outline-none placeholder:text-dim focus-visible:ring-0"
              placeholder="Jump to a page, project or action…"
              role="combobox"
              aria-expanded="true"
              aria-controls="cmd-list"
              :aria-activedescendant="`cmd-${active}`"
              @keydown="onKey"
            />
            <kbd class="rounded border border-line px-1.5 font-mono text-[10px] text-dim">esc</kbd>
          </div>
          <ul id="cmd-list" class="max-h-[50vh] overflow-y-auto p-2" role="listbox">
            <li v-if="!results.length" class="px-3 py-8 text-center font-mono text-sm text-dim">no match. try `terminal`.</li>
            <template v-for="(item, i) in results" :key="item.group + item.label">
              <li v-if="i === 0 || results[i - 1].group !== item.group" class="kicker px-3 pb-1 pt-3 !text-[10px] !text-dim" role="presentation">
                {{ item.group }}
              </li>
              <li
                :id="`cmd-${i}`"
                role="option"
                :aria-selected="i === active"
                class="flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm"
                :class="i === active ? 'bg-neon/10 text-neon' : 'text-fg'"
                @mousemove="active = i"
                @click="select(item)"
              >
                <Icon :name="item.icon" class="shrink-0" />
                <span class="truncate">{{ item.label }}</span>
                <span v-if="item.hint" class="ml-auto hidden truncate text-xs text-dim sm:block">{{ item.hint }}</span>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
