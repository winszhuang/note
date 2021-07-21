<template>
  <BlockEditable
      :block="block"
      :placeholder="'請輸入文字'"
      :className="'p'"/>
</template>

<script>
import BlockEditable from '../input/BlockEditable.vue';

export default {
  name: 'P',
  props: ['block'],
  components: { BlockEditable },
};
</script>

<style lang="scss" scoped>
$p-height: 1.8rem;
.p {
  // color: #646464;
  line-height: $p-height;
  overflow: auto;
  margin: 0;
  padding-left: .1rem;
  // &-prefix{
  //   width: 1rem;
  //   line-height: $p-height;
  //   height: $p-height;
  //   margin: .2rem .5rem .2rem .2rem;
  //   padding-left: .2rem;
  // }
}
</style>
