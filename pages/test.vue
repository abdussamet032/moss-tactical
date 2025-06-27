<script setup lang="ts">
import { ref } from 'vue'

// API test sonuçlarını tutmak için reaktif obje
const results = ref<Record<string, any>>({})

// API'leri ve açıklamalarını tanımla
const apis = [
  {
    key: 'test',
    label: '/api/test (GET)',
    desc: 'Supabase bağlantısını test eder, ilk 3 ürünü döner.',
    method: 'GET',
    path: '/api/test',
    params: null
  },
  {
    key: 'calculate',
    label: '/api/calculate (POST)',
    desc: 'Gönderilen body içeriğini döner. Basit test için.',
    method: 'POST',
    path: '/api/calculate',
    params: { test: 'değer' }
  },
  {
    key: 'couponValidate',
    label: '/api/coupons/validate (POST)',
    desc: 'Kupon kodu ve toplam tutar ile kuponun geçerliliğini kontrol eder.',
    method: 'POST',
    path: '/api/coupons/validate',
    params: { code: 'WELCOME10', total: 1200 }
  },
  {
    key: 'getAddresses',
    label: '/api/addresses/[userId] (GET)',
    desc: 'Kullanıcıya ait adresleri getirir. userId parametresi gereklidir.',
    method: 'GET',
    path: '/api/addresses/8c06fa56-5135-43ee-b0c6-500fd7a54432',
    params: null
  },
  {
    key: 'getReviews',
    label: '/api/reviews/[productId] (GET)',
    desc: 'Bir ürüne ait değerlendirmeleri ve rating istatistiklerini getirir.',
    method: 'GET',
    path: '/api/reviews/16e65aec-a055-48db-8092-280980340d7f',
    params: null
  },
  {
    key: 'cartAdd',
    label: '/api/cart/add-item (POST)',
    desc: 'Sepete ürün ekler. user_id, variant_id ve quantity gereklidir.',
    method: 'POST',
    path: '/api/cart/add-item',
    params: { user_id: '1', variant_id: '1', quantity: 1 }
  },
  {
    key: 'cartGet',
    label: '/api/cart/[userId] (GET)',
    desc: 'Kullanıcının sepetini getirir. userId parametresi gereklidir.',
    method: 'GET',
    path: '/api/cart/1',
    params: null
  },
  {
    key: 'orders',
    label: '/api/orders (GET)',
    desc: 'Sipariş listesini getirir. Opsiyonel olarak user_id ve status query parametreleri alabilir.',
    method: 'GET',
    path: '/api/orders',
    params: null
  },
  {
    key: 'categories',
    label: '/api/categories (GET)',
    desc: 'Tüm kategorileri veya tree parametresi ile hiyerarşik kategorileri getirir.',
    method: 'GET',
    path: '/api/categories',
    params: null
  },
  {
    key: 'products',
    label: '/api/products (GET)',
    desc: 'İlk 10 ürünü getirir.',
    method: 'GET',
    path: '/api/products',
    params: null
  },
  {
    key: 'productCreate',
    label: '/api/products (POST)',
    desc: 'Yeni ürün oluşturur. name ve price zorunludur.',
    method: 'POST',
    path: '/api/products',
    params: { name: 'Test Ürün', price: 99.99 }
  },
  {
    key: 'productDetail',
    label: '/api/products/[slug] (GET)',
    desc: 'Belirli bir ürünün detayını getirir. slug parametresi gereklidir.',
    method: 'GET',
    path: '/api/products/blackhawk-tactical-hafif-askeri',
    params: null
  }
]

// API isteği gönderen fonksiyon
async function testApi(api: typeof apis[0]) {
  results.value[api.key] = 'Yükleniyor...'
  try {
    let res
    if (api.method === 'GET') {
      // GET isteklerinde params kullanılmaz, path doğrudan kullanılır
      res = await $fetch(api.path)
    } else {
      // POST isteklerinde örnek parametre gönder
      res = await $fetch(api.path, {
        method: 'POST',
        body: api.params
      })
    }
    results.value[api.key] = res
  } catch (err: any) {
    results.value[api.key] = err?.data || err?.message || 'Hata oluştu'
  }
}

const {data} = await useFetch('/api/products/blackhawk-tactical-hafif-askeri')
console.log('Product Detail:', data.value)

// Adres ekleme formu için reaktif alanlar
const addressForm = ref({
  user_id: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  is_default: false
})
const addressResult = ref<any>(null)
const addressLoading = ref(false)

// Adres ekleme fonksiyonu
async function addAddress() {
  addressLoading.value = true
  addressResult.value = null
  // $fetch ile POST isteği at (Nuxt3'te body doğrudan gönderilir)
  try {
    const res = await $fetch('/api/addresses', {
      method: 'POST',
      body: { ...addressForm.value }
    })
    addressResult.value = res
  } catch (err: any) {
    addressResult.value = err?.data || err?.message || 'Hata oluştu'
  }
  addressLoading.value = false
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">API Test Sayfası</h1>
    <!-- Adres ekleme formu başlangıcı -->
    <div class="border rounded p-4 bg-white shadow mb-8">
      <div class="font-semibold mb-2">Adres Ekleme Testi (POST /api/addresses)</div>
      <form @submit.prevent="addAddress" class="space-y-2">
        <div class="grid grid-cols-2 gap-2">
          <input v-model="addressForm.user_id" class="border p-2 rounded" placeholder="user_id (zorunlu)" required />
          <input v-model="addressForm.address_line1" class="border p-2 rounded" placeholder="Adres Satırı 1 (zorunlu)" required />
          <input v-model="addressForm.address_line2" class="border p-2 rounded" placeholder="Adres Satırı 2" />
          <input v-model="addressForm.city" class="border p-2 rounded" placeholder="Şehir (zorunlu)" required />
          <input v-model="addressForm.state" class="border p-2 rounded" placeholder="İlçe/İl" />
          <input v-model="addressForm.postal_code" class="border p-2 rounded" placeholder="Posta Kodu" />
          <input v-model="addressForm.country" class="border p-2 rounded" placeholder="Ülke (zorunlu)" required />
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="addressForm.is_default" />
            <span>Varsayılan Adres</span>
          </label>
        </div>
        <button type="submit" :disabled="addressLoading" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-2">
          {{ addressLoading ? 'Ekleniyor...' : 'Adresi Ekle' }}
        </button>
      </form>
      <div v-if="addressResult" class="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">
        <pre>{{ addressResult }}</pre>
      </div>
    </div>
    <!-- Adres ekleme formu bitişi -->
    <div class="space-y-6">
      <div v-for="api in apis" :key="api.key" class="border rounded p-4 bg-white shadow">
        <div class="flex items-center justify-between mb-2">
          <div>
            <div class="font-semibold">{{ api.label }}</div>
            <div class="text-gray-500 text-sm">{{ api.desc }}</div>
          </div>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="testApi(api)"
          >
            Test Et
          </button>
        </div>
        <div v-if="results[api.key]" class="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">
          <pre>{{ results[api.key] }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Basit responsive ve okunabilirlik için stil */
pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>