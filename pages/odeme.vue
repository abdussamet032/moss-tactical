<template>
    <div class="py-8">
        <div class="container mx-auto px-4">
            <h1 class="text-2xl font-bold mb-8">Ödeme</h1>

            <div class="lg:grid lg:grid-cols-12 lg:gap-8">
                <!-- Sol: Form -->
                <div class="lg:col-span-8">
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <!-- Kişisel Bilgiler -->
                        <div class="mb-8">
                            <h2 class="text-lg font-medium mb-4">Kişisel Bilgiler</h2>
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Ad
                                    </label>
                                    <input v-model="checkoutForm.firstName" type="text"
                                        class="w-full p-2 border rounded-lg" placeholder="Adınız">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Soyad
                                    </label>
                                    <input v-model="checkoutForm.lastName" type="text"
                                        class="w-full p-2 border rounded-lg" placeholder="Soyadınız">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        E-posta
                                    </label>
                                    <input v-model="checkoutForm.email" type="email"
                                        class="w-full p-2 border rounded-lg" placeholder="E-posta adresiniz">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Telefon
                                    </label>
                                    <input v-model="checkoutForm.phone" v-maska data-maska="(###) ### ## ##" type="tel"
                                        class="w-full p-2 border rounded-lg" placeholder="(555) 123 45 67">
                                </div>
                            </div>
                        </div>

                        <!-- Teslimat Adresi -->
                        <div class="mb-8">
                            <h2 class="text-lg font-medium mb-4">Teslimat Adresi</h2>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Adres
                                    </label>
                                    <textarea v-model="checkoutForm.address" rows="3"
                                        class="w-full p-2 border rounded-lg" placeholder="Açık adresiniz"></textarea>
                                </div>
                                <div class="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            İl
                                        </label>
                                        <input v-model="checkoutForm.city" type="text"
                                            class="w-full p-2 border rounded-lg" placeholder="İl">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            İlçe
                                        </label>
                                        <input v-model="checkoutForm.district" type="text"
                                            class="w-full p-2 border rounded-lg" placeholder="İlçe">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            Posta Kodu
                                        </label>
                                        <input v-model="checkoutForm.zipCode" v-maska data-maska="#####" type="text"
                                            class="w-full p-2 border rounded-lg" placeholder="34100">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Ödeme Bilgileri -->
                        <div>
                            <h2 class="text-lg font-medium mb-4">Ödeme Bilgileri</h2>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Kart Üzerindeki İsim
                                    </label>
                                    <input v-model="checkoutForm.cardName" type="text"
                                        class="w-full p-2 border rounded-lg" placeholder="Kart üzerindeki isim">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Kart Numarası
                                    </label>
                                    <input v-model="checkoutForm.cardNumber" v-maska data-maska="#### #### #### ####"
                                        type="text" class="w-full p-2 border rounded-lg"
                                        placeholder="5555 5555 5555 5555">
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            Son Kullanma Tarihi
                                        </label>
                                        <input v-model="checkoutForm.cardExpiry" v-maska data-maska="##/##" type="text"
                                            class="w-full p-2 border rounded-lg" placeholder="12/25">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            CVC
                                        </label>
                                        <input v-model="checkoutForm.cardCVC" v-maska data-maska="###" type="text"
                                            class="w-full p-2 border rounded-lg" placeholder="123">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sağ: Sipariş Özeti -->
                <div class="lg:col-span-4 mt-8 lg:mt-0">
                    <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                        <h2 class="text-lg font-medium mb-4">Sipariş Özeti</h2>

                        <!-- Ürün Listesi -->
                        <div class="space-y-4 mb-4">
                            <div v-for="item in cart" :key="item.id" class="flex gap-4">
                                <NuxtImg :src="item.image" :alt="item.title" class="w-16 h-16 object-cover rounded-lg"
                                    format="webp" />
                                <div class="flex-1">
                                    <h3 class="font-medium">{{ item.title }}</h3>
                                    <p class="text-sm text-gray-500">{{ item.quantity }} adet</p>
                                    <p class="text-sm font-medium">{{ formatPrice(item.price * item.quantity) }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Toplam -->
                        <div class="border-t pt-4 space-y-2">
                            <div class="flex justify-between text-sm">
                                <span>Ara Toplam</span>
                                <span>{{ formatPrice(cartTotal) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span>Kargo</span>
                                <span>Ücretsiz</span>
                            </div>
                            <div class="flex justify-between font-medium text-lg pt-2 border-t">
                                <span>Toplam</span>
                                <span>{{ formatPrice(cartTotal) }}</span>
                            </div>
                        </div>

                        <!-- Ödeme Butonu -->
                        <button @click="handlePayment"
                            class="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition"
                            :disabled="processing">
                            {{ processing ? 'İşleniyor...' : 'Ödemeyi Tamamla' }}
                        </button>

                        <!-- Hata Mesajları -->
                        <div v-if="errors.length" class="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
                            <p v-for="error in errors" :key="error" class="text-sm">
                                {{ error }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { vMaska } from 'maska'

const router = useRouter()
const { cart, cartTotal, clearCart } = useCart()
const { checkoutForm, validateForm, processPayment } = useCheckout()

const processing = ref(false)
const errors = ref([])

// Fiyat formatla
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(price)
}

// Ödeme işlemi
const handlePayment = async () => {
    processing.value = true
    errors.value = []

    try {
        const result = await processPayment()

        if (result.success) {
            // Sepeti temizle
            clearCart()

            // Başarılı sayfasına yönlendir
            router.push({
                path: '/siparis-basarili',
                query: {
                    orderId: result.orderId
                }
            })
        } else {
            errors.value = result.errors
        }
    } catch (error) {
        errors.value = ['Beklenmeyen bir hata oluştu']
    } finally {
        processing.value = false
    }
}

// Sepet boşsa ana sayfaya yönlendir
onMounted(() => {
    if (!cart.value.length) {
        router.push('/')
    }
})

// SEO
useHead({
    title: 'Ödeme - Modern E-Ticaret',
    meta: [
        {
            name: 'description',
            content: 'Güvenli ödeme sayfası'
        }
    ]
})

// Input maskeleri için kurallar
const masks = {
    phone: '(###) ### ## ##',
    cardNumber: '#### #### #### ####',
    cardExpiry: '##/##',
    cardCVC: '###',
    zipCode: '#####'
}
</script>

<style scoped>
/* Input focus stilleri */
input:focus {
    outline: none;
    border-color: var(--primary-600);
    ring: 2px;
    ring-color: var(--primary-100);
}

/* Placeholder stilleri */
input::placeholder {
    color: #9CA3AF;
}
</style>