<!-- context7: base-icon @mcps=7 -->
<template>
  <span 
    class="inline-flex items-center justify-center"
    :class="[className, sizeClass]"
    :style="{ fontSize: customSize }"
  >
    <!-- Heroicons veya basit emoji fallback -->
    <span v-if="iconMap[name]" v-html="iconMap[name]"></span>
    <span v-else>{{ fallbackText }}</span>
  </span>
</template>

<script setup lang="ts">
/* context7: base-icon-logic @mcps=7 */
interface IconProps {
  name: string
  class?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  customSize?: string
}

const props = defineProps<IconProps>()

// Icon mapping - basit SVG'ler ve emoji fallback
const iconMap: Record<string, string> = {
  // Chat icons
  'ph:chat-circle-fill': '💬',
  'ph:robot-fill': '🤖',
  'ph:user-fill': '👤',
  'ph:paper-plane-right-fill': '➤',
  'ph:x': '✕',
  
  // Search icons  
  'ph:magnifying-glass': '🔍',
  'ph:spinner': '⟳',
  'ph:brain': '🧠',
  'ph:sparkle': '✨',
  'ph:clock-counter-clockwise': '🕐',
  'ph:magnifying-glass-minus': '🔍',
  
  // Fallback
  'default': '●'
}

// Size classes
const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-3 h-3'
    case 'sm': return 'w-4 h-4'
    case 'md': return 'w-5 h-5'
    case 'lg': return 'w-6 h-6'
    case 'xl': return 'w-8 h-8'
    default: return 'w-5 h-5'
  }
})

// Custom CSS class
const className = computed(() => props.class || '')

// Custom size
const customSize = computed(() => props.customSize || '')

// Fallback text
const fallbackText = computed(() => {
  return iconMap[props.name] || iconMap['default']
})
</script> 