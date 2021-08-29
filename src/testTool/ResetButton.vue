<template>
  <div class="reset-button" type="button" @click="resetData">Reset</div>
</template>

<script>
import { useStore } from 'vuex';

export default {
  name: 'ResetButton',
  setup() {
    const store = useStore();

    const resetData = () => {
      store.dispatch('resetStoreData');
    };

    return {
      resetData,
    };
  },
};
</script>

<style lang="scss" scoped>
.reset-button{
  position: fixed;
  right: 2rem;
  bottom: 1rem;
  z-index: 30;
  width: 50px;
  height: 50px;
  border-radius: .2rem;
  border: .01px solid rgb(194, 194, 194);
  line-height: 50px;
  text-align: center;
  font-size: 1rem;
  color: rgb(102, 102, 102);
  &:hover{
    background: #d8d8d8;
  }
}
</style>
