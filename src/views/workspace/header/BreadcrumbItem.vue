<template>
  <template v-if="parentPage">
    <BreadcrumbItem :page="parentPage" :number="number + 1" v-if="number < 2"/>
  </template>
  <li
    :class="{'breadcrumb-item': true, effect: page !== currentPage}"
    :type="page !== currentPage ? 'button' : '' "
    @click="goCurrentPage(page.id)"><font-awesome-icon :icon="['far', 'file']"/>&nbsp;
    {{ page.name }}
  </li>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import commonUpdateEffect from '../../commonUpdataEffect';

export default {
  name: 'BreadcrumbItem',
  props: {
    page: {
      type: Object,
    },
    number: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const store = useStore();
    const parentPage = computed(() => store.getters['pages/parentPage'](props.page));
    const currentPage = computed(() => store.getters['pages/currentPage']);
    const { goCurrentPage } = commonUpdateEffect();

    return { parentPage, currentPage, goCurrentPage };
  },
};
</script>

<style lang="scss" scoped>
.breadcrumb-item{
  color: #a0a0a0;
  font-weight: 700;
}
.effect{
  &:hover{
    color: #222222;
    text-decoration: underline;
  }
}
</style>
