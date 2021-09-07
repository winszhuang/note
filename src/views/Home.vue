<template>
  <div class="all">
    <Sidebar/>
    <Workspace/>
  </div>
</template>

<script>
import Sidebar from './sidebar/Sidebar.vue';
import Workspace from './workspace/Workspace.vue';

export default {
  name: 'Home',
  components: {
    Sidebar,
    Workspace,
  },
};
</script>

<style lang="scss" scoped>
.all{
  display: flex;
}
</style>
