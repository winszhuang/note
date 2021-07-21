<template>
  <input type="text"
        placeholder="請貼上影片(youtube)網址"
        class="media-input"
        v-show="block.content === ''"
        @keydown="deleteInput($event, block)"
        @input="checkURL($event, block)">
  <ScaleController
        v-show="block.content !== ''"
        :min-width="200"
        :aspect-ratio="[16, 9]"
        :id="block.id + 'iframe'">
    <template #default="{ isActive }">
      <iframe
          :id="block.id"
          :src="block.content" frameborder="0"
          :style="{ 'pointer-events': isActive ? 'none' : 'auto' }"
          allow="accelerometer; autoplay;
          clipboard-write; encrypted-media; gyroscope;
          picture-in-picture" allowfullscreen></iframe>
    </template>
  </ScaleController>
</template>

<script>
// import { ref } from 'vue';
import ScaleController from '../ScaleController.vue';
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'Video',
  props: ['block'],
  components: { ScaleController },
  setup() {
    // 可能url
    // youtube example
    // https://www.youtube.com/watch?v=au1z7L0TK5Q&ab_channel=%EB%8F%84%EB%AA%A8%EB%B0%B0%EC%B0%8C
    // https://www.youtube.com/watch?v=SBQprWeOx8g&ab_channel=RedBuster
    // https://www.youtube.com/embed/Ni7YTBYLNpA

    const { editBlockData, deleteInput } = commonUpdateEffect();

    const includeStrings = [
      'youtu.be/',
      'youtube.com/embed/',
      'youtube.com/watch?v=',
    ];

    const checkURL = (e, block) => {
      const originalUrl = e.target.value;

      for (let i = 0; i < includeStrings.length; i += 1) {
        if (originalUrl.includes(includeStrings[i])) {
          console.log('有包含喔');
          const videoId = originalUrl.split(includeStrings[i])[1].slice(0, 11);
          editBlockData(block.id, `https://www.youtube.com/embed/${videoId}`, 'content');
          return;
        }
      }
    };

    return {
      deleteInput,
      checkURL,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/component/_input.scss';

iframe{
  width: 100%;
  height: 100%;
  pointer-events: none; // 影響可不可以在iframe正常使用mouse事件
}
</style>
