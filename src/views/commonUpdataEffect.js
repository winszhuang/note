import { computed } from 'vue';
import { useStore } from 'vuex';
// import { computed } from 'vue';

const commonUpdateEffect = () => {
  const store = useStore();
  const currentFocusBlock = computed(() => store.getters.currentFocusBlock);

  const editPageData = (property, value) => {
    console.log(value);
    store.commit('editPageData', {
      property,
      value,
    });
  };
  const editBlockData = (id, value, key) => {
    store.commit('editBlockData', {
      id,
      value,
      key,
    });
  };
  const keydownHandle = (block, e) => {
    if (block.content === '' && e.keyCode === 8) {
      e.preventDefault();
      store.dispatch('deleteBlock', {});
    }

    if (e.keyCode === 13) {
      e.preventDefault();
      const { parentId, group, type } = currentFocusBlock.value;
      if (parentId !== '') {
        const parentBlock = computed(() => store.getters.chooseBlock(parentId));
        store.dispatch('addBlockInside', parentBlock.value);
        return;
      }

      if (group !== '') {
        store.dispatch('addBlockInGroup', {
          type,
          groupId: group,
        });
        return;
      }

      if (type === 'todoItem') {
        store.dispatch('addBlock', {
          type: 'todoItem',
        });
        return;
      }

      store.dispatch('addBlock', {
        type: 'p',
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
