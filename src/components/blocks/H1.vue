<template>
  <BlockEditable
        :block="block"
        :placeholder="'請輸入標題'"
        :className="'h2'"/>
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
.h2{
  margin: .7rem 0;
  line-height: 3.5rem;
}
</style>
