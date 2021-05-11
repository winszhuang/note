<template v-if="block.blocks.length > 0">
  <div class="ms-2 d-flex"
        v-for="(childBlockId, index) in block.blocks"
        :key="childBlockId">
    <div class="number">{{ index + 1 }}. </div>
    <P :block="getBlockById(childBlockId)"/>
  </div>
</template>

<script>
import {
  computed, onMounted, onUpdated, // nextTick,
} from 'vue';
import { useStore } from 'vuex';
import P from './P.vue';

export default {
  name: 'NumberList',
  component: { P },
  props: ['block'],
  setup(props) {
    const store = useStore();
    onMounted(() => {
      store.dispatch('addBlockInside', props.block);
    });
    onUpdated(() => {
      if (props.block.blocks.length === 0) {
        console.log('準備刪除');
        // console.log(object);
        store.dispatch('deleteBlock', {
          block: props.block,
        });
      }
    });

    const getBlockById = (id) => computed(() => store.getters.chooseBlock(id)).value;

    return { getBlockById };
  },
};
</script>

<style lang="scss" scoped>
.number{
  margin-right: .5rem;
  line-height: 2rem;
}
</style>
