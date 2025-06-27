<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <form @submit.prevent="handleLogin" class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-800">Giriş Yap</h2>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="E-posta adresiniz"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Şifreniz"
        />
      </div>
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm">{{ error }}</div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full py-2 px-4 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        <span v-if="!loading">Giriş Yap</span>
        <span v-else>İşleniyor...</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
// Basit giriş formu için gerekli değişkenler
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// Giriş işlemi
const handleLogin = async () => {
  loading.value = true
  error.value = ''
  // useAuth composable'ı ile giriş işlemi
  const { signIn } = useAuth()
  // useFetch ile modern istek
  await signIn(email.value, password.value)
    .then(() => {
      // Başarılı girişte yönlendirme
      // Türkçe: Kullanıcı giriş yaptıysa anasayfaya yönlendir
      navigateTo('/')
    })
    .catch((err: any) => {
      // Hata mesajı göster
      error.value = err.message || 'Bir hata oluştu'
    })
    .finally(() => {
      loading.value = false
    })
}
</script> 