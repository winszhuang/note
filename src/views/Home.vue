<template>
  <div class="all">
    <Sidebar/>
    <Workspace/>

    <!--以下為測試工具-->
    <!-- <ResetButton/>
    <PrintPage/> -->
  </div>
</template>

<script>
import Sidebar from './sidebar/Sidebar.vue';
import Workspace from './workspace/Workspace.vue';

// 測試工具
// import ResetButton from '../testTool/ResetButton.vue';
// import PrintPage from '../testTool/PrintPage.vue';

export default {
  name: 'Home',
  components: {
    Sidebar,
    Workspace,

    // 測試工具
    // ResetButton,
    // PrintPage,
  },
};
</script>

<style lang="scss" scoped>
.all{
  display: flex;
}
</style>
