import { useStore } from 'vuex';
import { computed } from 'vue';

const commonUpdateEffect = () => {
  const store = useStore();
  const editPageData = (property, value) => {
    store.commit('editPageData', {
      property,
      value,
    });
  };
  const editBlockData = (id, value) => {
    store.commit('editBlockData', {
      id,
      value,
    });
  };
  const keydownHandle = (block, e) => {
    if (block.content === '' && e.keyCode === 8) {
      store.commit('deleteBlock');
    }
    if (e.keyCode === 13) {
      const currentPage = computed(() => store.getters.currentPage);
      store.commit('addBlock', {
        typeName: 'p',
        page: currentPage.value,
      });
    }
  };
  const getFocusBlock = (id) => {
    store.commit('changeFocusBlock', id);
  };
  const goCurrentPage = (id) => {
    store.commit('changeCurrentPage', id);
  };
  return {
    editBlockData,
    editPageData,
    keydownHandle,
    getFocusBlock,
    goCurrentPage,
  };
};

export default commonUpdateEffect;
