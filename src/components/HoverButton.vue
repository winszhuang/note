<template>
  <!-- 123 -->
  <div :class="className"
      type="button"
      @mouseenter="handleShow(true)"
      @mouseleave="handleShow(false)"
      @click="$emit('clickThen')">
    <transition>
      <slot :isShow="isShow"></slot>
    </transition>
  </div>
</template>

<script>
import { showEffect } from './commonEffect';

export default {
  name: 'HoverButton',
  props: ['className'],
  setup() {
    const { isShow, handleShow } = showEffect();

    return {
      isShow,
      handleShow,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
