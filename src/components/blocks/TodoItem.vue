<template>
  <div class="d-flex">
    <input type="checkbox"
            class="prefix m-auto"
            :checked="block.content.isChecked"
            @input="setTodoItemData($event, block)">
    <P :block="block" />
  </div>
</template>

<script>
import P from './textType/P.vue';
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'TodoItem',
  props: ['block'],
  components: { P },
  setup() {
    const { editBlockData } = commonUpdateEffect();

    const setTodoItemData = (e, block) => {
      console.log(e);
      // console.log(e.target.checked);
      editBlockData(block.id, {
        text: block.content.text,
        html: block.content.html,
        isChecked: e.target.checked,
      }, 'content');
    };

    return { setTodoItemData };
  },
};
</script>

<style lang="scss" scoped>
</style>
