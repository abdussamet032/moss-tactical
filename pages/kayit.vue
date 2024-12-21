<script setup>
const { signUp } = useAuth()
const router = useRouter()

const form = ref({
  email: '',
  password: '',
  passwordConfirm: ''
})

const loading = ref(false)
const error = ref(null)

const handleRegister = async () => {
  loading.value = true
  error.value = null

  // Şifre kontrolü
  if (form.value.password !== form.value.passwordConfirm) {
    error.value = 'Şifreler eşleşmiyor'
    loading.value = false
    return
  }

  try {
    await signUp(form.value.email, form.value.password)
    // Başarılı kayıt sonrası login sayfasına yönlendir
    router.push('/giris')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <div>
        <h2 class="text-center text-3xl font-bold">Hesap Oluştur</h2>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              v-model="form.email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Şifre</label>
            <input
              id="password"
              type="password"
              v-model="form.password"
              required
              minlength="6"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label for="passwordConfirm" class="block text-sm font-medium text-gray-700">Şifre Tekrar</label>
            <input
              id="passwordConfirm"
              type="password"
              v-model="form.passwordConfirm"
              required
              minlength="6"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {{ loading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol' }}
        </button>
      </form>

      <div class="text-center">
        <NuxtLink to="/giris" class="text-sm text-indigo-600 hover:text-indigo-500">
          Zaten hesabınız var mı? Giriş yapın
        </NuxtLink>
      </div>
    </div>
  </div>
</template> 