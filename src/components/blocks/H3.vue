<template>
  <input
    type="text"
    class="h3"
    placeholder="請輸入"
    :id=block.id
    :value="block.content"
    @input="editBlockData(block.id, $event.target.value)"
    @keydown="keydownHandle(block, $event)"
    @focus="getFocusBlock(block.id)"
  >
</template>

<script>
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'H3',
  props: ['block'],
  setup() {
    const { editBlockData, getFocusBlock, keydownHandle } = commonUpdateEffect();

    return { editBlockData, getFocusBlock, keydownHandle };
  },
};
</script>

<style lang="scss" scoped>
</style>
