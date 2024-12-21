<template>
    <div v-if="isCartOpen" class="fixed inset-0 z-50" @click="toggleCart">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50"></div>

        <!-- Mini Sepet -->
        <div class="absolute right-0 top-0 h-full w-96 max-w-full bg-white shadow-xl p-6" @click.stop>
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-medium">Sepetim ({{ cartItemsCount }})</h2>
                <button @click="toggleCart" class="p-2 hover:bg-gray-50 rounded-full">
                    <Icon name="material-symbols:close" class="w-6 h-6" />
                </button>
            </div>

            <!-- Sepet Boş -->
            <div v-if="!cart.length" class="text-center py-8">
                <p class="text-gray-500">Sepetinizde ürün bulunmuyor.</p>
            </div>

            <!-- Ürünler -->
            <div v-else class="space-y-4 max-h-[calc(100vh-250px)] overflow-auto">
                <div v-for="item in cart" :key="item.id" class="flex gap-4">
                    <NuxtImg :src="item.image" :alt="item.title" class="w-20 h-20 object-cover rounded-lg"
                        format="webp" />
                    <div class="flex-1">
                        <h3 class="font-medium">{{ item.title }}</h3>
                        <p class="text-sm text-gray-500">{{ item.quantity }} adet</p>
                        <p class="text-sm font-medium">{{ formatPrice(item.price * item.quantity) }}</p>
                    </div>
                    <button @click="removeFromCart(item.id)" class="p-1 text-gray-400 hover:text-red-600">
                        <Icon name="material-symbols:delete-outline" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Alt Toplam ve Butonlar -->
            <div v-if="cart.length" class="mt-6 space-y-4">
                <div class="flex justify-between font-medium">
                    <span>Toplam</span>
                    <span>{{ formatPrice(cartTotal) }}</span>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <NuxtLink to="/sepet"
                        class="text-center py-2 px-4 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
                        @click="toggleCart">
                        Sepete Git
                    </NuxtLink>
                    <NuxtLink to="/odeme"
                        class="text-center py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        @click="toggleCart">
                        Ödeme Yap
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { cart, isCartOpen, cartTotal, cartItemsCount, removeFromCart, toggleCart } = useCart()

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(price)
}
</script>