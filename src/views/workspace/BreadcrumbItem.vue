<template>
  <template v-if="parentPage">
    <BreadcrumbItem :page="parentPage"/>
  </template>
  <li
    :class="{'breadcrumb-item': true, effect: page !== currentPage}"
    :type="page !== currentPage ? 'button' : '' "
    @click="goCurrentPage(page.id)">
    {{ page.name }}
  </li>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import commonUpdateEffect from '../commonUpdataEffect';

export default {
  name: 'BreadcrumbItem',
  props: ['page'],
  setup(props) {
    // console.log(props.page);
    const store = useStore();
    const parentPage = computed(() => store.getters.parentPage(props.page));
    const currentPage = computed(() => store.getters.currentPage);
    const { goCurrentPage } = commonUpdateEffect();

    return { parentPage, currentPage, goCurrentPage };
  },
};
</script>

<style lang="scss" scoped>
.breadcrumb-item{
  color: #6d6d6d;
}
.effect{
  &:hover{
    // background: #e0e0e0;
    color: #222222;
    text-decoration: underline;
  }
}
</style>
