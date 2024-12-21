<template>
    <div class="bg-white rounded-lg border border-gray-100 p-6">
        <h2 class="text-xl font-semibold mb-4">Sipariş Özeti</h2>

        <div class="space-y-2">
            <div class="flex justify-between">
                <span>Ara Toplam</span>
                <span>₺{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
                <span>Kargo</span>
                <span>{{ shipping > 0 ? `₺${shipping.toFixed(2)}` : 'Ücretsiz' }}</span>
            </div>
            <div class="border-t border-gray-100 pt-2 mt-2">
                <div class="flex justify-between font-semibold">
                    <span>Toplam</span>
                    <span>₺{{ total.toFixed(2) }}</span>
                </div>
            </div>
        </div>

        <div class="mt-6" v-if="buttonText && buttonLink">
            <NuxtLink :to="buttonLink"
                class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg text-center inline-block font-medium hover:bg-primary-700 transition-colors">
                {{ buttonText }}
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
defineProps({
    subtotal: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    buttonText: {
        type: String,
        default: ''
    },
    buttonLink: {
        type: String,
        default: ''
    }
})
</script>