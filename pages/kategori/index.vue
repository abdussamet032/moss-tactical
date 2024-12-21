<script setup>
const { getCategories, loading, error } = useProducts()
const categories = ref([])

onMounted(async () => {
  try {
    const data = await getCategories()
    categories.value = data
  } catch (e) {
    console.error('Error loading categories:', e)
    categories.value = []
  }
})
</script>

<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold mb-8">Kategoriler</h1>

    <div v-if="loading" class="text-center py-8">
      Kategoriler yükleniyor...
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink 
        v-for="category in categories" 
        :key="category"
        :to="`/categories/${category}`"
        class="p-6 border rounded-lg hover:shadow-lg transition-shadow"
      >
        <h2 class="text-xl font-semibold">{{ category }}</h2>
      </NuxtLink>
    </div>
  </div>
</template> 