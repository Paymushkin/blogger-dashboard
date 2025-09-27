<template>
  <div class="panel-gradient rounded-2xl p-5 text-center backdrop-blur-[10px] border border-white/10 lg:row-span-2" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
    <div class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mx-auto mb-4 rounded-full overflow-hidden">
      <img :src="avatar" :alt="name" class="w-full h-full object-cover">
    </div>
    <h2 class="text-lg sm:text-xl font-semibold text-white mb-1">{{ name }}</h2>
    <p class="text-xs sm:text-sm text-white/70 mb-4">{{ niche }}</p>
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
