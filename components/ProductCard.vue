<template>
    <div class="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <NuxtLink :to="`/urun/${product.slug}`">
            <!-- Ürün Görseli -->
            <div class="relative aspect-square overflow-hidden rounded-t-lg">
                <NuxtImg :src="product.image" :alt="product.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    format="webp" />
                <div v-if="product.oldPrice"
                    class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {{ calculateDiscount(product.price, product.oldPrice) }}% İndirim
                </div>
            </div>

            <!-- Ürün Bilgileri -->
            <div class="p-4">
                <h3 class="text-sm md:text-base font-medium text-gray-900 mb-1 line-clamp-2">
                    {{ product.title }}
                </h3>
                <p class="text-sm text-gray-500 mb-2 line-clamp-1">{{ product.description }}</p>

                <!-- Fiyat Bilgisi -->
                <div class="flex items-baseline gap-2">
                    <span class="text-lg font-bold text-gray-900">
                        {{ formatPrice(product.price) }}
                    </span>
                    <span v-if="product.oldPrice" class="text-sm text-gray-500 line-through">
                        {{ formatPrice(product.oldPrice) }}
                    </span>
                </div>

                <!-- Değerlendirme -->
                <div class="flex items-center gap-1 mt-2">
                    <div class="flex items-center">
                        <Icon v-for="i in 5" :key="i"
                            :name="i <= Math.floor(product.rating) ? 'material-symbols:star' : 'material-symbols:star-outline'"
                            class="w-4 h-4 text-yellow-400" />
                    </div>
                    <span class="text-xs text-gray-500">({{ product.reviewCount }})</span>
                </div>
            </div>
        </NuxtLink>

        <!-- Sepete Ekle Butonu -->
        <button
            class="absolute bottom-0 left-0 right-0 bg-primary-600 text-white py-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg"
            @click.prevent="handleAddToCart" :disabled="!product.inStock">
            {{ product.inStock ? 'Sepete Ekle' : 'Stokta Yok' }}
        </button>
    </div>
</template>

<script setup lang="ts">
interface Product {
    id: number
    title: string
    description: string
    price: number
    oldPrice?: number
    image: string
    slug: string
    rating: number
    reviewCount: number
    inStock: boolean
}

const props = defineProps<{
    product: Product
}>()

// Fiyat formatlama
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(price)
}

// İndirim oranı hesaplama
const calculateDiscount = (price: number, oldPrice: number) => {
    return Math.round(((oldPrice - price) / oldPrice) * 100)
}

// Sepete ekleme fonksiyonu (örnek)
const { addToCart } = useCart()

// Sepete ekleme işlemi
const handleAddToCart = () => {
    addToCart(props.product, 1)
}
</script>