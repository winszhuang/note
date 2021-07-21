<template>
  <div class="d-flex">
    <div class="prefix">
      <div class="bullet">⦁</div>
    </div>
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
    const index = computed(() => store.getters['groups/getIndexFromGroupByBlock'](props.block));

    return { index };
  },
};
</script>

<style lang="scss" scoped>
.bullet{
  padding-left: .1rem;
}
</style>
