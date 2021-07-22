<template>
  <div class="block-tool"
      draggable="true"
      @dragstart="handleDrag($event)">
    <font-awesome-icon :icon="['fas', 'expand-arrows-alt']" size="xs"/>
  </div>
</template>

<script>

export default {
  name: 'DragItem',
  props: ['block'],
  setup(props) {
    const handleDrag = (e) => {
      const el = document.getElementById(props.block.id).closest('.block-content');
      e.dataTransfer.setDragImage(el, 0, 0);
      e.dataTransfer.setData('text/plain', props.block.id);
    };

    return { handleDrag };
  },
};
</script>

<style lang="scss" scoped>
@import '../style/component/_block.scss';
</style>
