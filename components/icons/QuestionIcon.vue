<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none"
    :class="classProp"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="17" r="1" fill="currentColor"/>
  </svg>
</template>

<script>
export default {
  name: 'QuestionIcon',
  props: {
    size: {
      type: [String, Number],
      default: 16
    },
    classProp: {
      type: String,
      default: ''
    }
  }
}
</script>

