<script setup lang="ts">
import { ref, computed, watch, type Ref } from 'vue'
import BaseFilterPanel from '~/components/Base/BaseFilterPanel.vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useRoute, useRouter } from '#imports'
import type { Category } from '~/types/category'

// Filtreler için reaktif değişkenler
type Tag = string
const selectedCategory = ref('')
const selectedTags = ref<string[]>([])
const tagInput = ref('') // Çoklu tag için input
const sort = ref('newest')
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)
const inStockOnly = ref(false)

// Yeni: Filtre panelinden gelen filtreler
const filterState = ref<{ categories: string[]; brands: string[]; priceRange: any; colors: string[] }>({
  categories: [],
  brands: [],
  priceRange: null,
  colors: []
})

// Yeni: Arama terimi
const searchTerm = ref('') // v-model ile BaseFilterPanel'e bağlanacak

// Sıralama seçenekleri
const sortOptions = [
  { label: 'En Yeni', value: 'newest' },
  { label: 'En Eski', value: 'oldest' },
  { label: 'Fiyat Artan', value: 'price_asc' },
  { label: 'Fiyat Azalan', value: 'price_desc' }
]

// Nuxt 3: route ve router ile query parametresi senkronizasyonu
const route = useRoute()
const router = useRouter()

// Sayfa ilk açıldığında query'den search parametresini al
searchTerm.value = route.query.search ? String(route.query.search) : ''

// route.query.search parametresini sürekli izle, değişirse searchTerm'i güncelle
watch(() => route.query.search, (newSearch: any) => {
  // Eğer searchTerm zaten aynıysa güncelleme
  if (searchTerm.value !== (newSearch ?? '')) {
    searchTerm.value = newSearch ? String(newSearch) : ''
  }
})

// Kategorileri çek
const { data: categoriesRes, pending: categoriesPending } = await useFetch<{ data: Category[] }>('/api/categories')
const categories = computed<Category[]>(() => categoriesRes.value?.data || [])

// Query'den gelen kategori slug'larını ID'ye çevirip filtre paneline aktar
watch(
  () => ({ catList: categories.value, queryCat: route.query.category as string | undefined }),
  ({ catList, queryCat }: { catList: Category[]; queryCat: string | undefined }) => {
    if (!catList.length) return
    if (!queryCat) {
      filterState.value.categories = []
      return
    }
    // Çoklu slug desteği için virgülle ayır
    const slugs = String(queryCat).split(',')
    // Slug'lara karşılık gelen id'leri bul
    const ids = catList
      .filter((cat: Category) => cat.slug && slugs.includes(cat.slug!))
      .map((cat: Category) => cat.id)
    filterState.value.categories = ids
  },
  { immediate: true }
)

function handleFilterUpdate(filters: { categories: string[]; brands: string[]; priceRange: any; colors: string[] }) {
  filterState.value = filters
  // Fiyat aralığı ayrı tutulacak
  if (filters.priceRange) {
    minPrice.value = filters.priceRange.min
    maxPrice.value = filters.priceRange.max
  } else {
    minPrice.value = null
    maxPrice.value = null
  }
  // Kategori slug'larını query'ye yaz
  const selectedIds: string[] = filters.categories
  const selectedSlugs = categories.value
    .filter((cat: Category) => selectedIds.includes(cat.id))
    .map((cat: Category) => cat.slug)
    .filter(Boolean)
  router.replace({
    query: {
      ...route.query,
      category: selectedSlugs.length ? selectedSlugs.join(',') : undefined
    }
  })
}

// v-model ile arama terimi değiştiğinde otomatik olarak searchTerm güncellenir
// searchTerm watcher ile query parametresi eşzamanlanacak
watch(searchTerm, (term: string) => {
  page.value = 1 // Arama değişince sayfayı başa al
  router.replace({
    query: {
      ...route.query,
      search: term || undefined // Boşsa parametreyi kaldır
    }
  })
})

// Filtrelere göre ürünleri çek
const page = ref(1)
const perPage = ref(12)
const {
  data: productsRes,
  pending: productsPending,
  error: productsError
} = useFetch<{ data: any[] }>(() => {
  let query = `/api/products?page=${page.value}&perPage=${perPage.value}`
  // Kategori (çoklu)
  if (filterState.value.categories && filterState.value.categories.length > 0) query += `&category=${filterState.value.categories.join(',')}`
  // Marka (çoklu)
  if (filterState.value.brands && filterState.value.brands.length > 0) query += `&brand=${encodeURIComponent(filterState.value.brands.join(','))}`
  // Renk (çoklu)
  if (filterState.value.colors && filterState.value.colors.length > 0) query += `&color=${encodeURIComponent(filterState.value.colors.join(','))}`
  // Fiyat aralığı
  if (minPrice.value !== null) query += `&minPrice=${minPrice.value}`
  if (maxPrice.value !== null) query += `&maxPrice=${maxPrice.value}`
  if (inStockOnly.value) query += `&inStock=1`
  if (sort.value) query += `&sort=${sort.value}`
  // Arama
  if (searchTerm.value) query += `&search=${encodeURIComponent(searchTerm.value)}`
  return query
}, { watch: [filterState, sort, page, perPage, minPrice, maxPrice, inStockOnly, searchTerm] })

// API'den dönen ürünler (ProductWithDetails[] bekleniyor)
const products = computed<any[]>(() => productsRes.value?.data || [])
</script>

<template>
  <section class="min-h-screen py-16 bg-neutral-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Modern başlık ve sıralama alanı -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div class="relative w-fit mx-auto md:mx-0">
          <h1 class="text-4xl md:text-5xl font-extrabold drop-shadow-sm tracking-tight animate-section-title">
            <span class="text-primary-700">Tüm Ürünler</span>
          </h1>
          <div class="absolute left-1/2 -bottom-2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-primary-200 to-accent-200 rounded-full blur-sm opacity-60"></div>
        </div>
        <!-- Sıralama dropdown'u -->
        <Menu as="div" class="relative inline-block text-left">
          <!-- Dropdown butonu -->
          <MenuButton class="inline-flex items-center justify-center w-full rounded-xl border border-neutral-200 shadow-md px-5 py-2 bg-neutral-50 text-base font-semibold text-neutral-900 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-200 gap-2">
            <span class="mr-2">Sırala:</span>
            <span class="font-bold text-primary-700">{{ sortOptions.find(opt => opt.value === sort)?.label || 'En Yeni' }}</span>
            <!-- Modern aşağı ok ikonu -->
            <svg class="ml-2 h-5 w-5 text-primary-700 transition-transform duration-200 group-data-[open]:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 8l4 4 4-4" /></svg>
          </MenuButton>
          <!-- Dropdown menüsü -->
          <MenuItems class="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-neutral-50 ring-1 ring-black ring-opacity-5 focus:outline-none z-30 animate-dropdown-fade">
            <div class="py-2">
              <!-- Sıralama seçenekleri -->
              <MenuItem v-for="option in sortOptions" :key="option.value" v-slot="{ active }">
                <button
                  @click="sort = option.value"
                  :class="[
                    'flex items-center w-full px-5 py-2.5 text-base rounded-lg transition-all duration-150',
                    sort === option.value ? 'bg-primary-50 text-primary-700 font-bold' : active ? 'bg-neutral-100 text-primary-700' : 'text-neutral-700',
                    'hover:bg-primary-100 hover:text-primary-700'
                  ]"
                >
                  <!-- Seçili ise tik ikonu -->
                  <svg v-if="sort === option.value" class="w-5 h-5 mr-2 text-primary-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>{{ option.label }}</span>
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
      <!-- Responsive grid: filtre paneli solda, ürünler sağda (desktop); mobilde filtre üstte -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Filtre paneli: desktop solda, mobilde üstte tam genişlik -->
        <div class="mb-8 lg:mb-0 lg:mr-4 shrink-0 w-full lg:w-80">
          <!-- v-model:search ile arama terimi iki yönlü bağlanıyor -->
          <BaseFilterPanel v-model:search="searchTerm" @update:filters="handleFilterUpdate" />
        </div>
        <!-- Ürünler alanı -->
        <div class="flex-1">
          <!-- Yükleniyor durumu -->
          <div v-if="productsPending" class="flex flex-col items-center justify-center py-12 text-lg text-neutral-500 animate-fade-in">
            <svg class="w-8 h-8 mb-2 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            Yükleniyor...
          </div>
          <!-- Hata durumu -->
          <div v-else-if="productsError" class="flex flex-col items-center justify-center py-12 text-warning-500 animate-fade-in">
            <svg class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Ürünler yüklenirken hata oluştu.
          </div>
          <!-- Ürünler -->
          <div v-else>
            <div v-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
              <!-- Her ürün için kart -->
              <BaseProductCard
                v-for="(product, idx) in products"
                :key="product.id"
                :product="product"
                :class="'animate-card-fade-in'"
                :style="{ animationDelay: (idx * 80) + 'ms' }"
              />
            </div>
            <div v-else class="flex flex-col items-center text-neutral-500 py-12 animate-fade-in">
              <svg class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8z" /></svg>
              Ürün bulunamadı.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes section-title {
  from { opacity: 0; transform: translateY(-40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-section-title {
  animation: section-title 1.1s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes card-fade-in {
  from { opacity: 0; transform: scale(0.96) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-card-fade-in {
  animation: card-fade-in 0.9s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes dropdown-fade {
  from { opacity: 0; transform: translateY(-10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-dropdown-fade {
  animation: dropdown-fade 0.25s cubic-bezier(0.4,0,0.2,1) both;
}
</style> 