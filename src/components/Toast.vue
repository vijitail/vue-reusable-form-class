<template>
  <div v-show="isVisible" :class="['toast mb-2', 'toast-' + type]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "toast",
  props: {
    type: String,
    isVisible: Boolean
  }
};
</script>
