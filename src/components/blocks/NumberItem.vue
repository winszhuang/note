<template>
  <div class="d-flex">
    <div class="prefix">{{ index + 1 }}. </div>
    <P :block="block" :data-group-id="group.id"/>
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
    const group = computed(() => store.getters['groups/getGroupByBlock'](props.block));
    const index = computed(() => store.getters['groups/getIndexFromGroupByBlock'](props.block));

    return { group, index };
  },
};
</script>

<style lang="scss" scoped>
</style>
