import { watch } from 'vue';
import { useStore } from 'vuex';

const realtimeUpdateToFs = () => {
  const store = useStore();

  const watchState = (collection) => {
    watch(
      () => collection.value,
      (curr) => {
        console.log(curr);
        store.dispatch('updatePagesToFs', curr);
        // store.dispatch('test');
      },
      { deep: true },
    );
  };

  return { watchState };
};

export default realtimeUpdateToFs;
