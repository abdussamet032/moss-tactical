<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <div class="flex items-center justify-center gap-2">
      <!-- Loading spinner -->
      <svg
        v-if="loading"
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      
      <!-- Left icon -->
      <component
        v-if="leftIcon && !loading"
        :is="leftIcon"
        :class="iconSize"
      />
      
      <!-- Button text -->
      <span v-if="$slots.default">
        <slot />
      </span>
      
      <!-- Right icon -->
      <component
        v-if="rightIcon && !loading"
        :is="rightIcon"
        :class="iconSize"
      />
    </div>
  </component>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent', 'outline', 'ghost', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  to: String,
  href: String,
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  leftIcon: Object,
  rightIcon: Object,
  fullWidth: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: String,
    default: 'lg',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'full'].includes(value)
  }
})

// Events
const emit = defineEmits(['click'])

// Component tag
const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

// Size classes
const sizeClasses = computed(() => {
  const sizeMap = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  return sizeMap[props.size]
})

// Icon size
const iconSize = computed(() => {
  const iconMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  }
  return iconMap[props.size]
})

// Rounded classes
const roundedClasses = computed(() => {
  const roundMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }
  return roundMap[props.rounded]
})

// Variant classes
const variantClasses = computed(() => {
  const variantMap = {
    primary: 'bg-primary-500 text-white border-primary-500 hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-secondary-500 text-white border-secondary-500 hover:bg-secondary-600 focus:ring-secondary-500',
    accent: 'bg-accent-500 text-white border-accent-500 hover:bg-accent-600 focus:ring-accent-500',
    outline: 'bg-transparent text-primary-500 border-primary-500 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'bg-transparent text-primary-500 border-transparent hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-red-500 text-white border-red-500 hover:bg-red-600 focus:ring-red-500'
  }
  return variantMap[props.variant]
})

// Combined button classes
const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'border focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses.value,
    roundedClasses.value,
    variantClasses.value
  ]
  
  if (props.fullWidth) {
    baseClasses.push('w-full')
  }
  
  if (!props.disabled && !props.loading) {
    baseClasses.push('hover:scale-105 active:scale-95 cursor-pointer')
  } else {
    baseClasses.push('opacity-50 cursor-not-allowed')
  }
  
  return baseClasses.join(' ')
})

// Click handler
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* Button hover animations */
button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:not(:disabled):active {
  transform: translateY(0);
}

/* Focus styles */
button:focus {
  outline: none;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style> 