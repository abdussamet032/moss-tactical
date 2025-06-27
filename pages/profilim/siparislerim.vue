<template>
  <div class="min-h-screen bg-neutral-50 flex items-center justify-center py-10 px-4">
    <div class="w-full max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-8 text-center text-primary-700">Siparişlerim</h1>
      <BaseLoading :is-visible="pending" loading-text="Siparişleriniz yükleniyor..." />
      <div v-if="!pending && error" class="text-red-600 text-center my-8">Bir hata oluştu: {{ error.message }}</div>
      <div v-else-if="!pending && siparisler && siparisler.length > 0">
        <ul class="space-y-6">
          <li v-for="siparis in siparisler" :key="siparis.id" class="bg-neutral-200 rounded-2xl shadow-card p-6">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
              <span class="font-semibold text-primary-700">Sipariş No: {{ siparis.id }}</span>
              <span class="text-neutral-700">Tarih: {{ formatDate(siparis.created_at) }}</span>
            </div>
            <div class="mb-2">
              <div v-for="urun in siparis.urunler" :key="urun.id" class="flex items-center gap-2 text-neutral-700 text-sm">
                <span class="font-medium">{{ urun.ad }}</span>
                <span class="text-neutral-500">- {{ urun.adet }} adet</span>
              </div>
            </div>
            <div class="mt-2">
              Durum:
              <span :class="siparis.durum === 'tamamlandi' ? 'text-success font-semibold' : 'text-warning font-semibold'">
                {{ siparis.durum === 'tamamlandi' ? 'Tamamlandı' : 'Beklemede' }}
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div v-else-if="!pending && (!siparisler || siparisler.length === 0)" class="text-neutral-500 text-center my-12 text-lg">Henüz bir siparişiniz yok.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* context7: orders-page @mcps=7 */
definePageMeta({ layout: 'profile' })
const { user, loading: userLoading } = useAuth()
const siparisler = ref<any[]>([])
const pending = ref(true)
const error = ref<any>(null)

// Siparişleri ve ürün adlarını çek
async function fetchSiparisler() {
  pending.value = true
  error.value = null
  siparisler.value = []
  if (userLoading.value) {
    await new Promise(resolve => {
      const stop = watch(userLoading, (val: any) => {
        if (!val) {
          stop()
          resolve(true)
        }
      })
    })
  }
  if (!user.value?.id) {
    pending.value = false
    return
  }
  const { data, error: fetchError } = await useFetch(() => `/api/orders?user_id=${user.value.id}`)
  if (fetchError.value) {
    error.value = fetchError.value
    pending.value = false
    return
  }
  const orders = (data.value as any)?.data || []
  for (const order of orders) {
    const urunler: { id: string, ad: string, adet: number }[] = []
    for (const item of order.order_items || []) {
      let ad = ''
      if (item.product_id) {
        try {
          const { data: productData } = await useFetch(`/api/products/${item.product_id}`)
          ad = (productData.value as any)?.data?.name || 'Bilinmeyen Ürün'
        } catch {
          ad = 'Bilinmeyen Ürün'
        }
      }
      urunler.push({ id: item.product_id, ad, adet: item.quantity ?? 0 })
    }
    siparisler.value.push({
      id: order.id,
      created_at: order.created_at,
      urunler,
      durum: order.status || 'beklemede',
    })
  }
  pending.value = false
}
onMounted(fetchSiparisler)

// Tarih formatlama fonksiyonu
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script> 