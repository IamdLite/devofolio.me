<script setup>
useHead({
  titleTemplate: "%s · Esdras Fopa",
});

const route = useRoute();

const serverMeta = {
  ogImage: "/og-image.png",
  twitterImage: "/og-image.png",
  ogType: "website",
  ogLocale: "en_US",
  twitterCard: "summary",
  twitterCreator: "@esdras_fopa",
};

useSeoMeta({
  title: () => route.meta.title,
  description: () => route.meta.description,
  ogTitle: () => `${route.meta.title} · Esdras Fopa`,
  twitterTitle: () => `${route.meta.title} · Esdras Fopa`,
  ogDescription: () => route.meta.description,
  twitterDescription: () => route.meta.description,
  ogUrl: () => `localhost:3000/${route.path}`,
  ...serverMeta,
});
</script>

<!-- Default Layout -->
<template>
  <main id="main-content">
    <slot />
  </main>
</template>
