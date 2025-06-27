<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '#imports'
import { StarIcon } from '@heroicons/vue/20/solid'
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { useAuth } from '~/composables/useAuth'
import BaseToast from '~/components/Base/BaseToast.vue'
// Nuxt 3'te cookie yönetimi için useCookie kullanılır
const cartCookie = useCookie<any[]>('cart', { default: () => [] })

const route = useRoute()
const slug = computed(() => route.params.slug)

const { data: productRes, pending: productPending, error: productError } = useFetch(() => `/api/products/${slug.value}`)

const product = computed(() => (productRes.value as any)?.data || null)

const selectedColor = ref<string | null>(null)

const { data: reviewsRes, pending: reviewsPending, error: reviewsError } = useFetch(
    () => product.value?.id ? `/api/reviews/${product.value.id}` : null,
    { watch: [product] }
)

const reviews = computed(() => {
  if (!(reviewsRes.value as any)?.data) return { average: 0, totalCount: 0, href: '#' }
  return {
    average: (reviewsRes.value as any).data.averageRating || 0,
    totalCount: (reviewsRes.value as any).data.totalReviews || 0,
    href: '#reviews',
  }
})

useHead(() => ({
  title: product.value?.name ? `${product.value.name} | Moss Tactical` : 'Ürün Detayı',
  meta: [
    { name: 'description', content: product.value?.description || '' },
  ]
}))

const isLoading = computed(() => productPending.value || reviewsPending.value)
const isError = computed(() => productError.value || reviewsError.value)

const colors = computed(() => {
  if (!product.value?.variants) return []
  const uniqueColors = Array.from(
      new Set(
          product.value.variants
              .map(v => v.attributes?.renk)
              .filter(Boolean)
      )
  )
  const colorClasses = [
    'bg-primary checked:outline-primary',
    'bg-secondary checked:outline-secondary',
    'bg-quaternary checked:outline-quaternary',
    'bg-tertiary checked:outline-tertiary',
  ]
  return uniqueColors.map((color, idx) => ({
    id: color,
    name: color,
    classes: colorClasses[idx % colorClasses.length],
  }))
})

const sizes = computed(() => {
  if (!product.value?.variants) return []

  // Tüm varyantları kullan, renk filtrelemesi yapma
  const variants = product.value.variants

  // Benzersiz bedenleri bul
  const uniqueSizes = Array.from(
      new Set(
          variants.map((v: any) => v.attributes?.beden).filter(Boolean)
      )
  )

  // Her beden için stok durumunu kontrol et
  return uniqueSizes.map(size => {
    // Beden ile eşleşen herhangi bir varyant bul
    const variant = variants.find((v: any) => v.attributes?.beden === size)

    return {
      name: size,
      inStock: (variant?.stock ?? 0) > 0,
      variantId: variant?.id,
      productId: product.value?.id, // Product ID'yi ekle
    }
  })
})

const selectedSize = ref()

// Uyarı mesajı için ref
const alertMessage = ref('')
const showAlert = ref(false)
// Başarı mesajı için ref
const successMessage = ref('')
const showSuccess = ref(false)
// Sepete ekleme yükleniyor durumu
const addCartPending = ref(false)

// Auth'dan kullanıcıyı al
const { user } = useAuth()

const router = useRouter()
// Toast için state
const showToast = ref(false)

// Uyarı mesajını gösteren fonksiyon
function triggerAlert(msg: string) {
  alertMessage.value = msg
  showAlert.value = true
  setTimeout(() => {
    showAlert.value = false
  }, 2500)
}
// Başarı mesajı fonksiyonu
function triggerSuccess(msg: string) {
  successMessage.value = msg
  showSuccess.value = true
  // Toast'ı da göster
  showToast.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 2000)
}

// Sepete git fonksiyonu
function gotoCart() {
  showToast.value = false
  router.push('/cart')
}


// Sepete ekle butonu için handler
async function handleAddToCart(e: Event) {
  e.preventDefault()
  // Renk veya beden seçilmemişse uyarı göster
  if (!selectedColor.value) {
    triggerAlert('Lütfen bir renk seçiniz.')
    return
  }
  if (!selectedSize.value) {
    triggerAlert('Lütfen bir beden seçiniz.')
    return
  }
  addCartPending.value = true

  // Ürün slug'ını al
  const productSlug = route.params.slug

  // Cookie'den sepeti oku (her zaman dizi olacak şekilde)
  let cart: any[] = Array.isArray(cartCookie.value) ? cartCookie.value : []

  // Seçilen varyant bilgisi
  const selectedVariant = {
    color: selectedColor.value,
    size: selectedSize.value?.name
  }

  // Aynı ürün ve varyant zaten sepette mi? (variant ID ile kontrol et)
  const idx = cart.findIndex((item: any) =>
      item.slug === productSlug &&
      item.variantId === selectedSize.value?.variantId
  )

  if (idx > -1) {
    // Sepette varsa miktarı artır
    cart[idx].quantity += 1
  } else {
    // Sepette yoksa yeni ekle
    // Ürün slug ve varyant bilgilerini kaydet
    cart.push({
      slug: productSlug,
      quantity: 1,
      variantId: selectedSize.value?.variantId,
      productId: product.value?.id,
      color: selectedVariant.color,
      size: selectedVariant.size,
      price_per_unit: product.value?.price,
      productTitle: product.value?.name,
      productImage: product.value?.images[0],
    })
  }

  // Sepeti cookie'ye kaydet
  cartCookie.value = [...cart]
  triggerSuccess('Ürün sepete eklendi!')
  addCartPending.value = false
}

const formatPrice = (price: number | null | undefined) => {
  if (typeof price !== 'number') return ''
  return price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺'
}

// Toast kapatma fonksiyonu
function closeToast() {
  showToast.value = false
}
</script>

<template>
  <div class="bg-white">
    <div class="pt-6">

      <!-- Image gallery -->
      <div class="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-8 lg:px-8">
       
        <img v-if="product?.images[0]" :src="product.images[0]" :alt="product.title" class="row-span-2 aspect-3/4 size-full rounded-lg object-cover max-lg:hidden" />
        <img v-if="product?.images[1]" :src="product.images[1]" :alt="product.title" class="col-start-2 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden" />
        <img v-if="product?.images[2]" :src="product.images[2]" :alt="product.title" class="col-start-2 row-start-2 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden" />
        <img v-if="product?.images[3]" :src="product.images[3]" :alt="product.title" class="row-span-2 aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-3/4" />
      </div>

      <!-- Product info -->
      <div class="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
        <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{{ product?.name }}</h1>
        </div>

        <!-- Options -->
        <div class="mt-4 lg:row-span-3 lg:mt-0">
          <h2 class="sr-only">Product information</h2>
          <p class="text-3xl tracking-tight text-gray-900">{{ formatPrice(product?.price) }}</p>

          <!-- Reviews -->
          <div class="mt-6">
            <h3 class="sr-only">Değerlendirmeler</h3>

          </div>

          <form class="mt-10" @submit="handleAddToCart">
            <!-- Colors -->
            <div>
              <h3 class="text-sm font-medium text-gray-900">Renk</h3>
              <fieldset aria-label="Renk seç" class="mt-4">
                <RadioGroup v-model="selectedColor" class="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                  <RadioGroupOption as="template" v-for="option in colors" :key="option.id" :value="option.id" v-slot="{ active, checked }">
                    <div :class="[
                      'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-hidden sm:flex-1 sm:py-6',
                      'bg-white text-gray-900 shadow-xs',
                      checked ? 'ring-2 ring-primary border-primary' : 'border-gray-200',
                      active ? 'ring-2 ring-primary' : '',
                      'cursor-pointer transition-all duration-200',
                    ]">
                      <span :class="['inline-block size-6 rounded-full border border-gray-200 mr-2', option.classes]"></span>
                      <span>{{ option.name }}</span>
                    </div>
                  </RadioGroupOption>
                </RadioGroup>
              </fieldset>
            </div>

            <!-- Sizes -->
            <div class="mt-10">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-900">Beden</h3>
                <a href="#" class="text-sm font-medium text-primary hover:text-secondary transition-colors">Beden rehberi</a>
              </div>
              <fieldset aria-label="Beden seç" class="mt-4">
                <RadioGroup v-model="selectedSize" class="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                  <RadioGroupOption as="template" v-for="size in sizes" :key="size.name" :value="size" :disabled="!size.inStock" v-slot="{ active, checked }">
                    <div :class="[size.inStock ? 'cursor-pointer bg-white text-gray-900 shadow-xs' : 'cursor-not-allowed bg-gray-50 text-gray-200', active ? 'ring-2 ring-primary' : '', 'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-hidden sm:flex-1 sm:py-6']">
                      <span>{{ size.name }}</span>
                      <span v-if="size.inStock" :class="[active ? 'border' : 'border-2', checked ? 'border-primary' : 'border-transparent', 'pointer-events-none absolute -inset-px rounded-md']" aria-hidden="true" />
                      <span v-else aria-hidden="true" class="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
                        <svg class="absolute inset-0 size-full stroke-2 text-gray-200" viewBox="0 0 100 100" preserveAspectRatio="none" stroke="currentColor">
                          <line x1="0" y1="100" x2="100" y2="0" vector-effect="non-scaling-stroke" />
                        </svg>
                      </span>
                    </div>
                  </RadioGroupOption>
                </RadioGroup>
              </fieldset>
            </div>



            <button type="submit" :disabled="addCartPending" class="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-secondary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-hidden transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
              <span v-if="!addCartPending">Sepete Ekle</span>
              <span v-else class="flex items-center gap-2"><svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Ekleniyor...</span>
            </button>
            <transition name="fade">
              <div v-if="showAlert" class="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 font-medium shadow-sm">
                <svg class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" /></svg>
                {{ alertMessage }}
              </div>
            </transition>
            <transition name="fade">
              <div v-if="showSuccess" class="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 font-medium shadow-sm">
                <svg class="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                {{ successMessage }}
              </div>
            </transition>
          </form>
        </div>

        <div class="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
          <!-- Description and details -->
          <div>
            <h3 class="sr-only">Açıklama</h3>

            <div class="space-y-6">
              <p class="text-base text-gray-900">{{ product?.description }}</p>
            </div>
          </div>

          <div class="mt-10">
            <h2 class="text-sm font-medium text-gray-900">Detaylar</h2>

            <div class="mt-4 space-y-6">
              <ul v-if="Array.isArray(product?.attributes)" class="space-y-1">
                <li v-for="attr in product.attributes" :key="attr.id || attr.attribute_name" class="flex text-sm text-gray-600">
                  <span class="font-medium text-gray-900 mr-2">{{ attr.attribute_name }}:</span>
                  <span>{{ attr.attribute_value }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-10">
            <div class="flex flex-col gap-4">
              <!-- Tags alanı -->
              <div v-if="Array.isArray(product?.tags) && product.tags.length" class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-900">Etiketler:</span>
                <span v-for="tag in product.tags" :key="tag" class="inline-block rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">{{ tag }}</span>
              </div>
              <!-- Materyal alanı -->
              <div v-if="Array.isArray(product?.materials) && product.materials.length" class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-900">Materyaller:</span>
                <span v-for="mat in product.materials" :key="mat" class="inline-block rounded-full bg-secondary/10 text-secondary px-3 py-1 text-xs font-semibold">{{ mat }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Ürün Yorumları Bölümü -->
  <section id="reviews" class="lg:max-w-7xl mx-auto mt-20 mb-16 px-4">
    <h2 class="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Ürün Yorumları</h2>
    <div v-if="reviewsPending" class="flex justify-center items-center py-12 text-gray-400 text-base">Yorumlar yükleniyor...</div>
    <div v-else-if="reviewsError" class="flex justify-center items-center py-12 text-red-500 text-base">Yorumlar yüklenirken bir hata oluştu.</div>
    <div v-else>
      <div v-if="reviewsRes?.data?.length" class="space-y-8">
        <article v-for="review in reviewsRes?.data || []" :key="review.id" class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-2">
            <div class="flex items-center justify-center size-9 rounded-full bg-primary/10 text-primary font-bold text-lg">
              {{ (review.userName || 'A').charAt(0) }}
            </div>
            <div>
              <div class="font-medium text-gray-900 text-base">{{ review.userName || 'Anonim' }}</div>
              <div class="text-xs text-gray-400">{{ new Date(review.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' }) }}</div>
            </div>
            <div class="ml-auto flex items-center gap-0.5">
              <!-- Yıldız gösterimi: puan kadar dolu yıldız -->
              <svg v-for="n in 5" :key="n" class="w-4 h-4" :class="n <= review.rating ? 'text-yellow-400' : 'text-gray-200'" fill="currentColor" viewBox="0 0 20 20"><polygon points="9.9,1.1 7.6,6.6 1.6,7.6 6,11.7 4.9,17.6 9.9,14.6 14.9,17.6 13.8,11.7 18.2,7.6 12.2,6.6 "/></svg>
            </div>
          </div>
          <p class="text-gray-700 text-base leading-relaxed mt-2">{{ review.comment }}</p>
        </article>
      </div>
      <div v-else class="flex justify-center items-center py-12 text-gray-400 text-base">Bu ürüne henüz yorum yapılmamış.</div>
    </div>
  </section>
  <BaseToast
      :show="showToast"
      :message="successMessage"
      @close="closeToast"
      @goto-cart="gotoCart"
  />
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

