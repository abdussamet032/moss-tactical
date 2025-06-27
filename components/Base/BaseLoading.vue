<template>
  <Transition
    name="loading"
    enter-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-500"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isVisible"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      <!-- Yumuşak Beyaz Arka Plan + Güçlü Blur -->
      <div class="absolute inset-0 bg-neutral-50/95 backdrop-blur-xl transition-all duration-500"></div>
      
      <!-- Yükleniyor İçeriği -->
      <div class="relative flex flex-col items-center space-y-8 z-10">
        <!-- Logo ve Çerçeve -->
        <div class="relative">
          <div class="w-20 h-20 rounded-full bg-white/90 backdrop-blur-xl shadow-xl flex items-center justify-center logo-pulse border-4 border-primary">
            <img 
              src="/logo.png" 
              alt="Logo" 
              class="w-12 h-12 object-contain"
            />
          </div>
          <!-- Dönen Yüzük (primary & accent renkleriyle) -->
          <div class="absolute inset-0 w-20 h-20 border-4 border-primary border-t-accent border-b-accent border-l-transparent border-r-transparent rounded-full rotating-ring"></div>
        </div>
        
        <!-- Yükleniyor Yazısı -->
        <div class="text-center">
          <p class="text-primary text-base font-semibold drop-shadow-lg">{{ loadingText }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
// context7: base-loading @mcps=5
// Bu bileşen, sitenin ana renk paletine uygun yükleniyor ekranı sunar.
const props = defineProps({
  isVisible: { type: Boolean, default: false },
  loadingText: { type: String, default: 'Yükleniyor...' }
})

const route = useRoute()
const searchTerm = ref('')

// Sayfa ilk açıldığında query'den search parametresini al
if (searchTerm.value === '') {
  searchTerm.value = route.query.search ? String(route.query.search) : ''
}

// route.query.search parametresini sürekli izle, değişirse searchTerm'i güncelle
watch(() => route.query.search, (newSearch) => {
  if (typeof newSearch === 'string' && searchTerm.value !== newSearch) {
    searchTerm.value = newSearch
  }
})
</script>

<style scoped>
/* Artık gradyan yok, sade beyaz arka plan ve blur için stil burada tanımlı */
.bg-neutral-50\/95 {
  background-color: rgba(249, 250, 249, 0.95);
}

.logo-pulse {
  animation: logoPulse 2s ease-in-out infinite;
}

@keyframes logoPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.rotating-ring {
  border-top-color: #C47B2A;    /* accent */
  border-bottom-color: #C47B2A; /* accent */
  border-left-color: transparent;
  border-right-color: transparent;
  border-radius: 9999px;
  animation: rotate 2.5s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.text-primary {
  color: #475D3A;
}

.border-primary {
  border-color: #475D3A;
}
</style> 