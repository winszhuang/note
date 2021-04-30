import { useStore } from 'vuex';

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
      store.commit('addBlock', 'p');
    }
    // if (block.id === store.state.currentFocusBlockId) {
    // }
  };
  const getFocusBlock = (id) => {
    store.commit('changeFocusBlock', id);
  };
  return {
    editBlockData,
    editPageData,
    keydownHandle,
    getFocusBlock,
  };
};

export default commonUpdateEffect;
