<template>
  <div class="todo-item">
    <input type="checkbox"
            class="todo-item-checkbox"
            value="true"
            checked
            @input="editBlockData(block.id, $event.target.value, 'check')">
    <P :block="block" />
  </div>
</template>

<script>
import P from './P.vue';
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'TodoItem',
  props: ['block'],
  components: { P },
  setup() {
    const { editBlockData } = commonUpdateEffect();

    return { editBlockData };
  },
};
</script>

<style lang="scss" scoped>
.todo-item{
  padding-left: .5rem;
  display: flex;
  width: 100%;
  height: 100%;
  &-checkbox{
    display: block;
    width: 1rem;
    margin-top: .42rem;
    background: transparent;
  }
}
</style>
