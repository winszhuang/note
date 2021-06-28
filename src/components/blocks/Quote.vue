<template>
  <div class="quote">
    <BlockEditable
            :block="block"
            :placeholder="'輸入引言。Shift + Enter可以在引言中換行'"
            :className="'h5'"/>
  </div>
</template>

<script>
import BlockEditable from '../input/BlockEditable.vue';

export default {
  name: 'Quote',
  props: ['block'],
  components: { BlockEditable },
};
</script>

<style lang="scss" scoped>
.quote{
  border-left: .4rem solid #8d8a8d;
  padding-left: .7rem;;
  margin: 1.3rem 0;
}
.h5{
  margin: .2rem 0;
  line-height: 2rem;
  font-weight: 400;
  color: #383638;
}
</style>
