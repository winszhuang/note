<template>
  <BlockEditable
        :block="block"
        :placeholder="'請輸入標題'"
        :className="'h1'"/>
</template>

<script>
import BlockEditable from '../input/BlockEditable.vue';

export default {
  name: 'H1',
  props: ['block'],
  components: { BlockEditable },
};
</script>

<style lang="scss" scoped>
.h1{
  margin: 0;
  padding-left: 3px;
  line-height: 3.2rem;
}
</style>
