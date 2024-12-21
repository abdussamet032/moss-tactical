<template>
  <div>
    <header class="bg-gray-900 text-white">
      <nav class="container mx-auto px-4">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-xl font-bold">MOSS TACTICAL</NuxtLink>
            <div class="hidden md:flex space-x-4">
              <NuxtLink to="/categories" class="hover:text-gray-300">Kategoriler</NuxtLink>
              <NuxtLink to="/products" class="hover:text-gray-300">Ürünler</NuxtLink>
              <NuxtLink to="/about" class="hover:text-gray-300">Hakkımızda</NuxtLink>
              <NuxtLink to="/contact" class="hover:text-gray-300">İletişim</NuxtLink>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <NuxtLink to="/cart" class="hover:text-gray-300">
              <span class="material-icons">shopping_cart</span>
            </NuxtLink>
            
            <template v-if="user">
              <div class="relative group">
                <button class="flex items-center hover:text-gray-300">
                  <span class="material-icons">account_circle</span>
                </button>
                <div class="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl hidden group-hover:block">
                  <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profilim
                  </NuxtLink>
                  <NuxtLink to="/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Siparişlerim
                  </NuxtLink>
                  <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
                    Çıkış Yap
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <NuxtLink to="/giris" class="hover:text-gray-300">Giriş Yap</NuxtLink>
              <NuxtLink to="/kaydol" class="hover:text-gray-300">Kayıt Ol</NuxtLink>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer class="bg-gray-900 text-white py-8 mt-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-bold mb-4">MOSS TACTICAL</h3>
            <p class="text-gray-400">Profesyonel askeri ekipman ve taktik malzemeler</p>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">Hızlı Erişim</h3>
            <ul class="space-y-2">
              <li><NuxtLink to="/products" class="text-gray-400 hover:text-white">Ürünler</NuxtLink></li>
              <li><NuxtLink to="/categories" class="text-gray-400 hover:text-white">Kategoriler</NuxtLink></li>
              <li><NuxtLink to="/about" class="text-gray-400 hover:text-white">Hakkımızda</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-gray-400 hover:text-white">İletişim</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">İletişim</h3>
            <ul class="space-y-2 text-gray-400">
              <li>📞 +90 555 555 5555</li>
              <li>📧 info@mosstactical.com</li>
              <li>📍 İstanbul, Türkiye</li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">Bizi Takip Edin</h3>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white">
                <span class="material-icons">facebook</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <span class="material-icons">instagram</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <span class="material-icons">twitter</span>
              </a>
            </div>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 MOSS TACTICAL. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { signOut } = useAuth()
const user = useSupabaseUser()
const router = useRouter()

const handleLogout = async () => {
  try {
    await signOut()
    navigateTo('/giris')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const handleCheckout = () => {
  if (!user.value) {
    // Kullanıcı giriş yapmamışsa, önce login sayfasına yönlendir
    router.push('/giris')
  } else {
    router.push('/checkout')
  }
}
</script>

<style scoped>
.material-icons {
  font-size: 24px;
}
</style>