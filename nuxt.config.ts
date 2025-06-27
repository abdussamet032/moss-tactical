// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    // Server-side (private) environment variables
    openaiApiKey: process.env.OPENAI_API_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      iyzicoApiKey: process.env.IYZICO_API_KEY,
      iyzicoSecretKey: process.env.IYZICO_SECRET_KEY,
      iyzicoBaseUrl: process.env.IYZICO_BASE_URL
    }
  }
})