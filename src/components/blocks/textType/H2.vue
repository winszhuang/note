<template>
  <BlockEditable
          :block="block"
          :placeholder="'請輸入標題'"
          :className="'h3'"/>
</template>

<script>
import BlockEditable from '../../input/BlockEditable.vue';

export default {
  name: 'H2',
  props: ['block'],
  components: { BlockEditable },
};
</script>

<style lang="scss" scoped>
.h3{
  line-height: 2.5rem;
  padding-left: 3px;
  margin: 0;
}
</style>
