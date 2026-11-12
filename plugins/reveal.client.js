// v-reveal: fades an element in when it scrolls into view.
// Elements already on screen at mount are left alone, so nothing flashes on load.
export default defineNuxtPlugin((nuxtApp) => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" }
  );

  nuxtApp.vueApp.directive("reveal", {
    mounted(el, binding) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add("reveal");
      if (binding.value) el.style.transitionDelay = `${binding.value}ms`;
      observer.observe(el);
    },
    unmounted(el) {
      observer.unobserve(el);
    },
  });
});
