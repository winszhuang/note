<template>
  <div class="dragicon"
      draggable="true"
      @dragstart="handleDrag($event)"
  >
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

<style lang="scss">
.dragicon{
  width: 1rem;

  color: #c0c0c0;
  &:hover{
    color: #747474;
  }
}
</style>
