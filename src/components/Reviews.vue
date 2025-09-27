<template>
  <div class="panel-gradient rounded-2xl p-6 backdrop-blur-[10px] border border-white/10 h-full md:h-full flex flex-col" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
    <h3 class="text-lg font-semibold text-white mb-4">{{ title }}</h3>
    <div class="space-y-4 mb-4 md:flex-1 md:overflow-y-auto md:pr-2 scrollbar-hide" style="-ms-overflow-style: none; scrollbar-width: none; -webkit-scrollbar: none;">
      <div class="flex space-x-3" v-for="(review, index) in reviews" :key="index">
        <div class="w-10 h-10 bg-white/20 rounded-full flex-shrink-0"></div>
        <div class="flex-1">
          <div class="flex justify-between items-center mb-1">
            <span class="text-sm font-medium text-white">{{ review.name }}</span>
            <span class="text-xs text-white/70">{{ review.date }}</span>
          </div>
          <div class="flex space-x-1 mb-2">
            <StarRatingIcon v-for="star in review.rating" :key="star" />
          </div>
          <p class="text-sm text-white/80 leading-relaxed">
            {{ review.text }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StarRatingIcon from './icons/StarRatingIcon.vue'

export default {
  name: 'Reviews',
  components: {
    StarRatingIcon
  },
  props: {
    title: {
      type: String,
      required: true
    },
    reviews: {
      type: Array,
      required: true
    },
    viewAllText: {
      type: String,
      default: 'смотреть все'
    }
  }
}
</script>
