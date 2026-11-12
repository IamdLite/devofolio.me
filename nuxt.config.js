import tailwindTypography from '@tailwindcss/typography'

// Theme colours are CSS variables (see assets/css/main.css) so dark/light swap at runtime.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

// Runs before first paint so the cyber (dark) theme never flashes light.
const themeBootstrap = `try{var t=localStorage.getItem('vueuse-color-scheme');if(t!=='light')document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}`

export default defineNuxtConfig({
  hooks: {
    // nuxi 3.12 routes Vite HMR through its own listener, but Nuxt 3.11 still tells the browser
    // to connect on the dedicated HMR port, which then never opens. Keep the dedicated port.
    "vite:extendConfig"(config, { isClient }) {
      if (isClient && config.server?.hmr?.port) delete config.server.hmr.server;
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        class: 'dark',
      },
      meta: [
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'author', content: 'iamdLite' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#05080c' },
      ],
      link: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/icons/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          sizes: '32x32',
          href: '/icons/favicon-32x32.png',
        },
        {
          rel: 'icon',
          sizes: '16x16',
          href: '/icons/favicon-16x16.png',
        },
        {
          rel: 'manifest',
          href: '/icons/site.webmanifest',
        },
      ],
      script: [
        { innerHTML: themeBootstrap, tagPosition: 'head' },
        {
          type: 'text/partytown',
          src: 'https://measure.esdrasfopa.dev/',
          async: true,
          'data-website-id': '1e0e9daa-a25b-4943-af4e-68c91b2d3c72',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  css: ['~/assets/css/main.css'],

  components: [{ path: '~/components', pathPrefix: false }],

  content: {
    contentHead: false,
    documentDriven: false,
    highlight: {
      theme: 'github-dark',
      preload: ['py'],
    },
    ignores: ['drafts', 'template.md', '/drafts/', '\\.yml$'],
    markdown: {
      toc: { depth: 1, searchDepth: 2 },
    },
  },

  modules: [
    '@nuxt/content',
    '@nuxtjs/partytown',
    '@nuxtjs/turnstile',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-icon',
  ],

  routeRules: {
    '/**': { prerender: true },
    '/projects/more': { redirect: '/projects' },
    '/projects/surveypal': { redirect: '/projects' },
    '/projects/based-adder': { redirect: '/projects' },
    '/projects/based_adder': { redirect: '/projects' },
    '/projects/smarthome': { redirect: '/projects' },
    '/projects/jungle_simulator': { redirect: '/projects' },
    '/projects/moodle_replacement': { redirect: '/projects' },
    '/projects/gazpromneftsat': { redirect: '/projects' },
    '/projects/lunar-habitat': { redirect: '/projects' },
    '/resume': { redirect: '/journey' },
    '/bookmarks': { redirect: '/' },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      // A flaky third-party feed (Medium) should not break the whole build.
      failOnError: false,
    },
  },

  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY,
    resendFrom: process.env.RESEND_FROM,
    resendTo: process.env.RESEND_TO,
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    config: {
      darkMode: 'class',
      content: [
        './app.vue',
        './error.vue',
        './components/**/*.vue',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './data/**/*.js',
      ],
      theme: {
        extend: {
          colors: {
            void: token('void'),
            panel: token('panel'),
            panel2: token('panel2'),
            line: token('line'),
            fg: token('fg'),
            dim: token('dim'),
            neon: token('neon'),
            ice: token('ice'),
            hot: token('hot'),
            warn: token('warn'),
          },
          fontFamily: {
            display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
            mono: ['"JetBrains Mono Variable"', '"Roboto Mono"', 'ui-monospace', 'monospace'],
          },
          boxShadow: {
            glow: '0 0 0 1px rgb(var(--neon) / .35), 0 0 24px -4px rgb(var(--neon) / .45)',
            'glow-ice': '0 0 0 1px rgb(var(--ice) / .35), 0 0 24px -4px rgb(var(--ice) / .45)',
          },
        },
      },
      plugins: [tailwindTypography],
    },
  },

  telemetry: false,

  turnstile: {
    siteKey: '0x4AAAAAAABlDwSHN3HVmFWH',
  },

  compatibilityDate: '2025-01-04',
})
