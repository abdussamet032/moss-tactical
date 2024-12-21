<script setup>
const { signIn } = useAuth()
const router = useRouter()

const form = ref({
    email: '',
    password: ''
})

const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
    loading.value = true
    error.value = null

    try {
        await signIn(form.value.email, form.value.password)
        router.push('/') // Başarılı girişte ana sayfaya yönlendir
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
                <h2 class="text-center text-3xl font-bold">Giriş Yap</h2>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <div class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input id="email" type="email" v-model="form.email" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Şifre</label>
                        <input id="password" type="password" v-model="form.password" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                </div>

                <div v-if="error" class="text-red-500 text-sm">
                    {{ error }}
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
                </button>
            </form>

            <div class="text-center">
                <NuxtLink to="/register" class="text-sm text-indigo-600 hover:text-indigo-500">
                    Hesabınız yok mu? Kayıt olun
                </NuxtLink>
            </div>
        </div>
    </div>
</template>