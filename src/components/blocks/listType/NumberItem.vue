<template>
  <div class="d-flex" :style="{ 'margin-left': `${block.content.indent*1.5}rem`}">
    <div class="prefix">{{ index + 1 }}. </div>
    <P :block="block" @keydown.tab="handleIndent($event, block)"/>
  </div>
</template>

<script>
import { computed } from 'vue';
import P from '../textType/P.vue';
import useListBlockEffect from './useListBlockEffect';

export default {
  name: 'NumberItem',
  props: ['block'],
  component: {
    P,
  },
  setup(props) {
    const {
      isSameType,
      isSameIndent,
      getPrevBlockById,
      handleIndent,
    } = useListBlockEffect();

    const index = computed(() => {
      let number = 0;
      let currentBlock = { ...props.block };
      while (isSameType(getPrevBlockById(currentBlock.id).value, currentBlock)
        && isSameIndent(getPrevBlockById(currentBlock.id).value, currentBlock)) {
        number += 1;
        currentBlock = getPrevBlockById(currentBlock.id).value;
      }
      return number;
    });

    return {
      index,
      handleIndent,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
