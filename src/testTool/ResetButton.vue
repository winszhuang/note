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
  right: 5rem;
  bottom: 2rem;
  z-index: 30;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: .01px solid rgb(172, 172, 172);
  line-height: 100px;
  // background-color: #504952;
  text-align: center;
  font-size: 1.3rem;
  color: rgb(102, 102, 102);
  &:hover{
    background: #d8d8d8;
  }
}
</style>
