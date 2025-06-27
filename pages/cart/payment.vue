<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-12">
    <div class="container mx-auto px-2 md:px-4 max-w-2xl">
      <h1 class="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow animate-section-title">
        Ödeme & Teslimat Bilgileri
      </h1>
      <form @submit.prevent="submitOrder" class="bg-white rounded-3xl shadow-2xl border border-primary/10 p-8 flex flex-col gap-6">
        <!-- Teslimat Bilgileri -->
        <div class="bg-white rounded-xl p-6">
          <h2 class="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Teslimat Bilgileri
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Adres alanı -->
            <div class="md:col-span-2">
             
              <input 
                v-model="form.address" 
                id="address" 
                type="text" 
                placeholder="Adres bilgilerinizi giriniz" 
                class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>
            
            <!-- Şehir alanı -->
            <div>
             
              <input 
                v-model="form.city" 
                id="city" 
                type="text" 
                placeholder="Şehir" 
                class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>
            
            <!-- İlçe alanı -->
            <div>
             
              <input 
                v-model="form.district" 
                id="district" 
                type="text" 
                placeholder="İlçe" 
                class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>
            <div>
              <input 
                v-model="form.zip" 
                id="zip" 
                type="text" 
                placeholder="Posta Kodu" 
                class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>
          </div>
        </div>
        <!-- Ödeme Bilgileri (iyzico ile ödeme, kart bilgisi alınmayacak) -->
        <!-- <div>
          <h2 class="text-xl font-bold text-primary mb-3">Ödeme Bilgileri</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="form.cardName" required type="text" placeholder="Kart Üzerindeki İsim" class="input md:col-span-2" />
            <input v-model="form.cardNumber" required type="text" maxlength="19" placeholder="Kart Numarası" class="input md:col-span-2" />
            <input v-model="form.expiry" required type="text" maxlength="5" placeholder="AA/YY" class="input" />
            <input v-model="form.cvc" required type="text" maxlength="4" placeholder="CVC" class="input" />
          </div>
        </div> -->
        <!-- Sipariş Özeti -->
        <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-xl">
          <h3 class="font-semibold text-xl mb-4 text-primary flex items-center gap-2">
            <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Sipariş Özeti
          </h3>
          <div v-if="cart.length > 0" class="flex flex-col gap-4 mb-4">
            <div v-for="item in cart" :key="item.slug + item.size + item.color" class="flex items-center gap-4 bg-white rounded-xl shadow border border-gray-100 p-3 group hover:shadow-lg transition">
              <!-- Ürün görseli -->
           
              <img :src="item.productImage || '/placeholder.png'" :alt="item.productTitle" class="w-16 h-16 object-cover rounded-xl border-2 border-secondary/20 group-hover:border-primary/60 transition-all" />
              <!-- Ürün bilgileri -->
              <div class="flex-1 min-w-0">
                <NuxtLink :to="`/products/${item.slug}`" class="font-semibold text-base md:text-lg text-gray-900 hover:text-primary transition underline-offset-2 hover:underline truncate block">
                  {{ item.productTitle }}
                </NuxtLink>
                <div class="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                  <span v-if="item.color">Renk: <span class="font-medium">{{ item.color }}</span></span>
                  <span v-if="item.size">Beden: <span class="font-medium">{{ item.size }}</span></span>
                </div>
              </div>
              <!-- Adet ve fiyat -->
              <div class="flex flex-col items-end min-w-[70px]">
                <span class="text-sm text-gray-500">Adet: <span class="font-bold text-gray-900">{{ item.quantity }}</span></span>
                <span class="text-base font-bold text-primary mt-1">{{ formatPrice(item.price_per_unit * item.quantity) }}</span>
              </div>
            </div>
          </div>
          <!-- Kargo ve toplam -->
          <div class="border-t border-gray-200 pt-4 mt-2 flex flex-col gap-2">
            <div class="flex justify-between text-gray-700 text-sm">
              <span>Kargo</span>
              <span>Ücretsiz</span>
            </div>
            <div class="flex justify-between text-lg font-bold text-gray-900 mt-1">
              <span>Genel Toplam</span>
              <span>{{ apiTotalPrice !== null ? formatPrice(apiTotalPrice) : formatPrice(grandTotal) }}</span>
            </div>
          </div>
        </div>
        <button type="submit" :disabled="loading" class="mt-4 w-full bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-semibold shadow-xl hover:from-secondary hover:to-primary transition-all text-lg focus:outline-none focus:ring-4 focus:ring-primary/30">
          Siparişi Onayla
        </button>
        <p v-if="error" class="text-red-600 text-center mt-2">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-center mt-2">Siparişiniz başarıyla alındı!</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

// Modern input class
const inputClass = 'input px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary text-base bg-white outline-none transition'

// Form verileri
const form = ref({
  name: '', phone: '', email: '', address: '', city: '', district: '', zip: ''
})
const loading = ref(false)
const error = ref('')
const success = ref(false)
const cartCookie = useCookie('cart', { default: () => [] })
const cart = ref([])
const router = useRouter()
const { user } = useAuth()
const apiTotalPrice = ref(null) // API'den dönen gerçek toplam fiyat

// Fiyat formatlama fonksiyonu
const formatPrice = (price) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price || 0)

// Kargo ücretini ayrı bir computed olarak da göstermek için:
const kargoUcreti = computed(() => 0) // Kargo her zaman ücretsiz

// Sepet ve toplamı localStorage'dan al
const grandTotal = computed(() => {
  let items = cart.value
  let sub = items.reduce((t, i) => t + i.price_per_unit * i.quantity, 0)
  return sub // Kargo eklenmiyor, ücretsiz
})

onMounted(() => {
  // Sepeti cookie'den al
  cart.value = Array.isArray(cartCookie.value) ? cartCookie.value : []
  // Kullanıcı giriş yaptıysa formu otomatik doldur
  if (user.value) {
    form.value.email = user.value.email || ''
    form.value.name = user.value.user_metadata?.full_name || ''
    form.value.phone = user.value.user_metadata?.phone || ''
  }
})

// Siparişi gönderme fonksiyonu (iyzico ile ödeme, kart bilgisi alınmayacak)
async function submitOrder() {
  error.value = ''
  success.value = false
  loading.value = true
  // Basit validasyon
 
 
  // iyzico ödeme başlatma isteği (backend'e istek atılır)
  // Türkçe açıklama: Backend'de /api/iyzico/checkout endpoint'i olmalı. Bu endpoint iyzico ile iletişimi sağlar ve ödeme formu linkini döner.
  const { data, error: apiError } = await useFetch('/api/iyzico/checkout', {
    method: 'POST',
    body: { 
      name: user.value.user_metadata?.full_name,
      phone: user.value.user_metadata?.phone,
      email: user.value.email,
      address: form.value.address,
      city: form.value.city,
      district: form.value.district,
      zip: form.value.zip,
      cart: cart.value 
    }
  })
  // Türkçe: API'den toplam fiyatı al (backend'de totalPrice dönmeli)
  apiTotalPrice.value = grandTotal || null
  if (apiError.value || !data.value || !data.value.paymentPageUrl) {
    error.value = 'Ödeme başlatılamadı. Lütfen tekrar deneyin.'
    loading.value = false
    return
  }
  // iyzico ödeme sayfasına yönlendir
  window.location.href = data.value.paymentPageUrl
  // Yönlendirme sonrası kod çalışmaz, ama cookie temizlenebilir (isteğe bağlı)
  loading.value = false
}
</script>

<style scoped>
@import '~/assets/css/main.css';
.input {
  @apply px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary text-base bg-white outline-none transition;
}
</style> 