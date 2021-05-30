<template>
  <div
    type="text"
    class="h5"
    contenteditable="true"
    placeholder="請輸入標題"
    :id=block.id
    :value="block.content"
    @input="editBlockData(block.id, $event.target.innerHTML)"
    @keydown="keydownHandle(block, $event)"
    @focus="getFocusBlock(block.id)">{{ block.content }}</div>
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
.h5{
  margin: .2rem 0;
  line-height: 2rem;
  font-weight: 700;
}
</style>
