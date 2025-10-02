<template>
  <div class="panel-gradient rounded-xl p-4 md:p-5 backdrop-blur-[10px] border border-white/10" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
    <div class="divide-y divide-white/10">
      <div class="py-2 flex items-baseline justify-between">
        <span class="text-xs md:text-sm text-white/70 lowercase">средний рейтинг</span>
        <span class="text-xl md:text-2xl font-bold text-white">{{ rating }}</span>
      </div>
      <div class="py-2 flex items-baseline justify-between">
        <span class="text-xs md:text-sm text-white/70 lowercase">завершенные сделки</span>
        <span class="text-xl md:text-2xl font-bold text-white">{{ completedDeals }}</span>
      </div>
      <div class="py-2 flex items-baseline justify-between">
        <span class="text-xs md:text-sm text-white/70 lowercase">работает в сервисе</span>
        <span class="text-xl md:text-2xl font-bold text-white">{{ serviceTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsBlocks',
  props: {
    rating: {
      type: String,
      default: '5'
    },
    completedDeals: {
      type: [String, Number],
      default: '82'
    },
    serviceTime: {
      type: String,
      default: '9 мес. 27 д.'
    }
  }
}
</script>
