<template>
  <div class="block"
        @mouseover="hoverHandle(block.id, $event)"
        @mouseout="hoverHandle('')"
  >
    <div class="block-indent"></div>
    <div class="block-drag">
      <DragItem :block="block" v-show="isDragShow"/>
    </div>
    <div>
      <component
          :is="getFirstToUpper(block.type)"
          :block="block"
          >
      </component>
    </div>
  </div>
</template>

<script>
import { ref, toRefs } from 'vue';
import { useStore } from 'vuex';
import commonEffect from '../views/commonEffect';
import DragItem from './DragItem.vue';

export default {
  name: 'Block',
  props: ['block'],
  components: { DragItem },
  setup() {
    const store = useStore();
    const { currentBlockIdOnMouse } = toRefs(store.state);
    const { getFirstToUpper } = commonEffect();
    const isDragShow = ref(false);

    const hoverHandle = (id) => {
      // if (e) console.log(e.currentTarget);
      store.commit('changeCurrentBlockIdOnMouse', id);
      if (id === currentBlockIdOnMouse.value) {
        isDragShow.value = true;
      }
      if (id === '') {
        isDragShow.value = false;
      }
    };

    // const store = useStore();
    // const { blocks } = toRefs(store.state);

    return {
      getFirstToUpper,
      hoverHandle,
      currentBlockIdOnMouse,
      isDragShow,
    };
  },
};
</script>

<style lang="scss" scoped>
.block{
  position: relative;
  display: flex;
  margin-left: -1.5rem;
  &-drag{
    width: 1.5rem;
  }
}
</style>
