<template>
  <div>
    <!-- Hero Section -->
    <div class="relative bg-gray-900 text-white">
      <div class="absolute inset-0">
        <img 
          src="/images/tactical-background.jpg" 
          alt="Tactical Background" 
          class="w-full h-full object-cover opacity-40"
        />
      </div>
      <div class="relative container mx-auto px-4 py-24">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">MOSS TACTICAL</h1>
        <p class="text-xl md:text-2xl mb-8 max-w-2xl">
          Profesyonel askeri ekipman ve taktik malzemeler için güvenilir adresiniz
        </p>
        <NuxtLink 
          to="/categories" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg inline-block transition-colors"
        >
          Ürünleri Keşfet
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Kategoriler -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Kategoriler</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink 
            v-for="category in ['Giyim', 'Ekipman', 'Ayakkabı', 'Aksesuarlar']" 
            :key="category"
            :to="`/categories/${category}`"
            class="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg text-center transition-colors"
          >
            {{ category }}
          </NuxtLink>
        </div>
      </div>

      <!-- Ürünler -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Öne Çıkan Ürünler</h2>
          <NuxtLink 
            to="/products" 
            class="text-blue-600 hover:text-blue-700"
          >
            Tümünü Gör →
          </NuxtLink>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p class="mt-4 text-gray-600">Ürünler yükleniyor...</p>
        </div>

        <div v-else-if="error" class="text-red-500 text-center py-8">
          {{ error }}
        </div>

        <div v-else-if="products.length === 0" class="text-center py-8">
          <p class="text-gray-600">Henüz ürün bulunmamaktadır.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="product in products" 
               :key="product.id" 
               class="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div class="relative">
              <div class="w-full h-64 bg-gray-100 flex items-center justify-center">
                <span v-if="!product.image_url" class="text-gray-400">
                  <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <img v-else 
                     :src="product.image_url" 
                     :alt="product.name"
                     class="w-full h-full object-cover" 
                />
              </div>
              <div class="absolute top-2 right-2">
                <span class="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm">
                  {{ product.category }}
                </span>
              </div>
            </div>
            
            <div class="p-4">
              <h3 class="text-xl font-semibold mb-2 line-clamp-1">{{ product.name }}</h3>
              <p class="text-gray-600 mb-4 text-sm line-clamp-2">{{ product.description }}</p>
              
              <div class="flex justify-between items-end">
                <div class="space-y-1">
                  <span class="text-lg font-bold block text-blue-600">
                    {{ formatPrice(product.price) }}
                  </span>
                  <span class="text-sm text-gray-500">
                    Stok: {{ product.stock }}
                  </span>
                </div>
                <button 
                  @click="$router.push(`/products/${product.id}`)"
                  class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                >
                  İncele
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Özellikler Section -->
    <div class="bg-gray-100 py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-4xl mb-4">🛡️</div>
            <h3 class="text-xl font-semibold mb-2">Kaliteli Ekipman</h3>
            <p class="text-gray-600">En zorlu koşullara dayanıklı profesyonel ekipmanlar</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">🚚</div>
            <h3 class="text-xl font-semibold mb-2">Hızlı Teslimat</h3>
            <p class="text-gray-600">Türkiye'nin her yerine güvenli ve hızlı teslimat</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">💪</div>
            <h3 class="text-xl font-semibold mb-2">Profesyonel Destek</h3>
            <p class="text-gray-600">Uzman ekibimizden 7/24 teknik destek</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getProducts, loading, error } = useProducts()
const products = ref([])

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(price)
}

onMounted(async () => {
  try {
    console.log('Fetching products...')
      const data = await getProducts()
    console.log('Received data:', data)
    products.value = data || []
  } catch (e) {
    console.error('Error in onMounted:', e)
    products.value = []
  }
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>