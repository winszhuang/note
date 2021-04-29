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
  const deleteBlock = () => {
    store.commit('deleteBlock');
  };
  const keydownHandle = (block, e) => {
    if (block.content === '' && e.keyCode === 8) {
      store.commit('deleteBlock', block);
    }
    if (e.keyCode === 13) {
      store.commit('addP');
    }
  };
  const getFocusBlock = (id) => {
    store.commit('changeFocusBlock', id);
  };
  return {
    editBlockData,
    editPageData,
    deleteBlock,
    keydownHandle,
    getFocusBlock,
  };
};

export default commonUpdateEffect;
