<template>
  <div class="d-flex">
    <div class="prefix">
      <div class="bullet">⦁</div>
    </div>
    <P :block="block"/>
  </div>
</template>

<script>
import P from './P.vue';

export default {
  name: 'NumberItem',
  props: ['block'],
  component: {
    P,
  },
};
</script>

<style lang="scss" scoped>
.bullet{
  padding-left: .1rem;
}
</style>
