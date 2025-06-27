<template>
  <div
    class="group relative bg-neutral-200 rounded-2xl shadow-card hover:shadow-cardHover transition-all duration-200 hover:scale-[1.02] active:scale-95 overflow-hidden border border-neutral-200 flex flex-col"
  >
    <!-- Ürün görseli -->
    <img
      :src="product?.images[1] || '/placeholder.png'"
      :alt="product?.name"
      class="aspect-video w-full h-48 object-cover bg-neutral-100 group-hover:opacity-90 transition-opacity duration-200 rounded-t-2xl"
    />
    <div class="flex-1 flex flex-col p-6">
      <!-- Kategori etiketi -->
      <div v-if="product?.tags && product?.tags?.length" class="mb-1 flex flex-wrap gap-1">
        <span class="inline-block text-xs px-2 py-0.5 bg-neutral-100 rounded text-neutral-700 font-medium" v-for="tag in product?.tags" :key="tag">
          {{ tag }}
        </span>
      </div>
      <!-- Ürün adı -->
      <h3 class="text-2xl font-semibold text-primary-700 mb-2 truncate">
        <NuxtLink :to="`/products/${product?.slug}`" class="hover:text-primary-600 transition-colors">
          {{ product?.name }}
        </NuxtLink>
      </h3>
      <!-- Kısa açıklama -->
      <p v-if="product?.description" class="text-sm text-neutral-700 flex-1 line-clamp-2 mb-3">
        {{ product?.description }}
      </p>
      <!-- Fiyat ve buton -->
      <div class="mt-4 flex justify-between items-center">
        <span class="text-xl font-bold text-primary-700">{{ formattedPrice }}</span>
        <NuxtLink
          :to="`/products/${product?.slug}`"
          class="px-4 py-2 text-base rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-all font-semibold"
        >
          Ürüne Git
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* context7: product-card @mcps=7 */
import { computed, defineProps } from 'vue'
import { NuxtLink } from '#components'
import type { ProductWithDetails } from '~/types/product'

// Props: Ürün detayları
const props = defineProps<{ product: ProductWithDetails }>()

// Fiyatı ve para birimini formatla
const formattedPrice = computed(() => {
  // Türkçe açıklama: Para birimi varsa ekle, yoksa sadece fiyatı göster
  const price = props.product?.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })
  return props.product?.currency ? `${price} ${props.product?.currency}` : `${price} ₺`
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

export default {
  name: 'BaseProductCard'
}
