<template>
  <div class="panel-gradient rounded-xl p-5 backdrop-blur-[10px] border border-white/10" style="background: linear-gradient(162deg, #1C4366 0%, #2B6499 79.36%);">
    <div class="grid grid-cols-4 md:grid-cols-8 gap-4 items-center text-center">
      <SocialIcon
        v-for="social in socialNetworks"
        :key="social.name"
        :name="social.name"
        :icon-path="social.iconPath"
        :count="social.count"
      />
    </div>
  </div>
</template>

<script>
import SocialIcon from './SocialIcon.vue'

export default {
  name: 'SocialNetworks',
  components: {
    SocialIcon
  },
  props: {
    socialNetworks: {
      type: Array,
      required: true
    }
  }
}
</script>
