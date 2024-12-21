<template>
    <header class="bg-white shadow-sm">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <NuxtLink to="/" class="font-bold text-xl">
                    MOSS TACTICAL
                </NuxtLink>

                <!-- Navigation -->
                <nav class="hidden md:flex items-center gap-6">
                    <NuxtLink to="/tum-urunler" class="text-gray-600 hover:text-gray-900 transition">
                        Tüm Ürünler
                    </NuxtLink>
                    <NuxtLink v-for="category in categories" :key="category.slug" :to="`/kategori/${category.slug}`"
                        class="text-gray-600 hover:text-gray-900 transition">
                        {{ category.name }}
                    </NuxtLink>
                </nav>

                <!-- Sağ Menü -->
                <div class="flex items-center gap-4">
                    <!-- Arama -->
                    <div class="relative">
                        <input v-model="searchQuery" @keyup.enter="handleSearch" type="text" placeholder="Ürün ara..."
                            class="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <Icon name="heroicons:magnifying-glass"
                            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    <!-- Sepet -->
                    <NuxtLink to="/sepet" class="relative p-2 hover:bg-gray-50 rounded-full">
                        <Icon name="heroicons:shopping-cart" class="w-5 h-5" />
                        <span v-if="cartItemCount > 0"
                            class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {{ cartItemCount }}
                        </span>
                    </NuxtLink>

                    <!-- Kullanıcı Menüsü -->
                    <div class="relative" v-click-outside="closeUserMenu">
                        <button @click="toggleUserMenu" class="p-2 hover:bg-gray-50 rounded-full">
                            <Icon :name="user ? 'heroicons:user-circle-solid' : 'heroicons:user-circle'"
                                class="w-5 h-5" />
                        </button>

                        <!-- Dropdown -->
                        <div v-if="isUserMenuOpen"
                            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                            <template v-if="user">
                                <NuxtLink to="/profil" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    Profilim
                                </NuxtLink>
                                <NuxtLink to="/siparislerim"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    Siparişlerim
                                </NuxtLink>
                                <button @click="handleLogout"
                                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                                    Çıkış Yap
                                </button>
                            </template>
                            <template v-else>
                                <NuxtLink to="/giris" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    Giriş Yap
                                </NuxtLink>
                                <NuxtLink to="/kayit" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    Kayıt Ol
                                </NuxtLink>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const { cartItemCount } = useCart()
const isUserMenuOpen = ref(false)
const router = useRouter()
const searchQuery = ref('')

const categories = ref([
    { name: 'Elektronik', slug: 'elektronik' },
    { name: 'Giyim', slug: 'giyim' },
    { name: 'Ev & Yaşam', slug: 'ev-yasam' }
])

const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
    isUserMenuOpen.value = false
}

const handleLogout = async () => {
    const client = useSupabaseClient()
    await client.auth.signOut()
    navigateTo('/giris')
}

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({
            path: '/tum-urunler',
            query: { q: searchQuery.value.trim() }
        })
        searchQuery.value = '' // Arama yapıldıktan sonra input'u temizle
    }
}
</script>