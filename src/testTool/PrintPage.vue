<template>
  <div class="print-page" type="button" @click="printData">Print</div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'PrintPage',
  setup() {
    const store = useStore();

    const currentPage = computed(() => store.getters['pages/currentPage']);
    const currentBlocks = computed(() => store.getters['blocks/currentBlocks']);

    const printData = () => {
      const pageData = {
        page: { ...currentPage.value },
        blocks: [...currentBlocks.value],
      };

      const text = JSON.stringify(pageData);

      console.log(text);
    };

    return {
      printData,
    };
  },
};
</script>

<style lang="scss" scoped>
.print-page{
  position: fixed;
  right: 2rem;
  bottom: 5rem;
  z-index: 30;
  width: 50px;
  height: 50px;
  border-radius: .2rem;
  border: .01px solid rgb(194, 194, 194);
  line-height: 50px;
  text-align: center;
  font-size: 1rem;
  color: rgb(102, 102, 102);
  &:hover{
    background: #d8d8d8;
  }
}
</style>
