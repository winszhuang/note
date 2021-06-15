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

  const getFocusBlock = (id) => {
    store.commit('changeFocusBlock', id);
  };

  const checkKeydownInPageData = (page, e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (page.blocks.length === 0) {
        store.dispatch('addBlock', {
          type: 'p',
        });
        return;
      }
      getFocusBlock(page.blocks[0]);
    }
  };

  const checkKeydownInBlockContent = (block, e) => {
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

  const goCurrentPage = (id) => {
    store.dispatch('changeCurrentPage', id);
  };

  return {
    editBlockData,
    editPageData,
    checkKeydownInBlockContent,
    checkKeydownInPageData,
    getFocusBlock,
    goCurrentPage,
  };
};

export default commonUpdateEffect;
