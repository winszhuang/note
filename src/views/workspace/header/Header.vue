<template>
  <div class="header">
    <Breadcrumb :page="currentPage"/>
    <div class="update" type="button" @click="updateToFS">
      <div class="update-icon" v-if="!isFSUpdating">
        <font-awesome-icon :icon="['fas', 'database']"/>
      </div>
      <div class="update-icon" v-else>
        <font-awesome-icon :icon="['fas', 'sync-alt']"/>
      </div>
      <div class="update-text">更新到數據庫</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Breadcrumb from './Breadcrumb.vue';
import { updateStoreToFS } from '../../../store/firestore';

export default {
  name: 'Header',
  components: {
    Breadcrumb,
  },
  props: ['currentPage'],
  setup() {
    const isFSUpdating = ref(false);
    const isFSUpdatingHandle = (choose) => {
      isFSUpdating.value = choose;
    };

    const updateToFS = async () => {
      isFSUpdatingHandle(true);
      try {
        await updateStoreToFS();
        isFSUpdatingHandle(false);
      } catch (error) {
        console.log(error);
        isFSUpdatingHandle(false);
      }
    };

    return {
      isFSUpdating,
      updateToFS,
    };
  },
};
</script>

<style lang="scss" scoped>
.header{
  box-sizing: border-box;
  position: sticky;
  width: 100%;
  top: 0;
  display: flex;
  padding: 1.5rem .5rem 1.5rem 2rem;
  margin-bottom: 5rem;
  z-index: 7;
  background-color: rgb(253, 252, 251);
}

.update{
  top: 0;
  border-radius: .3rem;
  color: #646464;
  padding: 0 .3rem;
  margin-left: auto;
  margin-right: 1rem;
  display: flex;
  &:hover{
    background: #dbdbdb;
  }
  &-text{
    margin-left: .5rem;
  }
}
</style>
