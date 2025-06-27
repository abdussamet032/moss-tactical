<template>
  <transition name="toast-fade">
    <div v-if="show" class="fixed top-8 right-8 z-50 min-w-[320px] max-w-sm bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl px-7 py-5 flex flex-col gap-4 animate-slide-in overflow-hidden">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
          <svg class="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <span class="font-semibold text-gray-900 text-lg leading-tight">{{ message }}</span>
      </div>
      <div class="flex gap-3 mt-1">
        <button @click="$emit('goto-cart')" class="flex-1 rounded-xl bg-primary text-white py-3 text-base font-semibold shadow hover:bg-primary/90 focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all">Sepete Git</button>
        <button @click="$emit('close')" class="flex-1 rounded-xl bg-white/80 border border-gray-200 text-gray-800 py-3 text-base font-semibold shadow hover:bg-gray-100 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all">Alışverişe Devam Et</button>
      </div>
      <button @click="$emit('close')" class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-2 rounded-full transition-colors focus:ring-2 focus:ring-primary/20 focus:outline-none" aria-label="Kapat">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  </transition>
</template>

<script setup>
// Props: mesaj ve gösterim durumu
const props = defineProps({
  show: Boolean,
  message: { type: String, default: 'Ürün sepete eklendi!' }
})
// Emit: close, goto-cart
</script>

<style scoped>
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.35s, transform 0.35s;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-24px) scale(0.98);
}
.animate-slide-in {
  animation: slide-in 0.45s cubic-bezier(0.4,0,0.2,1);
}
@keyframes slide-in {
  from { opacity: 0; transform: translateY(-40px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.bg-primary { background-color: #4B5320; }
.text-primary { color: #4B5320; }
</style> 