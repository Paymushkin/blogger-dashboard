<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5 h-full">
    <!-- Блок с рейтингом -->
    <div class="panel-gradient rounded-xl p-5 backdrop-blur-[10px] border border-white/10 h-full flex justify-between items-center" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
      <div class="flex flex-col">
        <span class="text-xs text-white/70 lowercase">рейтинг</span>
        <span class="text-3xl font-bold text-white">{{ rating }}</span>
      </div>
      <StarIcon class="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
    </div>

    <!-- Блок со статусом -->
    <div class="panel-gradient rounded-xl p-5 backdrop-blur-[10px] border border-white/10 h-full flex justify-between items-center" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
      <div class="flex flex-col">
        <span class="text-xs text-white/70 lowercase">статус</span>
        <span class="text-3xl font-bold text-white">{{ status }}</span>
      </div>
      <CheckIcon class="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
    </div>

    <!-- Блок с завершенными сделками -->
    <div class="panel-gradient rounded-xl p-5 backdrop-blur-[10px] border border-white/10 h-full flex justify-between items-center" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
      <div class="flex flex-col">
        <span class="text-xs text-white/70 lowercase">завершенные<br>сделки</span>
        <span class="text-3xl font-bold text-white">{{ completedDeals }}</span>
      </div>
      <DealsIcon class="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
    </div>
  </div>
</template>

<script>
import StarIcon from './icons/StarIcon.vue'
import CheckIcon from './icons/CheckIcon.vue'
import DealsIcon from './icons/DealsIcon.vue'

export default {
  name: 'StatsBlocks',
  components: {
    StarIcon,
    CheckIcon,
    DealsIcon
  },
  props: {
    rating: {
      type: String,
      default: '4,9'
    },
    status: {
      type: String,
      default: 'ТОП'
    },
    completedDeals: {
      type: [String, Number],
      default: '127'
    }
  }
}
</script>
