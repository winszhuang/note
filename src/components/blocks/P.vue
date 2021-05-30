<template>
  <div
    class="p"
    type="text"
    contenteditable="true"
    spellcheck="false"
    placeholder="請輸入文字"
    :id=block.id
    :value="block.content"
    @input="editBlockData(block.id, $event.target.innerHTML)"
    @keydown="keydownHandle(block, $event)"
    @focus="getFocusBlock(block.id)">{{ block.content }}</div>
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
.p {
    line-height: 1.8rem;
    overflow: auto;
    margin: .2rem 0;
    padding-left: .1rem;
}
</style>
