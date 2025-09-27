<template>
  <div class="min-h-screen bg-[#0E2133] p-5">
    <div class="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5">
      <!-- Левая часть - Профиль + Статистика + Соцсети + Примеры работ -->
      <div class="space-y-5">
        <!-- Верхняя панель -->
        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
          <!-- 1. Информация о блогере -->
          <BloggerInfo
            :name="bloggerData.name"
            :niche="bloggerData.niche"
            :avatar="bloggerData.avatar"
            :button-text="bloggerData.buttonText"
          />

          <!-- 2. Блок с соцсетями -->
          <SocialNetworks :social-networks="socialNetworks" />

          <!-- 3. Блоки статистики -->
          <StatsBlocks
            :rating="stats.rating"
            :status="stats.status"
            :completed-deals="stats.completedDeals"
          />
        </div>

        <!-- Нижняя панель - Примеры работ -->
        <WorkExamples
          :title="workExamples.title"
          :examples="workExamples.examples"
          :view-all-text="workExamples.viewAllText"
        />
      </div>

      <!-- Правая панель - Отзывы -->
      <div class="lg:h-[calc(100vh-40px)]">
        <Reviews
          :title="reviews.title"
          :reviews="reviews.reviews"
          :view-all-text="reviews.viewAllText"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import BloggerInfo from './components/BloggerInfo.vue'
import SocialNetworks from './components/SocialNetworks.vue'
import StatsBlocks from './components/StatsBlocks.vue'
import WorkExamples from './components/WorkExamples.vue'
import Reviews from './components/Reviews.vue'
import { useBloggerData } from './composables/useBloggerData.js'

export default defineComponent({
  name: 'App',
  components: {
    BloggerInfo,
    SocialNetworks,
    StatsBlocks,
    WorkExamples,
    Reviews
  },
  setup() {
    const {
      bloggerData,
      socialNetworks,
      stats,
      workExamples,
      reviews,
      totalFollowers
    } = useBloggerData()
    
    return {
      bloggerData,
      socialNetworks,
      stats,
      workExamples,
      reviews,
      totalFollowers
    }
  }
})
</script>