// SSR no-op for v-reveal so prerendered pages render content visibly.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("reveal", { getSSRProps: () => ({}) });
});
