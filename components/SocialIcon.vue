<template>
  <div class="flex flex-col items-center space-y-2">
    <img :src="iconPath" :alt="name" class="w-8 h-8 filter brightness-0 invert">
    <span class="text-sm text-white/70">{{ count }}</span>
  </div>
</template>

<script>
export default {
  name: 'SocialIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    iconPath: {
      type: String,
      required: true
    },
    count: {
      type: String,
      required: true
    }
  }
}
</script>
