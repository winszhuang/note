<template>
  <!-- <div class="blockimg"
    :style="{ backgroundImage: `url(${block.content})` }"
    @focus="getFocusBlock(block.id)">
  </div> -->
  <textarea
    type="text"
    placeholder="ctrl + v 貼上複製的圖片"
    :value="block.content"
    v-show="!isShowImg"
    @input="editBlockData(block.id, $event.target.value)"
    @paste="paste($event)"
    @keydown="keydownHandle(block, $event)"
    @focus="getFocusBlock(block.id)">
    </textarea>
  <img :id=block.id v-show="isShowImg"/>
</template>

<script>
import { onMounted, ref } from 'vue';
import { commonDomEffect } from '../commonEffect';
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'Img',
  props: ['block'],
  setup() {
    const isShowImg = ref('');
    onMounted(() => {
      isShowImg.value = false;
    });
    const { pasteImage } = commonDomEffect();
    const { editBlockData, getFocusBlock, keydownHandle } = commonUpdateEffect();

    const paste = (e) => {
      pasteImage(e);
      isShowImg.value = true;
    };

    const url = ref('');

    return {
      url,
      isShowImg,
      editBlockData,
      getFocusBlock,
      keydownHandle,
      paste,
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
textarea{
  color: rgb(119, 119, 119) !important;
  background: transparent;
  &::placeholder{
    color: rgb(202, 202, 202) !important;
  }
}
</style>
