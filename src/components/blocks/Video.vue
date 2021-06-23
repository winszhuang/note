<template>
  <BlockEditable
        v-show="url === ''"
        :block="block"
        :no-id="true"
        :placeholder="'請輸入影片(youtube)網址'"
        :className="'p'"/>
  <ScaleController
        v-show="url !== ''"
        :aspect-ratio="[16, 9]"
        :id="block.id + 'iframe'">
    <iframe
        :id="block.id"
        :src="url" frameborder="0"
        allow="accelerometer; autoplay;
        clipboard-write; encrypted-media; gyroscope;
        picture-in-picture" allowfullscreen></iframe>
  </ScaleController>
</template>

<script>
import { computed } from 'vue';
import BlockEditable from '../input/BlockEditable.vue';
import ScaleController from '../ScaleController.vue';

export default {
  name: 'Video',
  props: ['block'],
  components: { ScaleController, BlockEditable },
  setup(props) {
    // https://www.youtube.com/watch?v=au1z7L0TK5Q&ab_channel=%EB%8F%84%EB%AA%A8%EB%B0%B0%EC%B0%8C
    // https://www.youtube.com/watch?v=SBQprWeOx8g&ab_channel=RedBuster
    // https://www.youtube.com/embed/Ni7YTBYLNpA
    const url = computed(() => {
      const originalUrl = props.block.content;

      if (originalUrl.includes('youtu.be/')) {
        const videoId = originalUrl.split('youtu.be/')[1].slice(0, 11);
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (originalUrl.includes('youtube.com/embed/')) {
        const videoId = originalUrl.split('embed/')[1].slice(0, 11);
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (originalUrl.includes('youtube.com/watch?v')) {
        const videoId = originalUrl.split('?v=')[1].slice(0, 11);
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return '';
    });

    return {
      url,
    };
  },
};
</script>

<style lang="scss" scoped>

iframe{
  width: 100%;
  height: 100%;
  pointer-events: none; // 影響可不可以在iframe正常使用mouse事件
}
</style>
