<script setup>
import { profile, skills } from "~/data/profile";

definePageMeta({
  title: "About",
  description: "Who is iamdLite: the scam that started it, the community that grew from it, and the road to red teaming and space.",
});

const photos = [
  { src: "/content/say_me_1.jpg", alt: "Performing a poem about war on stage" },
  { src: "/content/say_3.png", alt: "Travelling and visiting museums" },
  { src: "/content/space_me.jpeg", alt: "With my cybersecurity mentees" },
];
const lightbox = ref(null);
</script>

<template>
  <div class="container-cy py-14">
    <header class="mb-14 max-w-3xl">
      <p class="kicker mb-3">// cat about.md</p>
      <h1 class="h-display text-4xl sm:text-5xl"><ScrambleText text="Hey, I'm iamdLite" /></h1>
      <p class="mt-4 text-xl text-dim">
        Online I go by <span class="hl">iamdLite</span>. I'm a chill guy who gets the job done:
        red teaming, space systems engineering and research, and technical writing.
      </p>
    </header>

    <div class="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
      <div class="space-y-6 text-lg leading-relaxed text-dim">
        <section class="hud p-6">
          <p class="kicker mb-3">chapter 01 · the breach</p>
          <p>
            My mum insisted I sit the medical school entrance exams. Dr. Ben Carson in <span class="hl">Gifted Hands</span> had convinced me too,
            so I did. I failed. Shortly after, my mum got <span class="hl">scammed</span> out of half a million XAF.
          </p>
          <p class="mt-4">
            That was the first echo of my calling. It led me to a <span class="hl">computer science</span> major with a minor in cybersecurity,
            and to founding <span class="hl">eOfbit Society</span>, a community (now a non-profit) that fights cybercrime through education.
          </p>
        </section>

        <figure class="hud overflow-hidden p-2">
          <img src="/content/eof-light-medium.jpg" alt="Logo of the eOfbit Society non-profit" loading="lazy" class="w-full rounded" />
          <figcaption class="px-2 py-2 font-mono text-xs text-dim">
            eOfbit Society: 8,000+ people reached across five countries since 2018.
          </figcaption>
        </figure>

        <section class="hud p-6">
          <p class="kicker mb-3">chapter 02 · lateral movement</p>
          <p>
            I spent most of my "free" time at university <span class="hl">volunteering</span> with startups and leading initiatives: TourCMR, Open
            Dreams, STEM Ignite, The ICT University Foundation, eOfbit Society, Hustlin', Project CHILL (USAID) and more.
          </p>
          <p class="mt-4">
            Being an <span class="hl">activist</span> built my skills in cybersecurity, leadership, software development, public speaking, content
            marketing and branding.
          </p>
        </section>

        <section class="hud p-6">
          <p class="kicker mb-3">chapter 03 · escalation to orbit</p>
          <p>
            While studying abroad, I was flabbergasted to learn that Neil Armstrong wasn't the first human in space. That was
            <span class="hl">Yuri Gagarin</span>, aboard Vostok 1.
            <a href="https://youtu.be/ovVqUcCVzkk?si=TAPr85ObTchGWYho" target="_blank" rel="noopener" class="link-cy text-fg">I tell his story in this video [RU]</a>.
            That's what turned me into an award-winning <span class="hl">space enthusiast</span>.
          </p>
        </section>
      </div>

      <aside class="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div class="hud p-6">
          <p class="kicker mb-4">// quick facts</p>
          <dl class="grid grid-cols-[6rem_1fr] gap-y-3 font-mono text-sm">
            <dt class="text-dim">alias</dt><dd>@{{ profile.handle }}</dd>
            <dt class="text-dim">languages</dt><dd>English · French · Russian</dd>
            <dt class="text-dim">rank</dt><dd>TryHackMe Guru</dd>
            <dt class="text-dim">off-duty</dt><dd>poetry, photography, vlogging, memes</dd>
          </dl>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <button v-for="p in photos" :key="p.src" class="group overflow-hidden rounded border border-line" :aria-label="`Enlarge: ${p.alt}`" @click="lightbox = p">
            <img :src="p.src" :alt="p.alt" loading="lazy" class="aspect-square w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
          </button>
        </div>
        <p class="font-mono text-xs text-dim">
          They say a picture is worth a thousand words.
          <NuxtLink to="/contact" class="link-cy text-fg">Tell me</NuxtLink> what these say about me.
        </p>
      </aside>
    </div>

    <section class="mt-24">
      <SectionHeading kicker="toolbox" title="What I work with" />
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="(s, i) in skills" :key="s.group" v-reveal="(i % 3) * 80" class="hud hud-hover p-5">
          <p class="mb-3 flex items-center gap-2 font-semibold"><Icon :name="s.icon" class="text-neon" size="20" /> {{ s.group }}</p>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="item in s.items" :key="item" class="chip">{{ item }}</span>
          </div>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="lightbox" class="fixed inset-0 z-[85] grid place-items-center bg-void/90 p-4 backdrop-blur" role="dialog" :aria-label="lightbox.alt" @click="lightbox = null">
        <img :src="lightbox.src" :alt="lightbox.alt" class="max-h-[85vh] max-w-full rounded border border-line" />
      </div>
    </Teleport>
  </div>
</template>
