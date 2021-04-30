<template>
  <input
    type="text"
    placeholder="請輸入"
    :value="block.content"
    @input="editBlockData(block.id, $event.target.value)"
    @keydown="keydownHandle(block, $event)"
    @focus="getFocusBlock(block.id)"
  >
</template>

<script>
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'P',
  props: ['block'],
  setup() {
    const { editBlockData, getFocusBlock, keydownHandle } = commonUpdateEffect();

    return {
      editBlockData, getFocusBlock, keydownHandle,
    };
  },
};
</script>

<style lang="scss" scoped>
input{
  display: block;
}
</style>
