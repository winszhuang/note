<template>
  <div class="ms-2 d-flex">
    <div class="number">{{ index + 1 }}. </div>
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
    const group = computed(() => store.getters.getGroupByBlock(props.block));
    const index = computed(() => store.getters.getIndexFromGroupByBlock(props.block));

    return { group, index };
  },
};
</script>

<style lang="scss">
.number{
  padding-left: .2rem;
  margin-right: .2rem;
  line-height: 1.9rem;
}
</style>
