<script setup lang="ts">
import type { Order, OrderStatus } from '~/types/order'

// Dinamik sayfa başlığı
useHead({
  title: 'Sipariş API Test - MossTactical'
})

// Filtreler ve sayfalama için reaktif değişkenler
const page = ref(1)
const limit = ref(10)
const userId = ref('')
const status = ref<OrderStatus | ''>('')

// Sonuç ve yüklenme durumu
const { data, pending, error, refresh } = useFetch(() => {
  // Query string'i dinamik oluştur
  let query = `/api/orders?page=${page.value}&limit=${limit.value}`
  if (userId.value) query += `&user_id=${userId.value}`
  if (status.value) query += `&status=${status.value}`
  return query
}, { watch: [page, limit, userId, status] })

// Sayfa toplamı ve meta bilgisi
const pagination = computed(() => data.value?.meta?.pagination || { page: 1, perPage: 10, total: 0, totalPages: 1 })

// Sipariş listesi
const orders = computed<Order[]>(() => data.value?.data || [])

// Sipariş durumları
const orderStatuses: { label: string, value: OrderStatus }[] = [
  { label: 'Bekliyor', value: 'pending' },
  { label: 'Onaylandı', value: 'confirmed' },
  { label: 'Kargolandı', value: 'shipped' },
  { label: 'Teslim Edildi', value: 'delivered' },
  { label: 'İptal Edildi', value: 'cancelled' }
]

// Sayfa değiştirme fonksiyonları
function nextPage() {
  if (page.value < pagination.value.totalPages) page.value++
}
function prevPage() {
  if (page.value > 1) page.value--
}

// Filtreleri temizle
function clearFilters() {
  userId.value = ''
  status.value = ''
  page.value = 1
}

const createOrderResult = ref<any>(null)
const createOrderPending = ref(false)

// Yeni sipariş verisi - API'nin beklediği formatta
const newOrder = ref({
  user_id: 'test-user-123', // Örnek kullanıcı ID'si
  total_price: 150.50, // API'de total_price olarak güncellendi
  status: 'pending' as OrderStatus,
  items: [
    {
      product_id: 'test-product-456', // product_id zorunlu hale geldi
      variant_id: 'test-variant-789', // variant_id opsiyonel
      quantity: 2,
      price_per_unit: 75.25 // API'de price_per_unit olarak güncellendi
    },
    {
      product_id: 'test-product-abc',
      variant_id: null, // variant_id olmayabilir
      quantity: 1,
      price_per_unit: 0 // Ücretsiz ürün testi
    }
  ]
})

// Yeni item ekleme fonksiyonu
function addItem() {
  newOrder.value.items.push({
    product_id: '',
    variant_id: '',
    quantity: 1,
    price_per_unit: 0
  })
}

// Item silme fonksiyonu
function removeItem(index: number) {
  if (newOrder.value.items.length > 1) {
    newOrder.value.items.splice(index, 1)
    calculateTotal()
  }
}

// Toplam tutarı otomatik hesaplama
function calculateTotal() {
  const total = newOrder.value.items.reduce((sum: number, item: any) => {
    return sum + (item.quantity * item.price_per_unit)
  }, 0)
  newOrder.value.total_price = Math.round(total * 100) / 100 // 2 ondalık basamak
}

// Sipariş oluşturma fonksiyonu
async function createOrder() {
  createOrderPending.value = true
  createOrderResult.value = null
  
  try {
    // useFetch ile POST isteği - Nuxt3'te önerilen yöntem
    const result = await $fetch('/api/orders', {
      method: 'POST',
      body: newOrder.value
    })
    
    createOrderResult.value = { success: true, data: result }
  } catch (err: any) {
    // Hata durumunda detaylı bilgi
    createOrderResult.value = { 
      success: false, 
      error: err?.data || err
    }
  }
  
  createOrderPending.value = false
}

// Form sıfırlama
function resetForm() {
  newOrder.value = {
    user_id: 'test-user-123',
    total_price: 150.50,
    status: 'pending',
    items: [
      {
        product_id: 'test-product-456',
        variant_id: 'test-variant-789',
        quantity: 2,
        price_per_unit: 75.25
      }
    ]
  }
  createOrderResult.value = null
}

// Form değişikliklerini izle ve toplam tutarı güncelle
watch(() => newOrder.value.items, calculateTotal, { deep: true })
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Sayfa Başlığı -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">🛒 Sipariş API Test Sayfası</h1>
        <p class="text-gray-600">POST /api/orders endpoint'ini test etmek için bu formu kullanın</p>
      </div>

      <!-- Ana Form Kartı -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Yeni Sipariş Oluştur</h2>
          <div class="flex gap-2">
            <button @click="calculateTotal" class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
              Toplam Hesapla
            </button>
            <button @click="resetForm" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Formu Sıfırla
            </button>
          </div>
        </div>

        <!-- Temel Sipariş Bilgileri -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kullanıcı ID</label>
            <input 
              v-model="newOrder.user_id" 
              type="text" 
              placeholder="user-uuid-123"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sipariş Durumu</label>
            <select 
              v-model="newOrder.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="status in orderStatuses" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Toplam Tutar (₺)</label>
            <input 
              v-model.number="newOrder.total_price" 
              type="number" 
              step="0.01"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Sipariş Kalemleri -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-800">Sipariş Kalemleri</h3>
            <button @click="addItem" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <span>➕</span> Yeni Kalem Ekle
            </button>
          </div>

          <div class="space-y-4">
            <div 
              v-for="(item, index) in newOrder.items" 
              :key="index"
              class="p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div class="flex justify-between items-center mb-3">
                <span class="font-medium text-gray-700">Kalem {{ index + 1 }}</span>
                <button 
                  v-if="newOrder.items.length > 1"
                  @click="removeItem(index)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  🗑️ Sil
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Ürün ID *</label>
                  <input 
                    v-model="item.product_id" 
                    type="text" 
                    placeholder="product-uuid"
                    class="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Varyant ID</label>
                  <input 
                    v-model="item.variant_id" 
                    type="text" 
                    placeholder="variant-uuid (opsiyonel)"
                    class="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Adet *</label>
                  <input 
                    v-model.number="item.quantity" 
                    type="number" 
                    min="1"
                    class="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Birim Fiyat (₺) *</label>
                  <input 
                    v-model.number="item.price_per_unit" 
                    type="number" 
                    step="0.01"
                    min="0"
                    class="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div class="mt-2 text-right text-sm font-medium text-gray-600">
                Subtotal: {{ (item.quantity * item.price_per_unit).toFixed(2) }} ₺
              </div>
            </div>
          </div>
        </div>

        <!-- Test Butonu -->
        <div class="text-center">
          <button 
            @click="createOrder" 
            :disabled="createOrderPending"
            class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            <span v-if="createOrderPending">⏳ Gönderiliyor...</span>
            <span v-else>🚀 Siparişi Gönder</span>
          </button>
        </div>
      </div>

      <!-- API Yanıtı -->
      <div v-if="createOrderResult" class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <span v-if="createOrderResult.success" class="text-green-600">✅</span>
          <span v-else class="text-red-600">❌</span>
          API Yanıtı
        </h3>
        
        <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre class="text-sm">{{ JSON.stringify(createOrderResult, null, 2) }}</pre>
        </div>
      </div>

      <!-- API Bilgileri -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-blue-800 mb-3">📚 API Bilgileri</h3>
        <div class="text-sm text-blue-700 space-y-2">
          <p><strong>Endpoint:</strong> POST /api/orders</p>
          <p><strong>Zorunlu Alanlar:</strong> user_id, total_price, items</p>
          <p><strong>Item Zorunlu Alanları:</strong> product_id, quantity, price_per_unit</p>
          <p><strong>Opsiyonel Alanlar:</strong> status, variant_id</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Özel animasyonlar ve stiller */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* JSON görüntüleme için özel stil */
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style> 