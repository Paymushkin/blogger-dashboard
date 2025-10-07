<template>
  <div class="min-h-screen bg-[#0E2133] p-5 flex items-center justify-center">
    <div class="max-w-md mx-auto text-center">
      <!-- Иконка ошибки -->
      <div class="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>
      
      <!-- Заголовок -->
      <h1 class="text-2xl font-bold text-white mb-4">
        {{ title }}
      </h1>
      
      <!-- Описание -->
      <p class="text-white/70 mb-8 leading-relaxed">
        {{ message }}
      </p>
      
      <!-- Кнопка поддержки -->
      <a 
        href="https://t.me/unpacks_team" 
        target="_blank" 
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        Написать в поддержку
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorState',
  props: {
    title: {
      type: String,
      default: 'Ошибка'
    },
    message: {
      type: String,
      required: true
    }
  }
}
</script>


