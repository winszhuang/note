<template>
  <div class="d-flex" :style="{ 'margin-left': `${block.content.indent*1.5}rem`}">
    <div class="prefix">
      <div class="bullet">⦁</div>
    </div>
    <P :block="block" @keydown.tab="handleIndent($event, block)"/>
  </div>
</template>

<script>
import P from '../textType/P.vue';
import useListBlockEffect from './useListBlockEffect';

export default {
  name: 'NumberItem',
  props: ['block'],
  component: {
    P,
  },
  setup() {
    const {
      handleIndent,
    } = useListBlockEffect();

    return {
      handleIndent,
    };
  },
};
</script>

<style lang="scss" scoped>
.bullet{
  padding-left: .1rem;
}
</style>
