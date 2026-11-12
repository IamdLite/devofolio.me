<script setup>
import { profile, socials } from "~/data/profile";

definePageMeta({
  title: "Contact",
  description: "Send iamdLite a message about red teaming, research, speaking or community work.",
});

const turnstile = ref();
const turnstileToken = ref("");

const form = reactive({ name: "", email: "", topic: "Red team / pentest", message: "" });
const topics = ["Red team / pentest", "Research collaboration", "Speaking / workshop", "eOfbit Society", "Just saying hi"];
const status = ref("idle"); // idle | sending | sent | error
const feedback = ref("");
const copied = ref(false);

async function submit() {
  if (!form.name.trim() || !form.message.trim()) {
    status.value = "error";
    feedback.value = "ERR: name and message are required.";
    return;
  }
  status.value = "sending";
  try {
    await $fetch("/api/submit", {
      method: "POST",
      body: {
        senderName: form.name.trim(),
        senderEmail: form.email.trim(),
        senderMessage: `[${form.topic}]\n\n${form.message.trim()}`,
        turnstileToken: turnstileToken.value,
      },
    });
    status.value = "sent";
    feedback.value = "ACK: transmission received. I'll get back to you soon.";
    form.message = "";
  } catch {
    status.value = "error";
    feedback.value = `ERR: the uplink failed. Email me directly at ${profile.email}.`;
  } finally {
    turnstile.value?.reset();
  }
}

async function copyEmail() {
  await navigator.clipboard?.writeText(profile.email).catch(() => {});
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <div class="container-cy py-14">
    <header class="mb-10 max-w-3xl">
      <p class="kicker mb-3">// ./transmit --secure</p>
      <h1 class="h-display text-4xl sm:text-5xl"><ScrambleText text="Open a channel" /></h1>
      <p class="mt-4 text-lg text-dim">Red team engagement, research collaboration, a talk, or a meme you think beats mine. Drop it here.</p>
    </header>

    <div class="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <form class="hud space-y-5 p-6 sm:p-8" novalidate @submit.prevent="submit">
        <div class="grid gap-5 sm:grid-cols-2">
          <label class="block space-y-2">
            <span class="font-mono text-xs text-dim">name <span class="text-hot">*</span></span>
            <input v-model="form.name" name="name" class="input-cy" placeholder="Ada Lovelace" autocomplete="name" required />
          </label>
          <label class="block space-y-2">
            <span class="font-mono text-xs text-dim">email <span class="opacity-60">(optional)</span></span>
            <input v-model="form.email" type="email" name="email" class="input-cy" placeholder="you@domain.com" autocomplete="email" />
          </label>
        </div>
        <fieldset>
          <legend class="mb-2 font-mono text-xs text-dim">topic</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="t in topics" :key="t" class="cursor-pointer">
              <input v-model="form.topic" type="radio" name="topic" :value="t" class="peer sr-only" />
              <span class="block rounded border border-line px-3 py-1.5 font-mono text-xs text-dim transition peer-checked:border-neon peer-checked:bg-neon/10 peer-checked:text-neon peer-focus-visible:ring-2 peer-focus-visible:ring-neon">{{ t }}</span>
            </label>
          </div>
        </fieldset>
        <label class="block space-y-2">
          <span class="font-mono text-xs text-dim">message <span class="text-hot">*</span></span>
          <textarea v-model="form.message" name="message" rows="6" class="input-cy resize-y" placeholder="> what's on your mind?" required />
        </label>

        <NuxtTurnstile ref="turnstile" v-model="turnstileToken" />

        <p v-if="feedback" class="rounded border px-3 py-2 font-mono text-xs" :class="status === 'sent' ? 'border-neon/50 bg-neon/10 text-neon' : 'border-hot/50 bg-hot/10 text-hot'" role="status">
          {{ feedback }}
        </p>

        <button class="btn-neon w-full sm:w-auto" :disabled="status === 'sending'">
          <Icon :name="status === 'sending' ? 'svg-spinners:3-dots-fade' : 'ph:paper-plane-tilt-bold'" />
          {{ status === "sending" ? "encrypting…" : "Send transmission" }}
        </button>
      </form>

      <aside class="space-y-4">
        <button class="hud hud-hover flex w-full items-center gap-4 p-5 text-left" @click="copyEmail">
          <Icon name="ph:envelope-simple-bold" size="28" class="text-neon" />
          <span class="min-w-0">
            <span class="block font-semibold">Email</span>
            <span class="block truncate font-mono text-xs text-dim">{{ profile.email }}</span>
          </span>
          <span class="ml-auto font-mono text-[10px] text-neon">{{ copied ? "copied ✓" : "copy" }}</span>
        </button>
        <a :href="profile.community" target="_blank" rel="noopener" class="hud hud-hover flex items-center gap-4 p-5">
          <Icon name="simple-icons:telegram" size="28" class="text-ice" />
          <span>
            <span class="block font-semibold">Learn to hack with eOfbit</span>
            <span class="font-mono text-xs text-dim">free community on Telegram</span>
          </span>
        </a>
        <div class="hud p-5">
          <p class="kicker mb-3">// elsewhere</p>
          <div class="grid grid-cols-2 gap-2">
            <a v-for="s in socials" :key="s.name" :href="s.url" target="_blank" rel="noopener" class="flex items-center gap-2 rounded border border-line/60 px-3 py-2 font-mono text-xs text-dim transition hover:border-neon/50 hover:text-neon">
              <Icon :name="s.icon" /> {{ s.name }}
            </a>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
