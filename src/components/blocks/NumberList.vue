<template v-if="block.blocks.length > 0">
  <div class="ms-2 d-flex"
        v-for="(childBlockId, index) in block.blocks"
        :key="childBlockId">
    <div class="number">{{ index + 1 }}. </div>
    <Block :block="getBlockById(childBlockId)"/>
    <!-- <P :block="getBlockById(childBlockId)"/> -->
  </div>
</template>

<script>
import {
  computed, onMounted, onUpdated, // nextTick,
} from 'vue';
import { useStore } from 'vuex';
import Block from '../Block.vue';

export default {
  name: 'NumberList',
  component: { Block },
  props: ['block'],
  setup(props) {
    const store = useStore();
    onMounted(() => {
      store.dispatch('addBlockInside', props.block);
    });
    onUpdated(() => {
      if (props.block.blocks.length === 0) {
        console.log('準備刪除NumberList組件');
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
  margin-right: 3rem;
  line-height: 2rem;
}
</style>
