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
