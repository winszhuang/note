<template>
  <div id="area-select"
    :style="{
      left: `${selector.left}px`,
      top: `${selector.top}px`,
      width: `${selector.width}px`,
      height: `${selector.height}px` }"></div>
</template>

<script>
import { watch, computed } from 'vue';
import { useStore } from 'vuex';
import { commonCollisionEffect } from './commonEffect';
import useAreaSelectEffect from './areaSelectEffect';

export default {
  name: 'AreaSelect',
  props: ['ids', 'workArea'],
  setup() {
    const store = useStore();
    const { isBoxACollisionB } = commonCollisionEffect();
    const currentBlocksIds = computed(() => store.getters['blocks/currentBlocksIds']);
    const selectedBlocksIds = computed(() => store.state.blocks.selectedBlocksIds);

    const {
      mouseDown,
      mouseUp,
      mouseMove,
      selector,
      currentSelectedIds,
      isAreaSelectActive,
    } = useAreaSelectEffect(currentBlocksIds, isBoxACollisionB);

    watch(() => currentSelectedIds, (curr) => {
      store.commit('blocks/setSelectedBlocksIds', [...curr]);
    }, { deep: true });

    watch(isAreaSelectActive, (curr) => {
      store.commit('setIframeActive', !curr);
    });

    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);
    document.addEventListener('mousemove', mouseMove);

    return {
      selector,
      currentSelectedIds,
      selectedBlocksIds,
    };
  },
};
</script>

<style lang="scss" scoped>
.test {
  position: fixed;
  top: 70px;
  left: 350px;
  z-index: 50;
}

#area-select{
  position: fixed;
  left: 0;
  top: 0;
  background: rgb(71, 71, 71);
  z-index: 3;
  opacity: .2;
  border: .2rem solid rgb(26, 26, 26);
}
</style>
