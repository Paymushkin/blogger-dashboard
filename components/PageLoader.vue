<template>
  <div class="min-h-screen bg-[#0E2133] p-5 flex items-center justify-center">
    <div class="text-center">
      <!-- Спиннер загрузки -->
      <div class="w-16 h-16 mx-auto mb-6 relative">
        <div class="absolute inset-0 border-4 border-white/20 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <!-- Текст загрузки -->
      <h2 class="text-xl font-semibold text-white mb-2">Загрузка данных блогера</h2>
      <p class="text-white/70">Пожалуйста, подождите...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageLoader'
}
</script>






