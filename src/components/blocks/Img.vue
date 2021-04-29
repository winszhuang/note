<template>
  <div class="blockimg"
    :style="{ backgroundImage: `url(${block.content})` }"
    @focus="getFocusBlock(block.id)"
  >
  </div>
  <!-- <img :src="block.content" alt=""> -->
  <input
    type="text"
    placeholder="請輸入圖片網址"
    :value="block.content"
    @input="editBlockData(block.id, $event.target.value)"
  >
</template>

<script>
import { ref } from 'vue';
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'Img',
  props: ['block'],
  setup() {
    const { editBlockData, getFocusBlock } = commonUpdateEffect();
    const url = ref('');

    return { url, editBlockData, getFocusBlock };
  },
};
</script>

<style lang="scss" scoped>
.blockimg{
  width: 300px;
  height: 300px;
  ;
}
</style>
