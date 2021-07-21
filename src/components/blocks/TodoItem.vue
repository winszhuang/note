<template>
  <div class="d-flex">
    <input type="checkbox"
            class="prefix checkbox"
            value="false"
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
.checkbox{
  display: block;
  text-align: center;
}
</style>
