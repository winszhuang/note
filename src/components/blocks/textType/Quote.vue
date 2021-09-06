<template>
  <div class="quote">
    <BlockEditable
            :block="block"
            :placeholder="'請輸入引言'"
            :className="'h5'"/>
  </div>
</template>

<script>
import BlockEditable from '../../input/BlockEditable.vue';

export default {
  name: 'Quote',
  props: ['block'],
  components: { BlockEditable },
};
</script>

<style lang="scss" scoped>
.quote{
  border-left: .4rem solid #8d8a8d;
  padding-top: .3rem;
  padding-bottom: .3rem;
  padding-left: .7rem;;
  margin: 0;
}
.h5{
  margin: 0;
  line-height: 2rem;
  font-weight: 400;
  color: #383638;
}
</style>
