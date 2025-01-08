<script setup>
definePageMeta({
  title: "About",
  description: "Who is Esdras Fopa",
});
</script>

<!-- About Page -->
<template>
  <article>
    <!-- Name  -->
    <h1 class="mb-4 text-2xl font-semibold">About Me</h1>
    <!-- Short Bio Summary -->
    <p>
      Hey, call me Esdras, but I call myself
      <span class="highlight">iamdLite</span> because why not.
      I am just a chill guy that gets the job&mdash;red teaming, space systems engineering & research, and content/technical writing&mdash;done.
    </p>
    <!-- <p class="my-2 text-zinc-700 dark:text-zinc-300">
      I am
      <span class="subtle-highlight">currently seeking opportunities</span>
      to share my passion and expertise.
    </p> -->
    <app-divider class="md:my-6" />
    <p>
      My journey into tech still awes me. My mum insisted that I sit for the entrance exams into med 
      school, which I did (Dr. Ben Carson from the movie 
      <span class="highlight">Gifted Hands</span> convinced me), but I failed it. Afterwards, my mum got 
      <span class="highlight">scammed</span> half a million XAF.
    </p>
    <figure class="my-2">
      <picture>
        <source
          media="(max-width: 23px)"
          srcset="/content/eof-light-small.jpg"
        />
        <source media="(min-width: 1024px)" srcset="/content/eof-light-medium.jpg" />
        <nuxt-img
          loading="lazy"
          preload
          placeholder
          format="webp"
          height="20"
          src="content/eof-light.jpg"
          alt="Logo of the eOfbit Society non-profit association"
          class="object-cover w-full mb-1 text-center border rounded-lg border-zinc-200 dark:border-transparent"
        />
      </picture>
      <figcaption class="text-sm text-center text-zinc-500">
        The logo of the cybersecurity community&mdash;now a non-profit association&mdash;that I founded to fight back against cybercrime
      </figcaption>
    </figure>
    <p>
      That was how I heard the first echoes of my calling, which led me into a
      <span class="highlight">Computer science</span> major at University with a minor in cybersecurity.
    </p>
    <p>
      I spent most of my "free" time in University <span class="highlight">volunteering</span> in startups and/or leading initiatives including
      TourCMR, Open Dreams, STEM Ignite, The ICT University Foundation, eOfbit Society, Hustlin', Project CHILL by USAID, and some more. 
    </p>
    <p>
      Being an <span class="highlight">activist</span> tremendously contributed to building up my skills in cybersecurity, leadership, software development, public speaking, content marketing and branding. 
    </p>
    <app-divider class="md:my-6" />
    <p>
      During my journey studying abroad, I was flabbergasted to discover that Neil Armstrong wasn't the first man in space. In fact, the first citizen of the Universe was <span class="highlight">Yuri Gagarin </span> aboard Vostok.
      <a
        href="https://youtu.be/ovVqUcCVzkk?si=TAPr85ObTchGWYho"
        class="focus-visible:global-focus focus-visible:rounded no-underline border-b-[.1rem] border-b-blue-500/75"
        target="_blank"
        external
        >I share his story in this video [RU]
        </a>.
      Now you know what triggered me to become an award-winning 
      <span class="highlight">space enthusiast</span>.
    </p>
    <br />
    <app-divider class="md:my-6" />
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 my-4 [&>img]:ring [&>img]:ring-zinc-300 [&>img]:dark:ring-zinc-800"
    >
      <nuxt-img
        preload
        placeholder
        format="webp"
        loading="lazy"
        height="200"
        src="/content/say_me_1.jpg"
        alt="Esdras Fopa presenting a poem about war"
        class="object-cover w-full text-center rounded-lg"
      />
      <nuxt-img
        preload
        placeholder
        format="webp"
        loading="lazy"
        height="200"
        src="/content/say_3.png"
        alt="Esdras Fopa travelling, visiting meseums and learning about cultures"
        class="object-cover w-full text-center rounded-lg"
      />
      <nuxt-img
        preload
        placeholder
        format="webp"
        loading="lazy"
        height="200"
        src="/content/space_me.jpeg"
        alt="Esdras Fope and the students his cybersecurity mentees"
        class="object-cover w-full text-center rounded-lg"
      />
    </div>
    <br />
    <p>
      They say a picture is worth a thousand words. 
      <a
        href="https://linktr.ee/iamdlite"
        class="focus-visible:global-focus focus-visible:rounded no-underline border-b-[.1rem] border-b-blue-500/75"
        target="_blank"
      >
        Let me know 
      </a>
      if you find out what those ones say about me.
    </p>
  </article>
</template>

<style scoped>
p {
  @apply text-zinc-700 dark:text-zinc-300 my-4 text-base leading-relaxed;
}
</style>
