<template>
  <client-only>
    <div class="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-12">
      <div class="container mx-auto px-2 md:px-4">
        <h1 class="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow animate-section-title">
          Sepetim
        </h1>
        <div v-if="products.length > 0" class="flex flex-col md:flex-row gap-8">
          <!-- Ürünler Listesi (Sol Sütun) -->
          <div class="flex-1 space-y-6">
            <div v-for="(product, index) in products" :key="index"
              class="flex flex-col md:flex-row items-center gap-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-primary/10 p-7 group relative opacity-0 translate-y-8 animate-fade-in transition-all duration-300 hover:scale-[1.025] hover:shadow-3xl hover:bg-white/95"
              :style="{ animationDelay: (index * 100) + 'ms' }"
            >
              <!-- Silme butonu -->
              <button @click="removeItem(index)" class="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-200 bg-white/70 shadow-md hover:bg-red-50">
                <!-- Çöp kutusu ikonu (Heroicons) -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <!-- Ürün görseli -->
              <div class="relative flex-shrink-0">
                <img :src="product?.images?.[0] || '/placeholder.png'" :alt="product?.name"
                  class="w-32 h-32 object-cover rounded-2xl border-4 border-secondary/20 group-hover:border-primary/60 transition-all duration-300 shadow-lg group-hover:shadow-primary/20"
                />
                <!-- Glow efekti -->
                <div class="absolute inset-0 rounded-2xl pointer-events-none group-hover:shadow-[0_0_32px_8px_rgba(99,102,241,0.15)] transition-all duration-300"></div>
              </div>
              <!-- Ürün bilgileri -->
              <div class="flex-1 w-full flex flex-col gap-3">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <!-- Ürün adı tıklanabilir, detay sayfasına gider -->
                    <NuxtLink :to="`/products/${product.slug}`" class="font-semibold text-lg text-gray-900 hover:text-primary transition underline-offset-2 hover:underline cursor-pointer">
                      {{ product?.name }}
                    </NuxtLink>
                    <div class="flex items-center gap-2 mt-1">
                      <p class="text-sm text-gray-500">{{ cartItems[index]?.color }} / {{ cartItems[index]?.size }} / {{ formatPrice(product?.price) }}</p>
                      
                    </div>
                  </div>
                </div>
                <!-- Adet seçici ve toplam -->
                <div class="flex items-center gap-4 mt-2">
                  <!-- Adet stepper modern tasarım -->
                  <div class="flex items-center border-2 border-gray-200 rounded-xl shadow bg-gray-50 overflow-hidden">
                    <button @click="updateQuantity(index, -1)" class="px-3 py-1 text-gray-600 hover:bg-primary/10 hover:text-primary transition font-bold text-xl focus:outline-none">
                      -
                    </button>
                    <input type="number" min="1" v-model.number="cartItems[index].quantity" @change="onQuantityInput(index)" class="w-12 text-center bg-transparent outline-none font-semibold text-gray-900 text-base" />
                    <button @click="updateQuantity(index, 1)" class="px-3 py-1 text-gray-600 hover:bg-primary/10 hover:text-primary transition font-bold text-xl focus:outline-none">
                      +
                    </button>
                  </div>
                  <div class="ml-auto text-right font-bold text-primary text-base">
                    {{ formatPrice(product?.price * (cartItems[index]?.quantity || 1)) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Sepet Özeti (Sağ Sütun) -->
          <div class="w-full md:w-96 flex-shrink-0">
            <div class="sticky top-24 bg-white rounded-2xl shadow-2xl border border-primary/10 p-7 flex flex-col gap-4">
              <h2 class="text-xl font-bold text-primary mb-2">Sepet Özeti</h2>
              <div class="flex justify-between text-gray-700">
                <span>Ürünler ({{ totalItems }})</span>
                <span>{{ formatPrice(subTotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-700">
                <span>Kargo</span>
                <span class="text-green-600 font-semibold">Ücretsiz</span>
              </div>
              <!-- Kupon alanı örnek (geliştirilebilir) -->
              <div class="flex flex-col gap-2 mt-2">
                <input type="text" v-model="coupon" placeholder="Kupon Kodu" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary text-base" />
                <button class="bg-primary text-white rounded-lg px-4 py-2 font-medium hover:bg-secondary transition">Kuponu Uygula</button>
              </div>
              <div class="border-t border-gray-100 my-2"></div>
              <div class="flex justify-between text-lg font-bold text-gray-900">
                <span>Genel Toplam</span>
                <span>{{ formatPrice(grandTotal) }}</span>
              </div>
              <button 
                class="mt-4 w-full bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-semibold shadow-xl hover:from-secondary hover:to-primary transition-all text-lg focus:outline-none focus:ring-4 focus:ring-primary/30 sticky bottom-0"
                @click="onConfirmCart"
              >
                Sepeti Onayla
              </button>
              <button @click="clearCart" class="mt-2 w-full text-red-600 hover:text-white hover:bg-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium transition shadow-sm">
                Sepeti Temizle
              </button>
            </div>
          </div>
        </div>
        <!-- Boş sepet -->
        <div v-else class="text-center py-20 bg-white rounded-2xl shadow-2xl flex flex-col items-center border border-primary/10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 text-primary/30 mb-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75h19.5M6.75 6.75V5.25A2.25 2.25 0 019 3h6a2.25 2.25 0 012.25 2.25v1.5m-9 0h9m-9 0v12A2.25 2.25 0 008.25 21h7.5A2.25 2.25 0 0018 18.75v-12" />
          </svg>
          <h2 class="text-2xl font-semibold text-gray-700 mb-2">Sepetiniz boş</h2>
          <p class="text-gray-500 mb-6">Sepetinizde henüz ürün bulunmuyor.</p>
          <NuxtLink to="/products" class="bg-gradient-to-r from-primary to-secondary text-white px-10 py-3 rounded-full font-semibold shadow-lg hover:from-secondary hover:to-primary transition-all text-lg">
            Alışverişe Başla
          </NuxtLink>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import { useRouter } from 'vue-router'
// Nuxt 3'te cookie yönetimi için useCookie kullanılır
const cartCookie = useCookie('cart', { default: () => [] })

// Ürün detaylarını tutacak dizi
const products = ref([])
// Sepet verisini cookie'den oku
const cartItems = ref(cartCookie.value)
const coupon = ref('')
const router = useRouter()

// Sepetten ürün silme fonksiyonu
function removeItem(index) {
  cartItems.value.splice(index, 1)
  products.value.splice(index, 1)
  // Cookie'yi güncelle
  cartCookie.value = [...cartItems.value]
}

const getCartFromCookie = () => {
  // Cookie'den sepeti oku
  return cartCookie.value || []
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price || 0)
}
const updateQuantity = (index, value) => {
    const newQuantity = cartItems.value[index].quantity + value
    if (newQuantity > 0) {
        cartItems.value[index].quantity = newQuantity
        // Cookie'yi güncelle
        cartCookie.value = [...cartItems.value]
    }
}
// Adet inputu değiştiğinde cookie güncelle
function onQuantityInput(index) {
  if (cartItems.value[index].quantity < 1) cartItems.value[index].quantity = 1
  cartCookie.value = [...cartItems.value]
}
const clearCart = () => {
    // Cookie'yi temizle
    cartCookie.value = []
    cartItems.value = []
    products.value = []
}

const subTotal = computed(() => {
  return products.value.reduce((total, product, idx) => total + product.price * (cartItems.value[idx]?.quantity || 1), 0)
})
const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.quantity || 1), 0)
})
const grandTotal = computed(() => {
  // Kargo her zaman ücretsiz
  return subTotal.value
})

// Sepeti Onayla butonuna tıklandığında ödeme sayfasına yönlendirir
function onConfirmCart() {
  router.push('/cart/payment')
}

onMounted(async () => {
  cartItems.value = await getCartFromCookie()
  // Sepetteki her ürün için ürün detaylarını çek
  for (const item of cartItems.value) {
    // Ürün detaylarını API'den al
    const { data: productData } = await useFetch(`/api/products/${item.slug}`)
    // Eğer ürün başarıyla alındıysa products dizisine ekle
    if (productData.value && productData.value.data) {
      // Ürün bilgilerini ve sepetteki özel bilgileri birleştir
      products.value.push({
        ...productData.value.data,
        cartQuantity: item.quantity,
        cartColor: item.color,
        cartSize: item.size
      })
    }
  }
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(32px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both;
}
/* Modern ve smooth kart shadow'u */
.shadow-3xl {
  box-shadow: 0 12px 32px 0 rgba(99, 102, 241, 0.13), 0 2px 8px 0 rgba(0,0,0,0.04);
}
</style>