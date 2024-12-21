export default defineNuxtConfig({
    devtools: {enabled: true},

    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/supabase',
        '@nuxt/image',
        '@nuxt/icon'
    ],

    plugins: [
        {src: '~/plugins/maska.client.ts', mode: 'client'}
    ],

    css: ['~/assets/css/main.css'],

    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
        }
    },

    image: {
        provider: 'ipx',
        quality: 80,
        format: ['webp'],
        screens: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536,
        }
    },

    nitro: {
        compressPublicAssets: true,
        prerender: {
            routes: [] // Hiçbir route prerender edilmez
        },
        preset: 'cloudflare'
    },

    runtimeConfig: {
        public: {
            SUPABASE_URL: process.env.SUPABASE_URL,
            SUPABASE_KEY: process.env.SUPABASE_KEY
        }
    },

    supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
        redirectOptions: {*
            login: '/auth/login',
            callback: '/confirm',
            exclude: ['/*'],
        }
    },

    routeRules: {
        // SPA geçişleri için
        '/': {prerender: true},
        '/products/**': {swr: 3600},
        '/categories/**': {swr: 3600},
    },

    tailwindcss: {
        cssPath: '~/assets/css/main.css',
        configPath: 'tailwind.config.js',
        exposeConfig: false,
        viewer: true,
    },

    compatibilityDate: '2024-12-21',
})