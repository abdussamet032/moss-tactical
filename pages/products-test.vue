<script setup lang="ts">
import { ref, watch } from 'vue'

// Sonuçları tutmak için reaktif obje
const results = ref<Record<string, any>>({})

// Test edilecek API'ler ve açıklamaları
const apis = [
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
    params: { name: 'Test Ürün', slug: 'test-urun', price: 99.99 }
  },
  {
    key: 'productDetail',
    label: '/api/products/[slug] (GET)',
    desc: 'Belirli bir ürünün detayını getirir. slug parametresi gereklidir.',
    method: 'GET',
    path: '/api/products/blackhawk-tactical-hafif-askeri-bot',
    params: null
  }
]

// API isteği gönderen fonksiyon
function testApi(api: typeof apis[0]) {
  results.value[api.key] = 'Yükleniyor...'
  if (api.method === 'GET') {
    const { data, error } = useFetch(api.path)
    watch([data, error], () => {
      results.value[api.key] = error.value ? error.value : data.value
    }, { immediate: true })
  } else {
    // POST isteklerinde $fetch kullan
    $fetch(api.path, {
      method: 'POST',
      body: api.params
    })
      .then((res) => {
        results.value[api.key] = res
      })
      .catch((err) => {
        results.value[api.key] = err?.data || err?.message || 'Hata oluştu'
      })
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">Ürün API Test Ortamı</h1>
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
pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>