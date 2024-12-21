<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-8">Alışveriş Sepeti</h1>

        <div v-if="cart.items.value.length > 0" class="grid md:grid-cols-3 gap-8">
            <!-- Sepet Ürünleri -->
            <div class="md:col-span-2 space-y-4">
                <div v-for="item in cart.items.value" :key="item.id"
                    class="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <img :src="item.image_url" :alt="item.name" class="w-24 h-24 object-cover rounded-md">
                    <div class="flex-1">
                        <h3 class="font-medium">{{ item.name }}</h3>
                        <p class="text-gray-600 text-sm">{{ formatCurrency(item.price) }}</p>
                        <p class="text-gray-500 text-sm mt-1">
                            Boyut: {{ item.size }}
                        </p>
                        <div class="flex items-center gap-4 mt-2">
                            <div class="flex items-center border rounded">
                                <button @click="updateItemQuantity(item.id, item.quantity - 1)"
                                    class="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                                    :disabled="item.quantity <= 1"
                                    :class="{'opacity-50 cursor-not-allowed': item.quantity <= 1}">
                                    -
                                </button>
                                <span class="px-3 py-1 bg-white">{{ item.quantity }}</span>
                                <button @click="updateItemQuantity(item.id, item.quantity + 1)"
                                    class="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors duration-200">
                                    +
                                </button>
                            </div>
                            <button @click="removeItem(item.id)"
                                class="text-gray-400 hover:text-red-500 transition-colors duration-200">
                                <Icon name="material-symbols:delete-outline" class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-medium">{{ formatCurrency(item.price * item.quantity) }}</p>
                    </div>
                </div>
            </div>

            <!-- Sepet Özeti -->
            <div class="bg-white p-6 rounded-lg shadow-sm h-fit">
                <h2 class="text-lg font-bold mb-4">Sipariş Özeti</h2>
                <div class="space-y-3 mb-4">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Ara Toplam</span>
                        <span>{{ formatCurrency(cart.totalPrice.value) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Kargo</span>
                        <span>Ücretsiz</span>
                    </div>
                </div>
                <div class="border-t pt-3">
                    <div class="flex justify-between font-medium">
                        <span>Toplam</span>
                        <span>{{ formatCurrency(cart.totalPrice.value) }}</span>
                    </div>
                </div>
                <button @click="$router.push('/odeme')"
                    class="w-full mt-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                    Güvenli Ödemeye Geç
                </button>
            </div>
        </div>

        <!-- Boş Sepet -->
        <div v-else class="text-center py-12">
            <Icon name="material-symbols:shopping-cart-outline" class="w-16 h-16 mx-auto text-gray-400" />
            <h2 class="text-xl font-medium mt-4">Sepetiniz Boş</h2>
            <p class="text-gray-600 mt-2">Sepetinizde henüz ürün bulunmuyor.</p>
            <NuxtLink to="/tum-urunler"
                class="inline-block mt-4 px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-gray-900 hover:to-gray-950 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:shadow-md">
                <span class="flex items-center gap-2">
                    <Icon name="material-symbols:shopping-bag" class="w-5 h-5" />
                    Alışverişe Başla
                </span>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CartItem } from '~/types/cart'

const cart = useCart()

// Sayfa yüklendiğinde sepeti kontrol et
onMounted(() => {
    if (!cart.items.value.length) {
        cart.loadCart()
    }
})

// Sepetten ürün çıkar
const removeItem = (itemId: string) => {
    if (confirm('Bu ürünü sepetten çıkarmak istediğinize emin misiniz?')) {
        cart.removeFromCart(itemId)
    }
}

// Miktar güncelle
const updateItemQuantity = (itemId: string, quantity: number) => {
    cart.updateQuantity(itemId, quantity)
}
</script>