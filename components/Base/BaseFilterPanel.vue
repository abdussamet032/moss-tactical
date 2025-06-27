<template>
  <aside class="bg-neutral-50 rounded-2xl shadow-xl p-6 flex flex-col gap-7 border border-neutral-100 min-w-0 lg:sticky lg:top-8">
    
    <!-- Kategori -->
    <div v-if="categoriesPending"><span class="text-xs text-neutral-400">Kategoriler yükleniyor...</span></div>
    <div v-else-if="categoriesError"><span class="text-xs text-error-500">Kategori yüklenemedi</span></div>
    <div v-else>
      <div class="filter-title">KATEGORİ</div>
      <ul class="space-y-1">
        <li v-for="cat in categories" :key="cat.id">
          <div class="flex items-center gap-2">
            <label class="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-neutral-50 transition flex-1">
              <input type="checkbox" v-model="selectedCategories" :value="cat.id" class="accent-primary h-4 w-4 rounded border-neutral-200" @change="onCatCheckboxChange($event, cat)" />
              <span class="category-label">{{ cat.name }} <span v-if="cat.count" class="text-xs text-neutral-400">({{ cat.count }})</span></span>
            </label>
            <button v-if="cat.children && cat.children.length" @click="toggleCategory(cat.id)" class="ml-1 p-1 rounded hover:bg-neutral-100 transition text-neutral-400" type="button">
              <svg :class="[openCategories[cat.id] ? 'rotate-90' : '']" class="w-4 h-4 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <!-- Alt kategoriler -->
          <ul v-if="cat.children && cat.children.length && openCategories[cat.id]" class="ml-4 pl-2 border-l-2 border-neutral-50 bg-neutral-50/60 rounded-lg mt-1">
            <li v-for="child in cat.children" :key="child.id">
              <label class="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-neutral-100 transition">
                <input type="checkbox" v-model="selectedCategories" :value="child.id" class="accent-primary h-4 w-4 rounded border-neutral-200" @change="onCatCheckboxChange($event, child)" />
                <span class="category-label">{{ child.name }} <span v-if="child.count" class="text-xs text-neutral-400">({{ child.count }})</span></span>
              </label>
              <!-- 3. seviye örneği -->
              <ul v-if="child.children && child.children.length && openCategories[child.id]" class="ml-4 pl-2 border-l-2 border-neutral-100 bg-neutral-100/60 rounded-lg mt-1">
                <li v-for="sub in child.children" :key="sub.id">
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-neutral-100 transition">
                    <input type="checkbox" v-model="selectedCategories" :value="sub.id" class="accent-primary h-4 w-4 rounded border-neutral-200" @change="onCatCheckboxChange($event, sub)" />
                    <span class="category-label">{{ sub.name }} <span v-if="sub.count" class="text-xs text-neutral-400">({{ sub.count }})</span></span>
                  </label>
                </li>
              </ul>
              <button v-if="child.children && child.children.length" @click="toggleCategory(child.id)" class="ml-1 p-1 rounded hover:bg-neutral-100 transition text-neutral-400" type="button">
                <svg :class="[openCategories[child.id] ? 'rotate-90' : '']" class="w-4 h-4 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- Marka -->
    <div v-if="brandsPending"><span class="text-xs text-neutral-400">Markalar yükleniyor...</span></div>
    <div v-else-if="brandsError"><span class="text-xs text-error-500">Marka yüklenemedi</span></div>
    <div v-else>
      <div class="filter-title">MARKA</div>
      <div class="relative mb-2">
        <input v-model="brandSearch" type="text" placeholder="Marka ara.." class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-neutral-50" />
        <span class="absolute right-3 top-2.5 text-neutral-400"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"/></svg></span>
      </div>
      <div class="max-h-36 overflow-y-auto rounded-lg bg-neutral-50 border border-neutral-100">
        <label v-for="brand in filteredBrands" :key="brand.name" class="flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-primary/5 transition">
          <input type="checkbox" v-model="selectedBrands" :value="brand.name" class="accent-primary h-4 w-4 rounded border-neutral-200" />
          <span class="text-sm text-neutral-900">{{ brand.name }} <span class="text-xs text-neutral-400">({{ brand.count }})</span></span>
        </label>
      </div>
    </div>
    <!-- Fiyat -->
    <div>
      <div class="filter-title">FİYAT</div>
      <div class="flex gap-2 mb-3">
        <input v-model.number="manualMinPrice" type="number" min="0" placeholder="Min" class="w-1/2 px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-neutral-50" />
        <input v-model.number="manualMaxPrice" type="number" min="0" placeholder="Max" class="w-1/2 px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-neutral-50" />
      </div>
      <ul class="space-y-1">
        <li v-for="range in priceRanges" :key="range.label">
          <button @click="selectPriceRange(range)" :class="['w-full text-left px-2 py-1 rounded-lg text-sm transition', selectedPriceRange === range ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-neutral-100 text-neutral-700']">
            {{ range.label }}
          </button>
        </li>
      </ul>
    </div>
    <!-- Temizle butonu: sadece filtre seçiliyse -->
    <div v-if="hasActiveFilters" class="mt-2">
      <button @click="clearAllFilters" class="w-full py-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200 transition">Tüm filtreleri temizle</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { defineEmits, defineProps } from 'vue'
import { useRoute } from 'vue-router'
// Kategorileri API'den çek
const { data: categoriesRes, pending: categoriesPending, error: categoriesError } = await useFetch('/api/categories?tree=true')
const categories = computed(() => categoriesRes.value?.data || [])
// Markaları API'den çek
const { data: brandsRes, pending: brandsPending, error: brandsError } = await useFetch('/api/brands')
const brands = computed(() => brandsRes.value?.data || [])
const selectedCategories = ref<string[]>([])
const brandSearch = ref('')
const selectedBrands = ref<string[]>([])
const filteredBrands = computed(() => {
  if (!brandSearch.value) return brands.value
  return brands.value.filter((b: any) => b.name.toLowerCase().includes(brandSearch.value.toLowerCase()))
})
const priceRanges = ref([
  { label: '0-100 TL', min: 0, max: 100 },
  { label: '100-250 TL', min: 100, max: 250 },
  { label: '250-500 TL', min: 250, max: 500 },
  { label: '500-1000 TL', min: 500, max: 1000 },
  { label: '1000-2000 TL', min: 1000, max: 2000 },
  { label: '2000-5000 TL', min: 2000, max: 5000 },
  { label: '5000 TL ve üzeri', min: 5000, max: null }
])
const selectedPriceRange = ref<any>(null)
function selectPriceRange(range: any) {
  selectedPriceRange.value = range
}
function clearAllFilters() {
  selectedCategories.value = []
  selectedBrands.value = []
  selectedPriceRange.value = null
}

const emit = defineEmits(['update:filters', 'update:search'])

// Parent'tan seçili kategori id'leri prop olarak alınır
const props = defineProps<{ selectedCategoryIds?: string[] }>()

// Eğer parent'tan seçili kategori id'leri gelirse, burada selectedCategories'e ata
watch(
  () => props.selectedCategoryIds,
  (newIds: string[] | undefined) => {
    if (Array.isArray(newIds)) {
      selectedCategories.value = [...newIds]
    }
  },
  { immediate: true }
)
const route = useRoute()
onMounted(() => {
  // URL'den kategori slug'ını al ve bu kategoriye ait ID'yi bul
  const categoryFromUrl = categories.value.find((cat: any) => cat.slug === route.query.category)
  
  if (categoryFromUrl) {
    // Bulunan kategori ve tüm alt kategorilerinin ID'lerini topla
    const allCategoryIds = getAllCategoryIds(categoryFromUrl)
    selectedCategories.value = allCategoryIds
  } else {
    // Kategori bulunamazsa boş bir dizi ata
    selectedCategories.value = []
  }
})

// Filtre state'lerini tek nesnede topla
const manualMinPrice = ref<number | null>(null)
const manualMaxPrice = ref<number | null>(null)
const filters = computed(() => ({
  categories: selectedCategories.value,
  brands: selectedBrands.value,
  priceRange: selectedPriceRange.value || (manualMinPrice.value !== null || manualMaxPrice.value !== null ? { min: manualMinPrice.value, max: manualMaxPrice.value } : null)
}))

// Filtrelerden biri değiştiğinde parent'a bildir
watch(filters, (val: any) => {
  emit('update:filters', val)
}, { deep: true })

// Gerçek projede emit ile parent'a filtreler gönderilebilir

// Kategori seçiminde altları da otomatik seç/kaldır
function getAllCategoryIds(cat: any): string[] {
  let ids = [cat.id]
  if (cat.children && cat.children.length) {
    for (const child of cat.children) {
      ids = ids.concat(getAllCategoryIds(child))
    }
  }
  return ids
}
function handleCategoryChange(cat: any, checked: boolean) {
  const allIds = getAllCategoryIds(cat)
  if (checked) {
    // Seçili değilse ekle
    for (const id of allIds) {
      if (!selectedCategories.value.includes(id)) selectedCategories.value.push(id)
    }
  } else {
    // Kaldır
    selectedCategories.value = selectedCategories.value.filter((id: any) => !allIds.includes(id))
  }
}

function onCatCheckboxChange(event: Event, cat: any) {
  const checked = (event.target && (event.target as HTMLInputElement).checked) || false
  handleCategoryChange(cat, checked)
}

watch([manualMinPrice, manualMaxPrice], ([min, max]: [any, any]) => {
  if (min !== null || max !== null) {
    selectedPriceRange.value = null // Manuel giriş varsa preset range'i sıfırla
  }
  emit('update:filters', filters.value)
})

// Script kısmında açılır/gizlenir state
const openCategories = ref<Record<string, boolean>>({})
function toggleCategory(catId: string) {
  openCategories.value[catId] = !openCategories.value[catId]
}

// Script kısmında aktif filtre kontrolü
const hasActiveFilters = computed(() =>
  selectedCategories.value.length > 0 ||
  selectedBrands.value.length > 0 ||
  selectedPriceRange.value !== null ||
  manualMinPrice.value !== null ||
  manualMaxPrice.value !== null
)
</script>

<style scoped>
@import '@/assets/css/main.css';

.filter-title {
  @apply text-xs text-primary font-semibold uppercase mb-2 tracking-wider;
}
.category-label {
  @apply text-xs text-neutral-900;
}
::-webkit-scrollbar { width: 6px; background: #f3f4f6; }
::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
</style>

export default {
  name: 'BaseFilterPanel'
} 