<template>
  <iframe width="560" height="315"
        :src="url" frameborder="0"
        v-if="url !== ''"
        allow="accelerometer; autoplay;
        clipboard-write; encrypted-media; gyroscope;
        picture-in-picture" allowfullscreen>
  </iframe>
  <input
      type="text"
      placeholder="請輸入影片(youtube)網址"
      :value="block.content"
      @input="editBlockData(block.id, $event.target.value)"
  >
</template>

<script>
import { computed } from 'vue';
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'Video',
  props: ['block'],
  setup(props) {
    const { editBlockData } = commonUpdateEffect();
    // https://www.youtube.com/watch?v=au1z7L0TK5Q&ab_channel=%EB%8F%84%EB%AA%A8%EB%B0%B0%EC%B0%8C
    // https://www.youtube.com/watch?v=SBQprWeOx8g&ab_channel=RedBuster
    // https://www.youtube.com/embed/Ni7YTBYLNpA
    const url = computed(() => {
      const originalUrl = props.block.content;
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

    return { url, editBlockData };
  },
};
</script>

<style lang="scss">
input{
  width: 100%;
}
</style>
