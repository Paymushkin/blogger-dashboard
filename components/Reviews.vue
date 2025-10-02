<template>
  <div class="panel-gradient rounded-2xl p-6 backdrop-blur-[10px] border border-white/10 xl:h-full flex flex-col" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
    <h3 class="text-lg font-semibold text-white mb-4">{{ title }}</h3>
    <div class="space-y-4 mb-4 md:flex-1 md:overflow-y-auto md:pr-2 scrollbar-hide" style="-ms-overflow-style: none; scrollbar-width: none; -webkit-scrollbar: none;">
      <div class="flex space-x-3" v-for="(review, index) in reviews" :key="index">
        <!-- Аватар пользователя (если есть и не загрузился с ошибкой) -->
        <div
          v-if="review.avatar && !failedAvatars.includes(index)"
          class="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden"
        >
          <img 
            :src="review.avatar" 
            :alt="review.name"
            class="w-full h-full object-cover"
            @error="handleAvatarError($event, index)"
          />
        </div>
        
        <!-- Дефолтный аватар (если нет аватара или загрузка не удалась) -->
        <div
          v-else
          class="w-10 h-10 rounded-full flex-shrink-0 grid place-items-center"
          :style="avatarStyle(index)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 25 25" fill="none">
            <path d="M3.07439 21.7541C3.07511 21.8053 3.08591 21.8559 3.10617 21.903C3.12643 21.95 3.15577 21.9926 3.19249 22.0283C3.22922 22.064 3.27262 22.0921 3.32022 22.111C3.36781 22.13 3.41867 22.1393 3.46989 22.1386H21.6734C21.7246 22.1394 21.7756 22.1301 21.8232 22.1112C21.8709 22.0923 21.9143 22.0642 21.9511 22.0285C21.9879 21.9928 22.0173 21.9501 22.0376 21.9031C22.0579 21.856 22.0687 21.8054 22.0694 21.7541V21.2951C22.0784 21.1566 22.0969 20.4666 21.6419 19.7031C21.3549 19.2216 20.9384 18.8061 20.4039 18.4671C19.7574 18.0571 18.9349 17.7606 17.9399 17.5821C17.4348 17.5113 16.9337 17.4138 16.4389 17.2901C15.1229 16.9541 15.0079 16.6566 15.0069 16.6536C14.9991 16.6243 14.9881 16.5959 14.9739 16.5691C14.9629 16.5141 14.9364 16.3051 14.9874 15.7456C15.1164 14.3241 15.8789 13.4841 16.4914 12.8091C16.6844 12.5966 16.8669 12.3951 17.0074 12.1981C17.6139 11.3481 17.6699 10.3806 17.6724 10.3206C17.6747 10.2143 17.66 10.1083 17.6289 10.0066C17.5689 9.82162 17.4574 9.70662 17.3754 9.62162C17.356 9.60214 17.3372 9.58213 17.3189 9.56162C17.3129 9.55462 17.2969 9.53562 17.3114 9.44012C17.3604 9.13247 17.3943 8.82259 17.4129 8.51162C17.4409 8.01062 17.4624 7.26162 17.3329 6.53212C17.3139 6.39277 17.2852 6.25493 17.2469 6.11962C17.1109 5.61728 16.8909 5.18895 16.5869 4.83462C16.5344 4.77712 15.2604 3.43462 11.5619 3.15962C11.0504 3.12162 10.5449 3.14212 10.0469 3.16762C9.89961 3.17092 9.75305 3.18902 9.60939 3.22162C9.22739 3.32012 9.12539 3.56212 9.09889 3.69762C9.05439 3.92262 9.13239 4.09662 9.18389 4.21262C9.19139 4.22912 9.20089 4.24962 9.18439 4.30362C9.09889 4.43662 8.96339 4.55662 8.82589 4.67012C8.78589 4.70362 7.85889 5.50362 7.80789 6.54812C7.67039 7.34262 7.68039 8.58012 7.84289 9.43562C7.85289 9.48312 7.86639 9.55312 7.84389 9.60062C7.66889 9.75712 7.47089 9.93462 7.47139 10.3396C7.47339 10.3806 7.52989 11.3476 8.13639 12.1981C8.27639 12.3951 8.45889 12.5961 8.65139 12.8086L8.65239 12.8091C9.26489 13.4841 10.0274 14.3241 10.1564 15.7451C10.2069 16.3051 10.1804 16.5136 10.1699 16.5691C10.1555 16.5959 10.1443 16.6243 10.1364 16.6536C10.1359 16.6566 10.0214 16.9531 8.71139 17.2886C7.95539 17.4821 7.21139 17.5811 7.18889 17.5836C6.22189 17.7471 5.40439 18.0366 4.75889 18.4441C4.22639 18.7806 3.80889 19.1976 3.51889 19.6826C3.05489 20.4576 3.06739 21.1636 3.07389 21.2926L3.07439 21.7541Z" stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </div>
        
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
import { ref } from 'vue'
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
  },
  setup() {
    const failedAvatars = ref([])
    
    const handleAvatarError = (event, index) => {
      console.log(`Ошибка загрузки аватара для отзыва ${index + 1}`)
      failedAvatars.value.push(index)
    }
    
    const avatarStyle = (index) => {
      const colors = [
        'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
      ]
      return colors[index % colors.length]
    }
    
    return {
      failedAvatars,
      handleAvatarError,
      avatarStyle
    }
  }
}
</script>
