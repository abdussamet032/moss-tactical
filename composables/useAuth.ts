import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

export const useAuth = () => {
  // Supabase client'ı oluştur
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )

  // Kullanıcı ve yükleniyor state'leri
  const user = ref<User | null>(null)
  const loading = ref(true)

  // Kullanıcının giriş durumunu kontrol eder
  const checkUser = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      user.value = null
      console.warn('[useAuth] Kullanıcı bulunamadı:', error.message)
    } else {
      user.value = data.user
    }
    loading.value = false
  }

  // Giriş işlemi
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      console.error('[useAuth] Giriş hatası:', error.message)
      throw error
    }
    user.value = data.user
    return data
  }

  // Kayıt işlemi
  const signUp = async (email: string, password: string, metadata: any = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    if (error) {
      console.error('[useAuth] Kayıt hatası:', error.message)
      throw error
    }
    return data
  }

  // Çıkış işlemi
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('[useAuth] Çıkış hatası:', error.message)
      throw error
    }
    user.value = null
  }

  // Şifre sıfırlama işlemi
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) {
      console.error('[useAuth] Şifre sıfırlama hatası:', error.message)
      throw error
    }
  }

  // Türkçe: Kullanıcı oturum değişikliklerini dinler ve user state'ini günceller
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null
    if (event === 'SIGNED_IN') {
      // Kullanıcı giriş yaptı
    } else if (event === 'SIGNED_OUT') {
      // Kullanıcı çıkış yaptı
    }
  })

  // Component unmount olduğunda listener'ı temizler
  onUnmounted(() => {
    authListener?.subscription?.unsubscribe()
  })

  // Sayfa yüklendiğinde kullanıcıyı kontrol eder
  onMounted(() => {
    checkUser()
  })

  // Fonksiyonları ve state'leri dışa aktar
  return {
    user: readonly(user),
    loading: readonly(loading),
    signIn,
    signUp,
    signOut,
    resetPassword,
    checkUser,
    supabase
  }
} 