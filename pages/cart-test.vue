<template>
  <div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-4">Sepet Test Sayfası</h1>

    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Ürünler</h2>
      <div v-if="productsPending">Yükleniyor...</div>
      <div v-else-if="productsError">Hata: {{ productsError.message }}</div>
      <div v-else>
        <div v-if="products && products.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="product in products" :key="product.id" class="border p-4 rounded shadow">
            <div class="font-bold">{{ product.name }}</div>
            <div>Fiyat: {{ product.price }} {{ product.currency }}</div>
            <div class="flex items-center mt-2">
              <input type="number" v-model.number="quantities[product.id]" min="1" class="w-16 mr-2 border rounded px-2 py-1" />
              <button @click="addToCart(product)" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Sepete Ekle</button>
            </div>
          </div>
        </div>
        <div v-else>Ürün bulunamadı.</div>
        <!-- API'den dönen ürünler JSON olarak gösteriliyor -->
        <pre class="mt-4 bg-gray-100 p-2 rounded text-xs">{{ productsData }}</pre>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Sepetim</h2>
      <button @click="fetchCart" class="mb-2 bg-gray-200 px-2 py-1 rounded">Sepeti Yenile</button>
      <div v-if="cartPending">Sepet yükleniyor...</div>
      <div v-else-if="cartError">Hata: {{ cartError.message }}</div>
      <div v-else>
        <div v-if="cart && cart.items && cart.items.length > 0">
          <ul>
            <li v-for="item in cart.items" :key="item.variant_id">
              Varyant: {{ item.variant_id }} - Adet: {{ item.quantity }}
            </li>
          </ul>
        </div>
        <div v-else>Sepetiniz boş.</div>
        <!-- API'den dönen sepet JSON olarak gösteriliyor -->
        <pre class="mt-4 bg-gray-100 p-2 rounded text-xs">{{ cart }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// context7 uyumlu, basit ve okunabilir Nuxt 3 kodu

// Kullanıcı ID'si test için sabit (gerçek uygulamada auth'dan alınmalı)
const userId = '8c06fa56-5135-43ee-b0c6-500fd7a54432'

// Ürünleri çek
const {
  data: productsData,
  pending: productsPending,
  error: productsError
} = await useFetch(`/api/products?perPage=2`, {
  key: 'products-list',
})

// Ürünler listesi
const products = computed(() => productsData.value?.data || [])

// Her ürün için miktar tutmak için
const quantities = ref<Record<string, number>>({})

// Sepet verisi
const cart = ref<any>(null)
const cartPending = ref(false)
const cartError = ref<any>(null)

// Sepeti getir
async function fetchCart() {
  cartPending.value = true
  cartError.value = null
  // useFetch ile sepeti çekiyoruz
  const { data, error } = await useFetch(`/api/cart/${userId}`, {
    key: `cart-${userId}-${Date.now()}`,
  })
  if (error.value) {
    cartError.value = error.value
  } else {
    cart.value = data.value?.data
  }
  cartPending.value = false
}

// Sayfa açıldığında sepeti getir
fetchCart()

// Sepete ürün ekle
async function addToCart(product: any) {
  const quantity = quantities.value[product.id] || 1
  // Sepete ekleme isteği (Nuxt 3'te POST için body kullanılır)
  const { data, error } = await useFetch('/api/cart/add-item', {
    method: 'post',
    body: {
      user_id: userId,
      variant_id: product.id, // Not: Gerçek projede varyant id farklı olabilir
      quantity,
    },
    key: `add-to-cart-${product.id}-${Date.now()}`,
  })
  if (!error.value) {
    // Sepeti güncelle
    await fetchCart()
  } else {
    alert('Sepete eklenemedi: ' + (error.value.data?.statusMessage || error.value.message))
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style> 