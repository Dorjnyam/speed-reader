// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'static', // ✅ ensure static output
    prerender: {
      routes: ['/'] // or any page routes you want to pre-render
    }
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss'
  ],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    config: {},
    viewer: true,
    exposeConfig: false,
  },
  app: {
    baseURL: '/speed-reader/',
    head: {
      title: 'Speed Reader - Read Faster',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Speed reading application with 300-400 WPM capability' }
      ]
    }
  },
})