import { computed } from 'vue';
import { useStore } from 'vuex';
// import { computed } from 'vue';

const commonUpdateEffect = () => {
  const store = useStore();
  const currentFocusBlock = computed(() => store.getters['blocks/currentFocusBlock']);

  const editPageData = (property, value) => {
    // console.log(value);
    store.commit('pages/editPageData', {
      property,
      value,
    });
  };

  const editBlockData = (id, value, key) => {
    store.commit('blocks/editBlockData', {
      id,
      value,
      key,
    });
  };

  const getFocusBlock = (id) => {
    store.commit('blocks/changeFocusBlock', id);
  };

  const checkKeydownInPageData = (page, e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (page.blocks.length === 0) {
        store.dispatch('blocks/addBlock', {
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
      store.dispatch('blocks/deleteBlock', {});
    }

    if (e.keyCode === 13) {
      e.preventDefault();
      const { parentId, group, type } = currentFocusBlock.value;
      if (parentId !== '') {
        const parentBlock = computed(() => store.getters['blocks/chooseBlock'](parentId));
        store.dispatch('blocks/addBlockInside', parentBlock.value);
        return;
      }

      if (group !== '') {
        store.dispatch('blocks/addBlockInGroup', {
          type,
          groupId: group,
        });
        return;
      }

      if (type === 'todoItem') {
        store.dispatch('blocks/addBlock', {
          type: 'todoItem',
        });
        return;
      }

      store.dispatch('blocks/addBlock', {
        type: 'p',
      });
    }
  };

  const goCurrentPage = (id) => {
    store.commit('pages/setCurrentPageId', id);
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
