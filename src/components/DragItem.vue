<template>
  <div class="block-tool"
      draggable="true"
      @dragstart="handleDrag($event)">
    <font-awesome-icon :icon="['fas', 'expand-arrows-alt']" size="xs"/>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

const useDragBlockStartEffect = (block) => {
  const store = useStore();
  const selectedBlocksIds = computed(() => store.state.blocks.selectedBlocksIds);

  const handleDrag = (e) => {
    if (selectedBlocksIds.value.includes(block.id)) {
      store.commit('setDragStartIds', [...selectedBlocksIds.value]);
      return;
      // e.dataTransfer.setData('text/plain', ids);
    }
    const el = document.querySelector(`[data-block-id="${block.id}"]`);
    e.dataTransfer.setDragImage(el, -10, 10);
    store.commit('setDragStartIds', [block.id]);
    // e.dataTransfer.setData('text/plain', block.id);
  };

  return {
    handleDrag,
  };
};

export default {
  name: 'DragItem',
  props: ['block'],
  setup(props) {
    const { handleDrag } = useDragBlockStartEffect(props.block);

    return { handleDrag };
  },
};
</script>

<style lang="scss" scoped>
@import '../style/component/_block.scss';
</style>
