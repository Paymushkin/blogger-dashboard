<template>
  <div class="panel-gradient rounded-2xl p-4 backdrop-blur-[10px] border border-white/10 lg:row-span-2" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
    <!-- Мобильная версия: аватар и имя в одну строку -->
    <div class="flex items-center gap-3 lg:flex-col lg:text-center">
      <div class="w-12 h-12 sm:w-14 sm:h-14 lg:w-32 lg:h-32 flex-shrink-0 rounded-full overflow-hidden">
        <img :src="avatar" :alt="name" class="w-full h-full object-cover">
      </div>
      <div class="flex-1 lg:mt-4">
        <h2 class="text-base sm:text-lg lg:text-xl font-semibold text-white mb-1">{{ name }}</h2>
        <p class="text-xs sm:text-sm text-white/70">{{ niche }}</p>
      </div>
    </div>
    <!-- <button class="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors">
      {{ buttonText }}
    </button> -->
  </div>
</template>

<script>
export default {
  name: 'BloggerInfo',
  props: {
    name: {
      type: String,
      required: true
    },
    niche: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      default: 'Предложить сделку'
    }
  }
}
</script>
