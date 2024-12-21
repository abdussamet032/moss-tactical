<template>
    <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Sol taraf - Ödeme formu -->
            <div class="lg:col-span-2">
                <!-- Ödeme formu içeriği -->
                <div class="bg-white rounded-lg border border-gray-100 p-6">
                    <!-- ... ödeme formu alanları ... -->
                </div>
            </div>

            <!-- Sağ taraf - Sipariş özeti -->
            <div class="lg:col-span-1">
                <OrderSummary :subtotal="subtotal" :shipping="shipping" :total="total" />

                <!-- Ödeme butonları -->
                <div class="mt-6 flex gap-4">
                    <NuxtLink to="/checkout/shipping"
                        class="w-1/2 text-center bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all">
                        Geri Dön
                    </NuxtLink>

                    <button @click="processPayment" :disabled="processing || !isFormValid"
                        class="w-1/2 text-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ processing ? 'İşleniyor...' : 'Ödemeyi Tamamla' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const processing = ref(false)
const isFormValid = ref(true) // Bu değeri form validasyonuna göre güncelleyin

const processPayment = async () => {
    if (!isFormValid.value) return

    processing.value = true
    try {
        // Ödeme işlemi
        await handlePayment()
    } catch (error) {
        console.error('Ödeme işlemi başarısız:', error)
    } finally {
        processing.value = false
    }
}
</script>

<style scoped>
/* Mobile için bottom spacing */
@screen md {
    .container {
        padding-bottom: 0;
    }
}

@screen max-md {
    .container {
        padding-bottom: 80px;
    }
}
</style>