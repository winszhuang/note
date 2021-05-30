<template>
  <div
    type="text"
    class="h1"
    contenteditable="true"
    placeholder="請輸入"
    :id=block.id
    :value="block.content"
    @input="editBlockData(block.id, $event.target.innerHTML)"
    @keydown="keydownHandle(block, $event)"
    @focus="getFocusBlock(block.id)">{{ block.content }}</div>
</template>

<script>
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'H1',
  props: ['block'],
  setup() {
    const { editBlockData, getFocusBlock, keydownHandle } = commonUpdateEffect();

    return { editBlockData, getFocusBlock, keydownHandle };
  },
};
</script>

<style lang="scss" scoped>
.h1{
  margin: .7rem 0;
  line-height: 3.5rem;
}
</style>
