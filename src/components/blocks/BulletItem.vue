<template>
  <div class="ms-2 d-flex">
    <div class="bullet">⦁</div>
    <P :block="block"/>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import P from './P.vue';

export default {
  name: 'NumberItem',
  props: ['block'],
  component: {
    P,
  },
  setup(props) {
    const store = useStore();
    const index = computed(() => store.getters.getIndexFromGroupByBlock(props.block));

    return { index };
  },
};
</script>

<style lang="scss">
.bullet{
  padding-left: .2rem;
  margin-right: .2rem;
  line-height: 1.9rem;
}
</style>
