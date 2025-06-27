<template>
  <div>
    <BaseLoading :isVisible="isLoading" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const isLoading = ref(false)

// Nuxt'ın kendi loading state'ini dinle
const nuxtApp = useNuxtApp()

nuxtApp.hook('page:start', () => {
  isLoading.value = true
})

nuxtApp.hook('page:finish', () => {
  // Sayfa yüklendikten sonra kısa bir delay ile loading'i kapat
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})
</script>