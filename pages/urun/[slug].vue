<template>
    <div class="py-8">
        <div class="container mx-auto px-4">
            <!-- Ana İçerik -->
            <div v-if="product" class="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div class="grid md:grid-cols-2 gap-8 p-6">
                    <!-- Sol: Ürün Görseli -->
                    <div class="relative">
                        <div class="aspect-square rounded-xl overflow-hidden bg-gray-50">
                            <NuxtImg :src="selectedImage?.url" :alt="product.name" class="w-full h-full object-cover"
                                format="webp" loading="eager" />
                        </div>
                        <!-- Thumbnail dots -->
                        <div class="flex justify-center gap-2 mt-4">
                            <button v-for="(image, index) in product.images" :key="index" @click="selectedImage = image"
                                class="w-2 h-2 rounded-full"
                                :class="selectedImage === image ? 'bg-primary-600' : 'bg-gray-300'" />
                        </div>
                    </div>

                    <!-- Sağ: Ürün Bilgileri -->
                    <div>
                        <div class="flex justify-between items-start mb-4">
                            <h1 class="text-2xl font-semibold text-gray-900">{{ product.name }}</h1>
                            <span class="text-xl font-semibold">{{ formatPrice(product.price) }}</span>
                        </div>

                        <!-- Kategori ve Renk -->
                        <div class="flex gap-3 mb-6">
                            <span v-if="product.category"
                                class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                                <Icon name="material-symbols:category" class="w-4 h-4 mr-1" />
                                {{ product.category }}
                            </span>
                            <span v-if="product.color"
                                class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                                <Icon name="material-symbols:palette" class="w-4 h-4 mr-1" />
                                {{ product.color }}
                            </span>
                        </div>

                        <!-- Ürün Açıklaması -->
                        <div class="mb-6">
                            <h2 class="text-lg font-medium mb-3">Ürün Açıklaması</h2>
                            <p class="text-gray-600">{{ product.description }}</p>
                        </div>

                        <!-- Bedenler -->
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <h3 class="text-sm font-medium text-gray-900">Beden</h3>
                                <!-- Stok bilgisi -->
                                <span v-if="selectedSize" class="text-sm text-gray-500">
                                    Stok: {{ selectedSize.stock }} adet
                                </span>
                            </div>

                            <div class="grid grid-cols-4 gap-2">
                                <button v-for="size in product.sizes" :key="size.id" @click="selectSize(size)"
                                    class="relative px-4 py-3 border rounded-lg text-sm font-medium transition-all duration-200"
                                    :class="{
                                        'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-200': selectedSize?.id === size.id,
                                        'border-gray-200 hover:border-primary-300 hover:bg-primary-50': selectedSize?.id !== size.id,
                                        'opacity-50 cursor-not-allowed': size.stock === 0
                                    }" :disabled="size.stock === 0">
                                    <span class="block text-base">{{ size.size }}</span>
                                    <span v-if="size.stock === 0" class="block text-xs text-red-500 mt-1">
                                        Tükendi
                                    </span>
                                    <!-- Seçili işareti -->
                                    <span v-if="selectedSize?.id === size.id"
                                        class="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                                        <Icon name="material-symbols:check" class="w-3 h-3 text-white" />
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- Satın Al ve Sepete Ekle Butonları -->
                        <div class="flex gap-4 mt-8">
                            <button @click="addToCart"
                                class="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition"
                                :disabled="!selectedSize || selectedSize.stock <= 0">
                                {{ selectedSize && selectedSize.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok' }}
                            </button>
                            <button @click="buyNow"
                                class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
                                :disabled="!selectedSize || selectedSize.stock <= 0">
                                Hemen Al
                            </button>
                            <button @click="toggleFavorite" class="p-3 rounded-lg border hover:bg-rose-50 transition">
                                <Icon
                                    :name="isFavorite ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'"
                                    class="w-6 h-6 text-rose-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="error" class="text-center py-12">
                <p class="text-red-600">{{ error.message }}</p>
            </div>
            <div v-else class="text-center py-12">
                <p>Yükleniyor...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product, ProductImage, ProductSize } from '~/types/product'
import type { AddToCartPayload } from '~/types/cart'

const route = useRoute()
const router = useRouter()
const selectedImage = ref<ProductImage | null>(null)
const selectedSize = ref<ProductSize | null>(null)
const isFavorite = ref(false)
const quantity = ref(1)

const cart = useCart()

// Ürün verilerini al
const { getProductBySlug, loading, error } = useProducts()
const product = ref<Product | null>(null)

// Ürünü yükle
onMounted(async () => {
    try {
        product.value = await getProductBySlug(route.params.slug as string)
        if (product.value) {
            if (product.value.images.length > 0) {
                selectedImage.value = product.value.images[0]
            }
            if (product.value.sizes.length > 0) {
                selectedSize.value = product.value.sizes[0] // İlk bedeni seçili olarak getir
            }
        }
    } catch (err) {
        router.push('/404')
    }
})

// Fiyat formatla
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(price)
}

// Sepete ekleme işlemi
const addToCart = () => {
    try {
        if (!product.value || !selectedSize.value) return

        cart.addToCart({
            product_id: product.value.id,
            name: product.value.name,
            price: Number(product.value.price),
            size: selectedSize.value.size,
            size_id: selectedSize.value.id,
            quantity: quantity.value || 1,
            image_url: selectedImage.value?.url || product.value.images[0]?.url || ''
        })

        alert('Ürün sepete eklendi!')
    } catch (error) {
        alert('Ürün sepete eklenirken bir hata oluştu!')
    }
}

// Hemen satın al
const buyNow = () => {
    addToCart()
    router.push('/sepet')
}

// Favorilere ekle/çıkar
const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value
}

// SEO
useHead(() => ({
    title: product.value ? `${product.value.name} - Modern E-Ticaret` : 'Ürün Yükleniyor',
    meta: [
        {
            name: 'description',
            content: product.value?.description || ''
        },
        {
            property: 'og:image',
            content: product.value?.image_url || ''
        }
    ]
}))

// İlk stokta olan bedeni seç
watchEffect(() => {
    if (product.value?.sizes?.length > 0 && !selectedSize.value) {
        // Stokta olan ilk bedeni bul
        const availableSize = product.value.sizes.find((size: ProductSize) => size.stock > 0)
        if (availableSize) {
            selectedSize.value = availableSize
        }
    }
})

// Beden seçme fonksiyonu
const selectSize = (size: ProductSize) => {
    if (size.stock === 0) return
    selectedSize.value = size
}

// Ana görsel
const mainImage = computed(() => {
    if (!product.value?.images) return ''
    return product.value.images.find((img: ProductImage) => img.is_primary)?.url || product.value.images[0]?.url
})
</script>

<style scoped>
/* Hover efektleri için opsiyonel stil */
.size-button-hover {
    @apply transition-all duration-200 ease-in-out;
}

.size-button-hover:not(:disabled):hover {
    @apply transform -translate-y-0.5 shadow-sm;
}
</style>