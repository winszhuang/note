<template>
  <div class="d-flex">
    <div class="prefix">{{ index + 1 }}. </div>
    <P :block="block"/>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import P from './P.vue';

export default {
  name: 'NumberItem',
  props: ['block'],
  component: {
    P,
  },
  setup(props) {
    const store = useStore();

    const getPrevBlockById = (id) => computed(() => store.getters['blocks/getPrevBlockByid'](id));

    const index = computed(() => {
      let number = 0;
      let currentBlock = { ...props.block };
      while (getPrevBlockById(currentBlock.id)?.value?.type === currentBlock.type) {
        number += 1;
        currentBlock = getPrevBlockById(currentBlock.id).value;
      }
      return number;
    });

    return { index };
  },
};
</script>

<style lang="scss" scoped>
</style>
