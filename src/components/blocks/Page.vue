<template>
  <div class="customlist-group-item pageblock"
      type="button"
      :data-pageid="block.content"
      :id=block.id
      @click="goCurrentPage(targetPage.id)"
  >
    <div class="customlist-item" :data-pageid="block.content">
      <font-awesome-icon :icon="['far', 'file']"/>
    </div>
    <div class="customlist-item" :data-pageid="block.content">
      {{ targetPage.name }}
    </div>
  </div>
</template>

<script>
// import { onMounted } from 'vue';
import { computed, toRefs } from 'vue';
import { useStore } from 'vuex';
import commonUpdateEffect from '../../views/commonUpdataEffect';
// import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'P',
  props: ['block'],
  setup(props) {
    const { goCurrentPage } = commonUpdateEffect();
    const { block } = toRefs(props);

    const store = useStore();
    const targetPage = computed(() => store.getters.choosePage(block.value.content));
    return {
      targetPage, goCurrentPage,
    };
  },
};
</script>

<style lang="scss" scoped>
input{
  display: block;
}
</style>
