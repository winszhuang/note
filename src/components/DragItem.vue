<template>
  <div class="me-2 dragicon">
    <font-awesome-icon :icon="['fas', 'expand-arrows-alt']" size="xs"/>
  </div>
</template>

<script>
export default {
  name: 'DragItem',
};
</script>

<style lang="scss">
.dragicon{
  // line-height: ;
  color: #acacac;
  &:hover{
    color: #747474;
  }
}
</style>
