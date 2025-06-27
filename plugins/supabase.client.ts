import { createClient, SupabaseClient } from '@supabase/supabase-js'

declare module '#app' {
  interface NuxtApp {
    $supabase: SupabaseClient
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )

  return {
    provide: {
      supabase
    }
  }
}) 