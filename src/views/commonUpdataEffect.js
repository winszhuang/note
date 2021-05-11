import { computed } from 'vue';
import { useStore } from 'vuex';
// import { computed } from 'vue';

const commonUpdateEffect = () => {
  const store = useStore();
  const currentFocusBlock = computed(() => store.getters.currentFocusBlock);

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
      console.log('111');
      store.dispatch('deleteBlock', {});
    }
    if (e.keyCode === 13) {
      const { parentId } = currentFocusBlock.value;
      if (parentId !== '') {
        const parentBlock = computed(() => store.getters.chooseBlock(parentId));
        store.dispatch('addBlockInside', parentBlock.value);
      } else {
        store.dispatch('addBlock', {
          typeName: 'p',
        });
      }
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
