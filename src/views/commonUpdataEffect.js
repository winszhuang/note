import { computed, nextTick } from 'vue';
import { useStore } from 'vuex';
import commonBlockEffect from '../components/commonBlockEffect';
import { stringMixer, generateRandomString } from '../components/commonEffect';

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
  const {
    BlockFactory,
    getCopyBlockWithNewId,
    getCopyBlocksWithNewId,
    getTypeByHotKey,
  } = commonBlockEffect();

  const editPageData = (key, value) => {
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

    const enterActions = {
      h1: () => new BlockFactory('p'),
      h2: () => new BlockFactory('p'),
      h3: () => new BlockFactory('p'),
      p: () => new BlockFactory('p'),
      quote: () => new BlockFactory('p'),

      numberItem: () => new BlockFactory('numberItem'),
      bulletItem: () => new BlockFactory('bulletItem'),

      todoItem: () => new BlockFactory('todoItem'),

      // toggleList: () => addBlockByType('toggleList'),
    };

    const newBlock = enterActions[currentBlock.type]();
    store.dispatch('blocks/addBlockAndSetFocusBlockId', {
      block: newBlock,
      index: focusBlockIndex.value + 1,
    });

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

  const duplicatePage = (copyPage, randomStr, level = 0) => {
    const addCopyPage = () => {
      const newPage = JSON.parse(JSON.stringify(copyPage));

      newPage.id = randomStr(newPage.id);
      newPage.createdTime = new Date().getTime().toString();
      newPage.editTime = new Date().getTime().toString();
      newPage.blocks = newPage.blocks.map((blockId) => randomStr(blockId));
      newPage.parentId = level === 0 ? newPage.parentId : randomStr(newPage.parentId);

      store.commit('pages/addPage', newPage);
    };

    addCopyPage();

    copyPage.blocks.forEach((blockId) => {
      const oldBlock = computed(() => store.getters['blocks/chooseBlock'](blockId)).value;
      const newBlock = JSON.parse(JSON.stringify(oldBlock));
      newBlock.id = randomStr(newBlock.id);

      if (oldBlock.type === 'page') {
        newBlock.content = randomStr(newBlock.content);

        const innerPageId = oldBlock.content;
        const innerPage = computed(() => store.getters['pages/choosePage'](innerPageId));
        duplicatePage(innerPage.value, randomStr, level + 1);
      }

      store.commit('blocks/addBlock', newBlock);
    });
  };

  const replaceBlock = (block, type) => {
    const newBlock = new BlockFactory(type);

    if (type === 'page') {
      const innerPageId = generateRandomString();

      store.commit('pages/addPage', {
        id: innerPageId,
        name: 'untitle',
        blocks: [],
        parentId: currentPage.value.id,
        createdTime: new Date().getTime().toString(),
        editTime: new Date().getTime().toString(),
        tags: [],
        cover: '',
      });

      newBlock.content = innerPageId;
    }

    store.commit('blocks/addBlock', newBlock);

    const blockIdsOfPage = [...currentPage.value.blocks];
    const index = blockIdsOfPage.indexOf(block.id);
    blockIdsOfPage[index] = newBlock.id;
    store.commit('pages/editPageData', {
      key: 'blocks',
      value: blockIdsOfPage,
    });

    store.commit('blocks/deleteBlock', block);

    nextTick(() => {
      const el = document.querySelector(`[data-block-id="${newBlock.id}"]`);
      if (el && el.querySelector('[contenteditable]')) {
        el.querySelector('[contenteditable]').focus();
      }
    });
  };

  const checkKeydownInBlockContent = (block, e) => {
    if (currentFocusBlockId.value !== block.id) return;

    if (currentFocusBlock.value.content.text === '' && e.key === 'Backspace') {
      e.preventDefault();
      deleteBlockAndDependByPressBackspace(block);
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      const type = getTypeByHotKey((key) => key === e.target.innerText.slice(1));
      if (type) {
        replaceBlock(block, type);
        return;
      }

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

  const genratePageAndInnerByCopyingBlock = (block) => {
    const pageId = block.content;
    const page = computed(() => store.getters['pages/choosePage'](pageId));

    const randomStr = stringMixer();
    store.commit('blocks/editBlockData', {
      id: block.id,
      value: `${randomStr(page.value.id)}`,
      key: 'content',
    });

    duplicatePage(page.value, randomStr);
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

    // 處理block類型是page的情況
    const pageTypeBlocks = newBlocks.filter((block) => block.type === 'page');
    if (pageTypeBlocks.length) {
      pageTypeBlocks.forEach((block) => {
        genratePageAndInnerByCopyingBlock(block);
      });
    }
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

    // 處理block類型是page的情況
    const pageTypeBlocks = newBlocks.filter((block) => block.type === 'page');
    if (pageTypeBlocks.length) {
      pageTypeBlocks.forEach((block) => {
        genratePageAndInnerByCopyingBlock(block);
      });
    }
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
