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
      e.dataTransfer.setData('text/plain', props.block.id);
    };

    return { handleDrag };
  },
};
</script>

<style lang="scss" scoped>
@import '../style/component/_block.scss';
</style>
