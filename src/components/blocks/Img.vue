<template>
  <div
    type="text"
    contenteditable="true"
    placeholder="ctrl + v 貼上複製的圖片"
    :value="block.content"
    v-show="!isShow"
    @input="editBlockData(block.id, $event.target.innerHTML)"
    @paste="paste($event, block.id)"
    @keydown="keydownHandle(block, $event)"
    @focus="getFocusBlock(block.id)">{{ block.content }}</div>
  <ScaleController v-show="isShow">
    <img :id=block.id />
  </ScaleController>
</template>

<script>
import { onMounted, ref } from 'vue';
import ScaleController from '../ScaleController.vue';
import commonDomEffect from '../commonDomEffect';
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'Img',
  props: ['block'],
  components: { ScaleController },
  setup() {
    const { pasteImage, showEffect } = commonDomEffect();
    const { isShow, handleShow } = showEffect();
    const { editBlockData, getFocusBlock, keydownHandle } = commonUpdateEffect();

    onMounted(() => {
      handleShow(false);
    });

    const paste = (e, id) => {
      pasteImage(e, id);
      handleShow(true);
    };

    const url = ref('');

    return {
      url,
      editBlockData,
      getFocusBlock,
      keydownHandle,
      paste,
      isShow,
      handleShow,
    };
  },
};
</script>

<style lang="scss" scoped>
.blockimg{
  width: 300px;
  height: 300px;
  ;
}
img{
  width: 100%;
}
</style>
