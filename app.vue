<template>
  <div>
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Modern E-Ticaret',
  titleTemplate: '%s | Modern E-Ticaret',
  meta: [
    { name: 'description', content: 'Modern ve hızlı alışveriş deneyimi' },
    { name: 'format-detection', content: 'telephone=no' },
    { property: 'og:site_name', content: 'Modern E-Ticaret' },
    { property: 'og:type', content: 'website' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})
</script>