<script setup>
useHead({
  titleTemplate: (title) => (title && title !== "iamdLite" ? `${title} · iamdLite` : "iamdLite — Red Teamer & Security Researcher"),
});

const route = useRoute();

useSeoMeta({
  title: () => route.meta.title,
  description: () => route.meta.description,
  ogTitle: () => `${route.meta.title ?? "iamdLite"} · iamdLite`,
  twitterTitle: () => `${route.meta.title ?? "iamdLite"} · iamdLite`,
  ogDescription: () => route.meta.description,
  twitterDescription: () => route.meta.description,
  ogUrl: () => `https://esdrasfopa.vercel.app${route.path}`,
  ogImage: "/og-image.png",
  twitterImage: "/og-image.png",
  ogType: "website",
  ogLocale: "en_US",
  twitterCard: "summary_large_image",
  twitterCreator: "@iamdlite",
});
</script>

<!-- Default Layout -->
<template>
  <main id="main-content" class="overflow-x-clip pt-16">
    <slot />
  </main>
</template>
