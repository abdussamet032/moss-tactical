<script setup lang="ts">
import { ref, computed } from 'vue'
// HeadlessUI ve ikonlar sadeleştirildi
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'
import { useRoute, useRouter } from '#imports'

// Auth durumu
const { user, signOut } = useAuth()
const open = ref(false)
const { data: categoriesRes } = await useFetch('/api/categories?tree=true')
const categories = computed(() => categoriesRes.value?.data || [])
const pages = []
const searchQuery = ref('')
const searchSuggestions = ref<string[]>([])
const showSuggestions = ref(false)
const similarSuggestions = ref<string[]>([])
let searchTimeout: number | null = null

async function onSearchInput() {
  // Debounce ile gereksiz istekleri engelle
  if (searchTimeout) clearTimeout(searchTimeout)
  if (searchQuery.value.length < 2) {
    showSuggestions.value = false
    searchSuggestions.value = []
    return
  }
  searchTimeout = window.setTimeout(async () => {
    // API'den ürünleri çek
    const { data } = await useFetch(`/api/products?search=${encodeURIComponent(searchQuery.value)}&perPage=5`)
    const results = data.value?.data || []
    if (results.length > 0) {
      // Sadece isimleri öneri olarak göster
      searchSuggestions.value = results.map((item: any) => item.name)
      showSuggestions.value = true
      // Benzer ürünleri sıfırla
      similarSuggestions.value = []
    } else {
      // Sonuç yoksa benzer ürünleri getir
      searchSuggestions.value = []
      showSuggestions.value = true
      // Benzer ürünleri çek
      const { data: similarData } = await useFetch('/api/products?perPage=5')
      similarSuggestions.value = (similarData.value?.data || []).map((item: any) => item.name)
    }
  }, 250)
}

function onSearchSubmit() {
  if (searchQuery.value.trim()) {
    // Arama sayfasına yönlendir
    navigateTo(`/products?search=${encodeURIComponent(searchQuery.value)}`)
    showSuggestions.value = false
  }
}

function hideSuggestions() {
  window.setTimeout(() => {
    showSuggestions.value = false
  }, 150)
}

const route = useRoute()
const router = useRouter()

// Sayfa ilk açıldığında query'den search parametresini al
searchQuery.value = route.query.search ? String(route.query.search) : ''
// v-model ile arama terimi değiştiğinde otomatik olarak searchTerm güncellenir
// searchTerm watcher ile query parametresi eşzamanlanacak
watch(searchQuery, (term: string) => {
  router.replace({
    query: {
      ...route.query,
      search: term || undefined // Boşsa parametreyi kaldır
    }
  })
})

watch(() => route.query.search, (newSearch: any) => {
  // Eğer searchTerm zaten aynıysa güncelleme
  if (searchQuery.value !== (newSearch ?? '')) {
    searchQuery.value = newSearch ? String(newSearch) : ''
  }
})
</script>

<template>
  <div class="bg-neutral-50">
    <!-- Mobil Menü -->
    <TransitionRoot as="template" :show="open">
      <Dialog class="fixed inset-0 z-40 lg:hidden" @close="open = false">
        <TransitionChild 
          as="template" 
          enter="transition-opacity duration-300 ease-out" 
          enter-from="opacity-0" 
          enter-to="opacity-100" 
          leave="transition-opacity duration-200 ease-in" 
          leave-from="opacity-100" 
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-primary-900/50 backdrop-blur-sm" />
        </TransitionChild>
        
        <div class="fixed inset-0 z-50 flex">
          <TransitionChild 
            as="template" 
            enter="transition-transform duration-300 ease-out" 
            enter-from="-translate-x-full" 
            enter-to="translate-x-0" 
            leave="transition-transform duration-200 ease-in" 
            leave-from="translate-x-0" 
            leave-to="-translate-x-full"
          >
            <DialogPanel class="w-80 max-w-xs bg-neutral-100 flex flex-col shadow-2xl border-r border-neutral-300">
              <!-- Header -->
              <div class="bg-primary-500 px-6 py-5">
                <div class="flex items-center justify-between">
                  <NuxtLink to="/" class="flex items-center gap-3" @click="open = false">
                    <img src="/logo.png" alt="Logo" class="h-8 w-auto" />
                    <span class="font-bold text-lg text-neutral-100">Moss Tactical</span>
                  </NuxtLink>
                  <button 
                    @click="open = false" 
                    class="p-2 text-neutral-200 hover:text-neutral-100 hover:bg-primary-600 rounded-lg transition-all duration-200"
                  >
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Navigation -->
              <div class="flex-1 px-6 py-6 space-y-4">
                <!-- Sepet -->
                <NuxtLink 
                  to="/cart" 
                  @click="open = false"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-200 hover:bg-primary-100 text-neutral-700 hover:text-primary-600 transition-all duration-200 group"
                >
                  <ShoppingBagIcon class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span class="font-medium text-sm">Sepetim</span>
                </NuxtLink>
              </div>

              <!-- User Section -->
              <div class="border-t border-neutral-300 px-6 py-6">
                <template v-if="user">
                  <div class="bg-primary-50 border border-primary-200 rounded-xl p-4 space-y-3">
                    <div class="font-semibold text-primary-800 text-sm truncate">
                      {{ user.user_metadata?.full_name || user.email }}
                    </div>
                    <div class="space-y-1">
                      <NuxtLink 
                        to="/profilim" 
                        @click="open = false"
                        class="block px-3 py-2 rounded-lg text-primary-700 hover:text-primary-800 hover:bg-primary-100 font-medium text-sm transition-all duration-200"
                      >
                        Profilim
                      </NuxtLink>
                      <NuxtLink 
                        to="/profilim/siparislerim" 
                        @click="open = false"
                        class="block px-3 py-2 rounded-lg text-primary-700 hover:text-primary-800 hover:bg-primary-100 font-medium text-sm transition-all duration-200"
                      >
                        Siparişlerim
                      </NuxtLink>
                    </div>
                    <button 
                      @click="signOut" 
                      class="w-full px-3 py-2 mt-2 rounded-lg text-error hover:bg-red-50 font-medium text-sm transition-all duration-200 text-left"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                </template>
                <template v-else>
                  <div class="space-y-2">
                    <NuxtLink 
                      to="/giris-yap" 
                      @click="open = false"
                      class="block px-4 py-3 rounded-xl bg-primary-500 text-neutral-100 font-medium text-center hover:bg-primary-600 transition-all duration-200"
                    >
                      Giriş Yap
                    </NuxtLink>
                    <NuxtLink 
                      to="#" 
                      @click="open = false"
                      class="block px-4 py-3 rounded-xl border border-secondary-300 text-secondary-600 font-medium text-center hover:bg-secondary-50 transition-all duration-200"
                    >
                      Kayıt Ol
                    </NuxtLink>
                  </div>
                </template>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Masaüstü Header -->
    <header class="bg-neutral-100 border-b border-neutral-300 shadow-sm">
      <nav class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between gap-6">
          
          <!-- Sol: Menu Toggle + Logo -->
          <div class="flex items-center gap-4 min-w-0">
            <button 
              type="button" 
              class="lg:hidden p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200" 
              @click="open = true"
            >
              <Bars3Icon class="w-6 h-6" />
            </button>
            
            <NuxtLink to="/" class="flex items-center gap-3 min-w-0 group">
              <img src="/logo.png" alt="Logo" class="h-8 w-auto group-hover:scale-105 transition-transform duration-200" />
              <span class="font-bold text-xl text-primary-600 hidden sm:block truncate group-hover:text-primary-700 transition-colors duration-200">
                Moss Tactical
              </span>
            </NuxtLink>
          </div>

          <!-- Orta: Arama -->
          <div class="hidden lg:flex flex-1 justify-center min-w-0 max-w-2xl">
            <form class="relative w-full" @submit.prevent="onSearchSubmit">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  @input="onSearchInput"
                  @focus="onSearchInput"
                  @blur="hideSuggestions"
                  type="text"
                  class="w-full pl-4 pr-12 py-3 rounded-xl border border-neutral-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 text-neutral-700 placeholder-neutral-500 bg-neutral-100 hover:bg-neutral-50 focus:bg-neutral-50 transition-all duration-200 outline-none"
                  placeholder="Ürün, marka veya kategori ara..."
                  autocomplete="off"
                  aria-label="Arama"
                />
                
                <!-- Clear Button -->
                <button
                  v-if="searchQuery"
                  type="button"
                  @mousedown.prevent="searchQuery = ''; showSuggestions = false"
                  class="absolute right-10 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 rounded-full transition-colors duration-200"
                  aria-label="Temizle"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
                
                <!-- Search Button -->
                <button 
                  type="submit" 
                  class="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-neutral-100 rounded-lg p-2 transition-all duration-200 hover:scale-105"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" stroke-linecap="round" />
                  </svg>
                </button>
              </div>

              <!-- Autocomplete Dropdown -->
              <div v-if="showSuggestions" class="absolute z-30 left-0 right-0 mt-2 bg-neutral-100 border border-neutral-300 rounded-xl shadow-xl overflow-hidden">
                <template v-if="searchSuggestions.length">
                  <div v-for="(suggestion, i) in searchSuggestions" :key="i">
                    <button 
                      type="button" 
                      class="w-full text-left px-4 py-3 hover:bg-primary-50 text-neutral-700 hover:text-primary-700 transition-all duration-200 border-b border-neutral-200 last:border-b-0" 
                      @mousedown.prevent="searchQuery = suggestion; onSearchSubmit()"
                    >
                      {{ suggestion }}
                    </button>
                  </div>
                </template>
                <template v-else>
                  <div class="px-4 py-3 text-neutral-500 text-sm">
                    Aradığınız ürün bulunamadı.
                  </div>
                  <div v-if="similarSuggestions.length" class="border-t border-neutral-200">
                    <div class="px-4 py-2 text-xs text-neutral-400 bg-neutral-200">
                      Benzer ürünler:
                    </div>
                    <div v-for="(similar, i) in similarSuggestions" :key="'sim'+i">
                      <button 
                        type="button" 
                        class="w-full text-left px-4 py-3 hover:bg-secondary-50 text-neutral-600 hover:text-secondary-700 transition-all duration-200 border-b border-neutral-200 last:border-b-0" 
                        @mousedown.prevent="searchQuery = similar; onSearchSubmit()"
                      >
                        {{ similar }}
                      </button>
                    </div>
                  </div>
                </template>
              </div>
            </form>
          </div>

          <!-- Sağ: Navigasyon ve User -->
          <div class="flex items-center gap-2 min-w-0">
            
            <!-- Desktop Navigation -->
            <div class="hidden lg:flex items-center gap-1">
              <NuxtLink 
                v-for="page in pages" 
                :key="page.name" 
                :to="page.href" 
                class="px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
              >
                {{ page.name }}
              </NuxtLink>
              
              <!-- Sepet -->
              <NuxtLink 
                to="/cart" 
                class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-50 text-neutral-700 hover:text-primary-600 transition-all duration-200 group"
              >
                <ShoppingBagIcon class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span class="text-sm font-medium hidden xl:inline">Sepetim</span>
              </NuxtLink>
            </div>

            <!-- User Section -->
            <div class="hidden lg:flex items-center gap-2 ml-2">
              <template v-if="user">
                <!-- Profile Dropdown -->
                <div class="relative group">
                  <button class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 group-hover:bg-primary-50">
                    Profil
                    <svg class="w-4 h-4 text-neutral-500 group-hover:text-primary-500 group-hover:rotate-180 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <!-- Dropdown Menu -->
                  <div class="absolute right-0 mt-1 w-56 bg-neutral-100 shadow-xl rounded-xl border border-neutral-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40">
                    <div class="px-4 py-3 border-b border-neutral-200 bg-primary-50 rounded-t-xl">
                      <div class="font-semibold text-primary-800 text-sm truncate">
                        {{ user.user_metadata?.full_name || user.email }}
                      </div>
                    </div>
                    <div class="py-2">
                      <NuxtLink 
                        to="/profilim" 
                        class="block px-4 py-2 text-neutral-700 hover:text-primary-700 hover:bg-primary-50 text-sm transition-all duration-200"
                      >
                        Profilim
                      </NuxtLink>
                      <NuxtLink 
                        to="/profilim/siparislerim" 
                        class="block px-4 py-2 text-neutral-700 hover:text-primary-700 hover:bg-primary-50 text-sm transition-all duration-200"
                      >
                        Siparişlerim
                      </NuxtLink>
                      <button 
                        @click="signOut" 
                        class="block w-full text-left px-4 py-2 text-error hover:bg-red-50 text-sm transition-all duration-200"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <NuxtLink 
                  to="/giris-yap" 
                  class="px-4 py-2 rounded-lg text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-all duration-200"
                >
                  Giriş Yap
                </NuxtLink>
                <NuxtLink 
                  to="#" 
                  class="px-4 py-2 rounded-lg text-sm font-medium bg-secondary-500 text-neutral-100 hover:bg-secondary-600 transition-all duration-200"
                >
                  Kayıt Ol
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </nav>
    </header>
  </div>
</template>

