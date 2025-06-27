<template>
  <div class="flex flex-col min-h-screen">
    <BaseNav />
  <slot />
  <BaseFooter  class="mt-auto"/>
  
  <!-- AI Chat Widget - Geçici olarak deaktif --><AIChatWidget />
  </div>
</template>
