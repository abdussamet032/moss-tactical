<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Arama Sonucu Başlığı -->
        <div v-if="searchQuery" class="mb-6">
            <h1 class="text-2xl font-semibold">
                "{{ searchQuery }}" icin arama sonuclari
                <span class="text-gray-500 text-lg">({{ filteredProducts.length }} urun)</span>
            </h1>
        </div>

        <div class="flex flex-col md:flex-row gap-8">
            <!-- Filtreler -->
            <div class="w-full md:w-64 space-y-6">
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <!-- Arama Filtresi -->
                    <div class="mb-6">
                        <h3 class="font-medium mb-3">Arama</h3>
                        <input type="text" v-model="localSearchQuery" placeholder="Urun ara..."
                            class="w-full p-2 border rounded" @input="updateSearchQuery">
                    </div>

                    <!-- Kategori Filtresi -->
                    <div class="mb-6">
                        <h3 class="font-medium mb-3">Kategoriler</h3>
                        <div class="space-y-2">
                            <label v-for="category in categories" :key="category.id" class="flex items-center gap-2">
                                <input type="checkbox" v-model="selectedCategories" :value="category.id"
                                    class="rounded text-primary-600">
                                {{ category.name }}
                            </label>
                        </div>
                    </div>

                    <!-- Fiyat Aralığı -->
                    <div class="mb-6">
                        <h3 class="font-medium mb-3">Fiyat Araligi</h3>
                        <div class="flex gap-2">
                            <input type="number" v-model="priceRange.min" placeholder="Min"
                                class="w-full p-2 border rounded">
                            <input type="number" v-model="priceRange.max" placeholder="Max"
                                class="w-full p-2 border rounded">
                        </div>
                    </div>

                    <!-- Sıralama -->
                    <div>
                        <h3 class="font-medium mb-3">Siralama</h3>
                        <select v-model="sortBy" class="w-full p-2 border rounded">
                            <option value="newest">En Yeniler</option>
                            <option value="price_asc">Fiyat (Dusukten Yuksege)</option>
                            <option value="price_desc">Fiyat (Yuksekten Dusuge)</option>
                            <option value="name_asc">Isim (A-Z)</option>
                            <option value="name_desc">Isim (Z-A)</option>
                        </select>
                    </div>
                </div>

                <!-- Filtreleri Temizle -->
                <button @click="clearFilters" class="w-full py-2 text-primary-600 hover:text-primary-700">
                    Filtreleri Temizle
                </button>
            </div>

            <!-- Ürün Listesi -->
            <div class="flex-1">
                <div v-if="loading" class="flex justify-center items-center h-64">
                    <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                </div>

                <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
                    <p class="text-gray-500">Ürün bulunamadı.</p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="product in filteredProducts" :key="product.id" 
                        class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                        <NuxtLink :to="`/urun/${product.slug}`" class="block">
                            <div class="relative">
                                <img :src="product.image_url" :alt="product.name" 
                                    class="w-full h-48 object-cover hover:opacity-90 transition">
                                <span v-if="product.stock > 0" 
                                    class="absolute top-2 right-2 px-2 py-1 text-xs bg-green-500 text-white rounded">
                                    Stokta: {{product.stock}}
                                </span>
                                <span v-else
                                    class="absolute top-2 right-2 px-2 py-1 text-xs bg-red-500 text-white rounded">
                                    Tükendi
                                </span>
                            </div>
                            
                            <div class="p-4">
                                <div class="text-xs text-gray-500 mb-1">{{product.category}}</div>
                                <h3 class="font-medium text-lg mb-2 line-clamp-2">{{ product.name }}</h3>
                                <div class="flex justify-between items-center">
                                    <p class="text-primary-600 font-bold text-lg">{{ product.price.toLocaleString('tr-TR') }} TL</p>
                                    <button class="p-2 rounded-full hover:bg-gray-100 transition">
                                        <Icon name="material-symbols:favorite-outline" class="w-5 h-5 text-gray-600"/>
                                    </button>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { getProducts } = useProducts()

// State tanımlamaları
const products = ref([])
const loading = ref(true)
const selectedCategories = ref([])
const priceRange = ref({ min: '', max: '' })
const sortBy = ref('newest')
const localSearchQuery = ref('')

// Kategoriler
const categories = ref([
    { id: 1, name: 'Elektronik' },
    { id: 2, name: 'Giyim' },
    { id: 3, name: 'Ev & Yaşam' }
])

// Ürünleri yükle
onMounted(async () => {
    try {
        const data = await getProducts()
        console.log('Gelen ürünler:', data) // Debug için
        products.value = data || []
    } catch (error) {
        console.error('Ürünler yüklenirken hata:', error)
        products.value = []
    } finally {
        loading.value = false
    }
})

// URL'den arama sorgusunu al
const searchQuery = computed(() => route.query.q)

// Filtrelenmiş ürünler
const filteredProducts = computed(() => {
    console.log('Mevcut ürünler:', products.value) // Debug için

    if (!products.value || products.value.length === 0) {
        return []
    }

    let filtered = products.value

    if (searchQuery.value) {
        const searchTerm = searchQuery.value.toLowerCase()
        filtered = filtered.filter(product =>
            product.title?.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm)
        )
    }

    return filtered
})

// URL'deki arama sorgusunu input'a yansıt
watch(searchQuery, (newQuery) => {
    localSearchQuery.value = newQuery || ''
})

// Input'taki değişiklikleri URL'e yansıt
const updateSearchQuery = () => {
    if (localSearchQuery.value) {
        router.push({ query: { ...route.query, q: localSearchQuery.value } })
    } else {
        const query = { ...route.query }
        delete query.q
        router.push({ query })
    }
}

// Filtreleri temizle
const clearFilters = () => {
    selectedCategories.value = []
    priceRange.value = { min: '', max: '' }
    sortBy.value = 'newest'
    localSearchQuery.value = ''
    router.push({ query: {} })
}
</script>