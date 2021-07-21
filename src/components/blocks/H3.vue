<template>
  <BlockEditable
          :block="block"
          :placeholder="'請輸入標題'"
          :className="'h4'"/>
</template>

<script>
import BlockEditable from '../input/BlockEditable.vue';

export default {
  name: 'H3',
  props: ['block'],
  components: { BlockEditable },
};
</script>

<style lang="scss" scoped>
.h4{
  margin: 0;
  line-height: 2rem;
  font-weight: 700;
}
</style>
