<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <h2 class="error-title">Что-то пошло не так</h2>
      <p class="error-message">{{ errorMessage }}</p>
      <button @click="retry" class="retry-button">
        Попробовать снова
      </button>
    </div>
  </div>
  <slot v-else />
</template>

<script>
import { ref, onErrorCaptured } from 'vue'

export default {
  name: 'ErrorBoundary',
  setup(_, { slots }) {
    const hasError = ref(false)
    const errorMessage = ref('')
    
    onErrorCaptured((error) => {
      hasError.value = true
      errorMessage.value = error.message || 'Произошла неизвестная ошибка'
      console.error('ErrorBoundary caught an error:', error)
      return false
    })
    
    const retry = () => {
      hasError.value = false
      errorMessage.value = ''
    }
    
    return {
      hasError,
      errorMessage,
      retry
    }
  }
}
</script>

<style scoped>
.error-boundary {
  @apply min-h-screen bg-[#0E2133] flex items-center justify-center p-5;
}

.error-content {
  @apply text-center max-w-md mx-auto;
}

.error-title {
  @apply text-2xl font-bold text-white mb-4;
}

.error-message {
  @apply text-white/70 mb-6;
}

.retry-button {
  @apply bg-white/20 hover:bg-white/30 text-white py-2 px-6 rounded-lg transition-colors;
}
</style>
