<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-100">
    <div class="bg-white rounded-3xl shadow-2xl border border-primary/10 p-8 max-w-md w-full flex flex-col items-center gap-6">
      
      <!-- Yükleniyor durumu -->
      <template v-if="pending">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span class="text-lg text-gray-600">Ödeme sonucu kontrol ediliyor...</span>
      </template>
      
      <!-- Başarılı ödeme -->
      <template v-else-if="isSuccess">
        <svg class="w-16 h-16 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <h2 class="text-2xl font-bold text-green-600">Ödeme Başarılı!</h2>
        <p class="text-gray-700 text-center">Siparişiniz başarıyla alınmıştır. Teşekkür ederiz.</p>
        <NuxtLink to="/" class="mt-4 px-6 py-2 bg-primary text-white rounded-full font-semibold shadow hover:bg-secondary transition">
          Ana Sayfa
        </NuxtLink>
      </template>
      
      <!-- Başarısız ödeme -->
      <template v-else>
        <svg class="w-16 h-16 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <h2 class="text-2xl font-bold text-red-600">Ödeme Başarısız</h2>
        <p class="text-gray-700 text-center">{{ errorMessage }}</p>
        <NuxtLink to="/cart/payment" class="mt-4 px-6 py-2 bg-primary text-white rounded-full font-semibold shadow hover:bg-secondary transition">
          Tekrar Dene
        </NuxtLink>
      </template>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const route = useRoute()

const cartCookie: any = useCookie('cart', { default: () => [] })
// Token kontrolü
const token = route.query.token as string

if (!token) {
  // Hata durumunda ana sayfaya yönlendir
  await navigateTo('/')
}

const { user } = useAuth()

const setOrder = async (cart: any[]) => {
  // Kullanıcı kontrolü
  if (!user.value?.id) return

  // Sepet toplamını hesapla
  // Sepet toplamını hesapla, null veya undefined değerler için güvenli hesaplama
  const total_price = cart.reduce((sum, item) => {
    // Fiyat veya miktar null/undefined ise 0 olarak kabul et
    const price = item.price_per_unit || 0
    const quantity = item.quantity || 0
    return sum + (price * quantity)
  }, 0)

  // Sipariş item'larını uygun formata getir
  const items = []
  
  // Sepetteki her ürün için sipariş öğesi oluştur
  for (const item of cart) {
    items.push({
      variant_id: item.variantId,
      product_id: item.productId,
      quantity: item.quantity,
      price_per_unit: item.price_per_unit
    })
  }

  // Sipariş oluşturma isteği - $fetch kullanarak
  const orderResponse = await $fetch('/api/orders', {
    method: 'POST',
    body: {
      user_id: user.value.id,
      total_price,
      items
    }
  }) as { status: string }

  // Başarılıysa sepeti temizle
  if (orderResponse?.status === 'success') {
    cartCookie.value = []
  }
}

// Reaktif değişkenler
const isSuccess = ref(false)
const errorMessage = ref('Ödeme işlemi başarısız.')
const pending = ref(true)

// API'den ödeme sonucunu kontrol et
try {
  const response = await $fetch('/api/iyzico/payment-result', {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: {
      'Content-Type': 'application/json'
    }
  }) as { status: string; message?: string }
  
  pending.value = false
  
  if (response.status === 'success') {
    isSuccess.value = true
    await setOrder(cartCookie.value)
  } else {
    errorMessage.value = response.message || 'Ödeme işlemi başarısız.'
  }
} catch (error) {
  pending.value = false
  errorMessage.value = 'Bağlantı hatası oluştu.'
}

</script>

<style scoped>
.bg-primary {
  background: linear-gradient(90deg, #6366f1 0%, #ec4899 100%);
}
.hover\:bg-secondary:hover {
  background: linear-gradient(90deg, #ec4899 0%, #6366f1 100%);
}
</style> 