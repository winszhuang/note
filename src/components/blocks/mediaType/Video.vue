<template>
  <ContentEditable
      v-if="block.content.url === ''"
      :placeholder="'請貼上影片(youtube)網址'"
      @keydown.stop="(e) => deleteInput(e, block)"
      @input="(e) => checkURL(e, block)"/>
  <ScaleController v-if="block.content.url !== ''"
        :id="block.id + 'scale'"
        :min-width="200"
        :aspect-ratio="[16, 9]"
        :once-compression-width="block.content.compressionWidth"
        @getCompressionWidth="setCompressionWidthInBlock">
    <template #default="{ isActive }">
      <iframe
          :id="block.id"
          :src="block.content.url" frameborder="0"
          :style="{ 'pointer-events': isActive || !isIframeActive ? 'none' : 'auto' }"
          allow="accelerometer; autoplay;
          clipboard-write; encrypted-media; gyroscope;
          picture-in-picture" allowfullscreen></iframe>
    </template>
  </ScaleController>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import ScaleController from '../../ScaleController.vue';
import ContentEditable from '../../input/ContentEditable.vue';
import commonUpdateEffect from '../../../views/commonUpdataEffect';
import commonBlockEffect from '../../commonBlockEffect';

export default {
  name: 'Video',
  props: ['block'],
  components: { ScaleController, ContentEditable },
  setup(props) {
    // 可能url
    // youtube example
    // https://www.youtube.com/watch?v=au1z7L0TK5Q&ab_channel=%EB%8F%84%EB%AA%A8%EB%B0%B0%EC%B0%8C
    // https://www.youtube.com/watch?v=SBQprWeOx8g&ab_channel=RedBuster
    // https://www.youtube.com/embed/Ni7YTBYLNpA
    const store = useStore();
    const isIframeActive = computed(() => store.state.isIframeActive);

    const { getBlockWidthById } = commonBlockEffect();
    const { editBlockData, deleteInput } = commonUpdateEffect();

    const setCompressionWidthInBlock = (compressionWidth) => {
      editBlockData(props.block.id, {
        url: props.block.content.url,
        compressionWidth,
      }, 'content');
    };

    const includeStrings = [
      'youtu.be/',
      'youtube.com/embed/',
      'youtube.com/watch?v=',
    ];

    const checkURL = (e, block) => {
      const originalUrl = e.target.innerText;

      for (let i = 0; i < includeStrings.length; i += 1) {
        if (originalUrl.includes(includeStrings[i])) {
          const videoId = originalUrl.split(includeStrings[i])[1].slice(0, 11);
          editBlockData(block.id, {
            url: `https://www.youtube-nocookie.com/embed/${videoId}`,
            compressionWidth: 0,
          }, 'content');
          return;
        }
      }
    };

    return {
      isIframeActive,
      deleteInput,
      checkURL,
      getBlockWidthById,
      setCompressionWidthInBlock,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../../style/component/_input.scss';

iframe{
  width: 100%;
  height: 100%;
  pointer-events: none; // 影響可不可以在iframe正常使用mouse事件
}
</style>
