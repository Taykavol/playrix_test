export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'playrix_test',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],
  env:{
    GITHUB_CLIENT_ID:process.env.NODE_ENV == 'production'?'60058fc45d61e8d0b067':'fea7053d2c2a62e68910',
    GITHUB_SECRET:process.env.NODE_ENV == 'production'?'752c03d03760a0420e2e9ba88c509cff9f877b55':'d434dbdd070a079542dcae3a17db2c9ec5b0dfca',
    GET_ACCESS_TOKEN_URI:process.env.NODE_ENV == 'production'?'https://stormy-garden-05044.herokuapp.com/':'http://localhost:4000'
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
