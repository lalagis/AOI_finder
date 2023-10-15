// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: { strict: true },
  modules: [
    '@pinia/nuxt',
    '@formkit/auto-animate/nuxt',
    '@unocss/nuxt',
    'nuxt-mapbox',
  ],
  experimental: {
    // https://vuejs.org/guide/extras/reactivity-transform.html#refs-vs-reactive-variables
    reactivityTransform: true,
  },
  mapbox: {
    accessToken: 'pk.eyJ1IjoiY2lybm9xdnEiLCJhIjoiY2xha2YxOGU3MGxreDN1bWgzbjNvMmw5cCJ9.OOwcII66PaN5yekvw-UN6Q',
  },
  runtimeConfig: {
    public: {
      MAPBOX_STYLE: 'mapbox://styles/cirnoqvq/cliip6ot2005e01qp0axh94g8',
    },
  },
})
