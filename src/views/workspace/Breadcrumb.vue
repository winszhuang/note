<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <BreadcrumbItem :page="page"/>
    </ol>
  </nav>
</template>

<script>
import BreadcrumbItem from './BreadcrumbItem.vue';

export default {
  name: 'Breadcrumb',
  props: ['page'],
  components: { BreadcrumbItem },
};
</script>

<style lang="scss" scoped>
ol{
  height: 100%;
  margin-bottom: 0;
}
</style>
