<template>
  <div class="all">
    <Sidebar/>
    <Workspace/>
    <ResetButton/>
  </div>
</template>

<script>
import ResetButton from '../testTool/ResetButton.vue';
import Sidebar from './sidebar/Sidebar.vue';
import Workspace from './workspace/Workspace.vue';

export default {
  name: 'Home',
  components: {
    Sidebar,
    Workspace,
    ResetButton,
  },
  setup() {

  },
};
</script>

<style lang="scss" scoped>
.all{
  display: flex;
}
</style>
