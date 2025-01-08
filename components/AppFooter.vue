<!-- Footer: Tech Stack -->
<template>
  <footer class="flex items-center justify-start h-8">
    <p
      class="flex items-center text-base font-medium text-zinc-400 dark:text-zinc-500"
    >
      Built from:
      <nuxt-link
        class="icon-link focus-visible:global-focus text-black hover:text-gray-700"
        to="https://github.com/baimamboukar/devfolio"
        aria-label="Devfolio Github Repo"
        target="_blank"
        title="Devfolio Github Repo"
        external
      >
        <Icon name="simple-icons:github" />
      </nuxt-link>

      <span>&bull;</span>
      <nuxt-link
        class="icon-link focus-visible:global-focus text-[#00DC82] hover:text-[#33FFA4]"
        to="https://nuxt.com/"
        aria-label="NuxtJS Website"
        target="_blank"
        title="NuxtJS"
        external
      >
        <Icon name="simple-icons:nuxtdotjs" />
      </nuxt-link>
      <span>&bull;</span>
      <nuxt-link
        class="icon-link focus-visible:global-focus text-[#38bdf8] hover:text-[#63dfff]"
        to="https://tailwindcss.com/"
        aria-label="Tailwind CSS Website"
        target="_blank"
        title="Tailwind CSS"
        external
      >
        <Icon name="simple-icons:tailwindcss" />
      </nuxt-link>
      <span>&bull;</span>
      <nuxt-link
        class="icon-link focus-visible:global-focus text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
        to="https://vercel.com"
        aria-label="Vercel Website"
        target="_blank"
        title="Vercel"
        external
      >
        <Icon name="simple-icons:vercel" />
      </nuxt-link>

    </p>
  </footer>
</template>

<style scoped>
  footer {
    @apply mt-10 mb-6 !important;
  }

  a:last-of-type {
    @apply mr-0 !important;
  }
</style>
