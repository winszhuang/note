<template>
  <input type="text"
        placeholder="ctrl + v 貼上複製的圖片"
        class="media-input"
        v-show="!isShow"
        @paste="paste($event, block.id)"
        @keydown="deleteInput($event, block)">
  <ScaleController v-show="isShow"
      :min-width="200"
      :id="block.id + 'img'">
    <transition>
      <img :id="block.id" :src="block.content"/>
    </transition>
  </ScaleController>
</template>

<script>
import { onMounted } from 'vue';
import ScaleController from '../ScaleController.vue';
import { showEffect } from '../commonEffect';
import commonDomEffect from '../commonDomEffect';
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'Img',
  props: ['block'],
  components: { ScaleController },
  setup(props) {
    const {
      editBlockData,
      deleteInput,
    } = commonUpdateEffect();
    const { getDataURLByClipBoardData } = commonDomEffect();
    const { isShow, handleShow } = showEffect();

    onMounted(() => {
      handleShow(props.block.content !== '');
    });

    const paste = async (e, id) => {
      try {
        const dataURL = await getDataURLByClipBoardData(e);
        editBlockData(id, dataURL, 'content');
        handleShow(true);
      } catch (error) {
        console.log(error);
      }
    };

    return {
      deleteInput,
      paste,
      isShow,
      handleShow,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/component/_input.scss';
img{
  width: 100%;
}

</style>
