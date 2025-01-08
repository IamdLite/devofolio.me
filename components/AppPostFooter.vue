<template>
  <section
    class="flex items-center [&>span]:text-zinc-300 [&>span]:dark:text-zinc-700 space-x-3 text-zinc-400 [&>a]:border-b-[.1rem]"
  >
    <p class="my-0 font-bold">Reach Out</p>

    <Icon name="heroicons:chevron-right-20-solid" class="text-blue-500" />

    <nuxt-link
      class="focus-visible:global-focus"
      to="https://twitter.com/esdras_fopa"
      target="_blank"
      external
      >Twitter
    </nuxt-link>

    <span>&bull;</span>

    <nuxt-link
      class="focus-visible:global-focus"
      to="https://github.com/esdrasfopa"
      target="_blank"
      external
      >GitHub
    </nuxt-link>

    <span>&bull;</span>

    <nuxt-link
      class="focus-visible:global-focus"
      to="https://linkedin.com/in/eofbit"
      target="_blank"
      external
      >LinkedIn
    </nuxt-link>
  </section>
</template>
