<template>
  <div class="all">
    <Sidebar/>
    <Workspace/>
  </div>
  <!-- <Modal v-if="isOpenModal"
        @close="openModal(false)"
        :mode="'component'"
        :is-bg-static="false">
    <template #component>
      <Search @close="openModal(false)"/>
    </template>
  </Modal> -->
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

<style lang="scss">
.all{
  display: flex;
}
</style>
