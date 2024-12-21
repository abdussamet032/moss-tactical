<script setup>
const route = useRoute()
const { getProductsByCategory, loading, error } = useProducts()
const products = ref([])

const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(price)
}

onMounted(async () => {
    try {
        const category = route.params.category
        console.log('Fetching products for category:', category)
        const data = await getProductsByCategory(category)
        console.log('Category products data:', data)
        products.value = data
    } catch (e) {
        console.error('Error loading category products:', e)
        products.value = []
    }
})
</script>

<template>
    <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold mb-8">{{ route.params.category }}</h1>

        <div v-if="loading" class="text-center py-8">
            Ürünler yükleniyor...
        </div>

        <div v-else-if="error" class="text-red-500 text-center py-8">
            {{ error }}
        </div>

        <div v-else-if="products.length === 0" class="text-center py-8">
            Bu kategoride ürün bulunmamaktadır.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="product in products" :key="product.id" class="border rounded-lg overflow-hidden shadow-lg">
                <div class="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span class="text-gray-500">Ürün Görseli</span>
                </div>

                <div class="p-4">
                    <h2 class="text-xl font-semibold mb-2">{{ product.name }}</h2>
                    <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>

                    <div class="flex justify-between items-center">
                        <div class="space-y-1">
                            <span class="text-lg font-bold block">{{ formatPrice(product.price) }}</span>
                            <span class="text-sm text-gray-500">Stok: {{ product.stock }}</span>
                        </div>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            @click="$router.push(`/products/${product.id}`)">
                            <span class="text-sm">Ürünü İncele</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>