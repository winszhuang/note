import { computed } from 'vue';
import { useStore } from 'vuex';
import commonBlockEffect from '../components/commonBlockEffect';

const commonUpdateEffect = () => {
  const store = useStore();
  const currentPage = computed(() => store.getters['pages/currentPage']);
  const currentFocusBlock = computed(() => store.getters['blocks/currentFocusBlock']);
  const currentBlocksIds = computed(() => store.getters['blocks/currentBlocksIds']);
  const currentFocusBlockId = computed(() => store.state.blocks.currentFocusBlockId);
  const focusBlockIndex = computed(() => store.getters['blocks/getIndexByBlockId'](currentFocusBlock.value.id));
  const selectedBlocks = computed(() => store.getters['blocks/selectedBlocks']);
  const selectedBlocksIds = computed(() => store.state.blocks.selectedBlocksIds);
  const clipboardBlocks = computed(() => store.state.blocks.clipboardBlocks);
  // const clipboardBlocksIds = computed(() => store.getters['blocks/getClipboardBlocksIds']);
  const { Block, getCopyBlockWithNewId, getCopyBlocksWithNewId } = commonBlockEffect();

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

  const setClipboardBlocks = (blocks) => {
    store.commit('blocks/setClipboardBlocks', blocks);
  };

  const setSelectedBlocksInClipboardBlocks = () => {
    store.commit('blocks/setClipboardBlocks', getCopyBlocksWithNewId(selectedBlocks.value));
  };

  const checkKeydownInPageData = (page, e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
    const deleteBlocksDepend = () => {
      if (!block.blocks) return;
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

    const deletePageDepend = () => {
      const page = computed(() => store.getters['pages/choosePage'](block.content));
      store.dispatch('pages/deletePage', page.value);
    };

    if (block.type === 'page') {
      deletePageDepend();
      return;
    }

    deleteBlocksDepend();
    deleteParentDepend();

    const lastBlock = computed(() => store.getters['blocks/getPrevBlockByid'](block.id));
    store.commit('blocks/setFocusBlockById', lastBlock.value?.id);
    store.dispatch('blocks/deleteBlock', { block });
  };

  const deleteInput = (e, block) => {
    // console.log(e);
    if (e.target.innerText === '' && e.keyCode === 8) {
      deleteBlockAndDependByPressBackspace(block);
    }
  };

  const checkBlockThenAddByPressEnter = (currentBlock) => {
    const hasParentIdAction = (newBlock) => {
      if (currentBlock.parentId === '') return;
      store.commit('blocks/editBlockData', {
        id: newBlock.id,
        value: currentBlock.parentId,
        key: 'parentId',
      });
    };

    const addBlockFlow = (block) => {
      store.dispatch('blocks/addBlockAndSetFocusBlockId', { block, index: focusBlockIndex.value + 1 });
    };

    const addBlockByType = (type) => {
      const block = new Block(type).addContent({ text: '', html: '' });
      addBlockFlow(block);
      return block;
    };

    const enterActions = {
      h1: () => addBlockByType('p'),
      h2: () => addBlockByType('p'),
      h3: () => addBlockByType('p'),
      p: () => addBlockByType('p'),
      quote: () => addBlockByType('p'),

      numberItem: () => addBlockByType('numberItem'),
      bulletItem: () => addBlockByType('bulletItem'),

      todoItem: () => addBlockByType('todoItem'),

      toggleList: () => addBlockByType('toggleList'),
    };

    const newBlock = enterActions[currentBlock.type]();

    hasParentIdAction(newBlock);
  };

  const duplicateBlock = (block) => {
    const newBlock = getCopyBlockWithNewId(block);
    store.commit('blocks/addBlock', newBlock);

    store.commit('pages/addIdToBlocksOfPage', {
      id: newBlock.id,
      index: focusBlockIndex.value + 1,
    });

    store.commit('blocks/setSelectedBlocksIds', [newBlock.id]);
    store.commit('blocks/setFocusBlockById', '');
  };

  const checkKeydownInBlockContent = (block, e) => {
    if (currentFocusBlockId.value !== block.id) return;

    if (currentFocusBlock.value.content.text === '' && e.key === 'Backspace') {
      e.preventDefault();
      deleteBlockAndDependByPressBackspace(block);
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      checkBlockThenAddByPressEnter(block);
    }

    if (e.key === 'c' && e.ctrlKey) {
      setClipboardBlocks([]);
    }

    if (e.key === 'd' && e.ctrlKey) {
      e.preventDefault();
      duplicateBlock(block);
      document.activeElement.blur();
    }
  };

  const goCurrentPage = (id) => {
    // console.log(id);
    store.commit('pages/setCurrentPageId', id);
  };

  const setNewBlocksIdsInPage = (ids) => {
    store.commit('pages/editPageData', {
      key: 'blocks',
      value: ids,
    });
  };

  const addMultiBlock = (addedBlocks, spliceFunctionArr) => {
    const addedBlocksIds = [];
    addedBlocks.forEach((block) => {
      store.commit('blocks/addBlock', block);
      addedBlocksIds.push(block.id);
    });

    const newBlocksIds = [...currentBlocksIds.value];
    Array.prototype.splice.apply(newBlocksIds, spliceFunctionArr(addedBlocksIds));

    setNewBlocksIdsInPage(newBlocksIds);
  };

  const duplicateBlocksFromSelectedBlocks = () => {
    const newBlocks = getCopyBlocksWithNewId(selectedBlocks.value);
    addMultiBlock(newBlocks,
      (addedBlocksIds) => {
        const lastBlockId = selectedBlocksIds.value[selectedBlocksIds.value.length - 1];
        const index = computed(() => store.getters['blocks/getIndexByBlockId'](lastBlockId));
        return [index.value + 1, 0, ...addedBlocksIds];
      });

    const newBlocksIds = newBlocks.map((block) => block.id);
    store.commit('blocks/setSelectedBlocksIds', newBlocksIds);
  };

  const pasteBlocksAction = async (e) => {
    const getClipboardText = async () => new Promise((resolve) => {
      navigator.clipboard.readText('text')
        .then((text) => {
          resolve(text);
        });
    });

    const clipboardText = await getClipboardText();
    if (clipboardText !== '') {
      setClipboardBlocks([]);
      return;
    }

    if (!clipboardBlocks.value) return;
    if (!clipboardBlocks.value.length) return;

    e.preventDefault();

    const newBlocks = getCopyBlocksWithNewId(clipboardBlocks.value);
    if (currentFocusBlock.value) {
      addMultiBlock(newBlocks,
        (addedBlocksIds) => [focusBlockIndex.value + 1, 0, ...addedBlocksIds]);
    } else {
      console.log('11111111111111111');
      addMultiBlock(newBlocks,
        (addedBlocksIds) => {
          if (selectedBlocksIds.value.length < 1) {
            return [-1, 0, ...addedBlocksIds];
          }
          const lastBlockId = selectedBlocksIds.value[selectedBlocksIds.value.length - 1];
          const index = computed(() => store.getters['blocks/getIndexByBlockId'](lastBlockId));
          return [index.value + 1, 0, ...addedBlocksIds];
        });
    }

    const newBlocksIds = newBlocks.map((block) => block.id);
    store.commit('blocks/setSelectedBlocksIds', newBlocksIds);

    // document.activeElement.blur();
  };

  const deleteSelectedBlocks = () => {
    selectedBlocksIds.value.forEach((blockId) => {
      const block = computed(() => store.getters['blocks/chooseBlock'](blockId));
      deleteBlockAndDependByPressBackspace(block.value);
    });
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
    setClipboardBlocks,
    setSelectedBlocksInClipboardBlocks,
    pasteBlocksAction,
    deleteSelectedBlocks,
    duplicateBlock,
    duplicateBlocksFromSelectedBlocks,
  };
};

export default commonUpdateEffect;
