// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: { strict: true },
  modules: [
    '@pinia/nuxt',
    '@formkit/auto-animate/nuxt',
    '@unocss/nuxt',
  ],
  experimental: {
    // https://vuejs.org/guide/extras/reactivity-transform.html#refs-vs-reactive-variables
    reactivityTransform: true,
  },
})
