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
    openaiApiKey: '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',
    public: {
      supabaseUrl: 'https://tffakpklfsvcmoskekgt.supabase.co',
      supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZmFrcGtsZnN2Y21vc2tla2d0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDQ4NTM0MywiZXhwIjoyMDUwMDYxMzQzfQ.u-ijQoG52FpW8_KU8K145Qsq0EdI7Tw16L5d1jTKEZM',
      iyzicoApiKey: 'sandbox-NWmx8ksHNh7WvncF46PASsgHuCBowrqa',
      iyzicoSecretKey: 'sandbox-ok4FiGlnfgmWa0EdkW0Em6Gdu9hFBPC4',
      iyzicoBaseUrl: 'https://sandbox-api.iyzipay.com'
    }
  }
})