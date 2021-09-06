<template>
  <ContentEditable
      v-if="!isShow"
      :placeholder="'ctrl + v 貼上複製的圖片'"
      @paste.stop="paste"
      @keydown.stop="(e) => deleteInput(e, block)"
      @focus="() => setFocusBlock(block.id)"/>
  <ScaleController v-if="block.content.url"
      :id="block.id + 'scale'"
      :key="block.id + 'scale'"
      :min-width="200"
      :once-compression-width="block.content.compressionWidth"
      @getCompressionWidth="setCompressionWidthInBlock">
    <transition>
      <img :id="block.id" :src="block.content.url" referrerpolicy="no-referrer"/>
    </transition>
  </ScaleController>
</template>

<script>
import { onMounted } from 'vue';
import ScaleController from '../../ScaleController.vue';
import ContentEditable from '../../input/ContentEditable.vue';
import { showEffect } from '../../commonEffect';
import commonDomEffect from '../../commonDomEffect';
import commonUpdateEffect from '../../../views/commonUpdataEffect';

const imgurClientId = '794a032c7e8e6f4';

export default {
  name: 'Img',
  props: ['block'],
  components: { ScaleController, ContentEditable }, // ContentEditable
  setup(props) {
    const {
      editBlockData,
      deleteInput,
      setFocusBlock,
    } = commonUpdateEffect();
    const { getBlobByClipBoardData } = commonDomEffect();
    const { isShow, handleShow } = showEffect();

    onMounted(() => {
      handleShow(props.block.content.url !== '');
    });

    const setCompressionWidthInBlock = (compressionWidth) => {
      editBlockData(props.block.id, {
        url: props.block.content.url,
        compressionWidth,
      }, 'content');
    };

    const uploadImageFileToImgur = async (file) => new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', file);

      fetch('https://api.imgur.com/3/image', {
        method: 'post',
        headers: {
          Authorization: `Client-ID ${imgurClientId}`,
        },
        body: formData,
        referrer: '',
      }).then((data) => data.text())
        .then((result) => {
          const data = JSON.parse(result);
          console.log(data);
          console.log(data.data.link);
          resolve(data.data.link);
        })
        .catch((err) => reject(err));
    });

    const paste = async (e) => {
      const isPlainText = e.clipboardData.types[0] === 'text/plain';
      if (isPlainText) {
        editBlockData(props.block.id, {
          url: e.clipboardData.getData('text/plain'),
          compressionWidth: 0,
        }, 'content');
        handleShow(true);
        return;
      }

      try {
        const blob = await getBlobByClipBoardData(e);
        console.log(blob);
        const url = await uploadImageFileToImgur(blob);
        console.log(url);

        editBlockData(props.block.id, {
          url,
          compressionWidth: 0,
        }, 'content');
        handleShow(true);
        console.log('finish');
      } catch (error) {
        console.log(error);
      }
    };

    return {
      deleteInput,
      paste,
      isShow,
      handleShow,
      setFocusBlock,
      setCompressionWidthInBlock,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../../style/component/_input.scss';
img{
  width: 100%;
}

</style>
