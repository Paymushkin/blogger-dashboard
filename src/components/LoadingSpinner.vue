<template>
  <div v-if="isLoading" class="loading-spinner">
    <div class="spinner"></div>
    <p class="loading-text">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    isLoading: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: 'Загрузка...'
    }
  }
}
</script>

<style scoped>
.loading-spinner {
  @apply flex flex-col items-center justify-center p-8;
}

.spinner {
  @apply w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4;
}

.loading-text {
  @apply text-white/70 text-sm;
}
</style>
