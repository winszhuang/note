<template>
  <div @paste="paste($event, block.id)"
        v-show="!isShow">
    <BlockEditable
        :block="block"
        :no-id="true"
        :placeholder="'ctrl + v 貼上複製的圖片'"
        :className="'p'"/>
  </div>
  <ScaleController v-show="isShow" :id="block.id + 'img'">
    <img :id="block.id" />
  </ScaleController>
</template>

<script>
import { onMounted, ref } from 'vue';
import BlockEditable from '../input/BlockEditable.vue';
import ScaleController from '../ScaleController.vue';
import { showEffect } from '../commonEffect';
import commonDomEffect from '../commonDomEffect';

export default {
  name: 'Img',
  props: ['block'],
  components: { ScaleController, BlockEditable },
  setup() {
    const { pasteImage } = commonDomEffect();
    const { isShow, handleShow } = showEffect();

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
      paste,
      isShow,
      handleShow,
    };
  },
};
</script>

<style lang="scss" scoped>
img{
  width: 100%;
}
</style>
