import { computed } from 'vue';
import { useStore } from 'vuex';
import commonBlockEffect from '../components/commonBlockEffect';
// import { computed } from 'vue';

const commonUpdateEffect = () => {
  const store = useStore();
  const currentPage = computed(() => store.getters['pages/currentPage']);
  const currentFocusBlockId = computed(() => store.state.blocks.currentFocusBlockId);
  const { generateBlock } = commonBlockEffect();

  const editPageData = (key, value) => {
    // console.log(value);
    store.commit('pages/editPageData', {
      key,
      value,
    });
  };

  const editBlockData = (id, value, key) => {
    if (currentPage.value === '') {
      console.log('請先選擇頁面');
      return;
    }
    store.commit('blocks/editBlockData', {
      id,
      value,
      key,
    });
  };

  const setFocusBlock = (id = '') => {
    store.commit('blocks/setFocusBlockById', id);
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
      setFocusBlock(page.blocks[0]);
    }
  };

  const deleteBlockAndDependByPressBackspace = (block) => {
    console.log(block.id);
    const deleteGroupDepend = () => {
      if (block.group === '') return;
      store.commit('groups/deleteIdToGroup', {
        groupId: block.group,
        id: block.id,
      });
    };

    const deleteBlocksDepend = () => {
      if (block.blocks.length === 0) return;
      const childrenCurrentBlocks = computed(() => store.getters['blocks/childrenCurrentBlocks'](block.id));
      childrenCurrentBlocks.value.forEach((childBlock) => {
        store.commit('blocks/editBlockData', {
          id: childBlock.id,
          key: 'parentId',
          value: '',
        });
      });
    };

    const deleteParentDepend = () => {
      if (block.parentId === '') return;
      const parentBlock = computed(() => store.getters['blocks/chooseBlock'](block.parentId));
      store.commit('blocks/deleteIdToBlocksOfBlock', {
        block: parentBlock.value,
        blockId: block.id,
      });
    };

    deleteGroupDepend();
    deleteBlocksDepend();
    deleteParentDepend();

    const lastBlock = computed(() => store.getters['blocks/getLastBlockByid'](block.id));
    store.commit('blocks/setFocusBlockById', lastBlock.value?.id);
    store.dispatch('blocks/deleteBlock', { block });
  };

  const deleteInput = (e, block) => {
    if (e.target.value === '' && e.keyCode === 8) {
      deleteBlockAndDependByPressBackspace(block);
    }
  };

  const checkBlockThenAddByPressEnter = (currentBlock) => {
    const isTypeSpecial = (type, callback) => {
      const specialType = [
        'toggleList',
        'todoItem',
        'numberItem',
        'bulletItem',
      ];
      if (specialType.find((item) => item === type)) {
        callback();
      }
    };

    const isParentIdDependThen = (callback) => {
      if (currentBlock.parentId !== '') {
        callback();
      }
    };

    const isGroupDependThen = (callback) => {
      if (currentBlock.group !== '') {
        callback();
      }
    };

    const addNewBlockIdToParentBlock = (parentBlock, newBlock) => {
      const currentBlockIndex = computed(() => store.getters['blocks/getIndexFromCurrentBlocksByBlock'](currentBlock));
      store.commit('blocks/addIdToBlocksOfBlock', {
        block: parentBlock,
        blockId: newBlock.id,
        index: currentBlockIndex.value + 1,
      });
    };

    const addNewBlockIdToGroup = (newBlock) => {
      store.commit('groups/addIdToGroup', {
        id: newBlock.id,
        groupId: currentBlock.group,
      });
    };

    const addBlockFlow = (type) => {
      const newBlock = generateBlock({ type: 'p' });
      isTypeSpecial(type, () => { newBlock.type = type; });
      isGroupDependThen(() => {
        newBlock.group = currentBlock.group;
        addNewBlockIdToGroup(newBlock);
      });
      isParentIdDependThen(() => {
        const parentBlock = computed(() => store.getters['blocks/chooseBlock'](currentBlock.parentId));
        newBlock.parentId = parentBlock.value.id;
        addNewBlockIdToParentBlock(parentBlock.value, newBlock);
      });
      const index = currentPage.value.blocks.indexOf(currentBlock.id);
      // console.log(index);
      store.dispatch('blocks/addBlock', { block: newBlock, index: index + 1 });
      store.commit('blocks/setFocusBlockById', newBlock.id);
    };

    addBlockFlow(currentBlock.type);
  };

  const checkKeydownInBlockContent = (block, e) => {
    if (currentFocusBlockId.value !== block.id) return;
    if (block.content === '' && e.keyCode === 8) {
      e.preventDefault();
      deleteBlockAndDependByPressBackspace(block);
    }

    if (e.keyCode === 13) {
      e.preventDefault();
      checkBlockThenAddByPressEnter(block);
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
    deleteBlockAndDependByPressBackspace,
    deleteInput,
    setFocusBlock,
    goCurrentPage,
  };
};

export default commonUpdateEffect;
