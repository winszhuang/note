import { findInStoreById } from './commonStoreEffect';
import { generateRandomString } from '../../components/commonEffect';

export default {
  namespaced: true,
  state: {
    blocks: [],
    currentFocusBlockId: '',
    selectedBlocksIds: [],
    clipboardBlocks: [],
    hiddenBlocksIds: [],
    blockStyleEditor: {
      isShow: false,
    },
  },
  mutations: {
    // 處理blocks
    resetBlocks(state) {
      state.blocks = [];
      state.currentFocusBlockId = '';
      state.selectedBlocksIds = [];
      state.hiddenBlocksIds = [];
    },

    addBlock(state, block) {
      state.blocks.push(block);
    },

    deleteBlock(state, block) {
      const index = state.blocks.indexOf(block);
      state.blocks.splice(index, 1);
    },

    addIdToBlocksOfBlock(state, { block, blockId, index }) {
      if (index !== undefined) {
        block.blocks.splice(index, 0, blockId);
      } else {
        block.blocks.push(blockId);
      }
    },

    deleteIdToBlocksOfBlock(state, { block, blockId }) {
      const index = block.blocks.indexOf(blockId);
      block.blocks.splice(index, 1);
    },

    // changeGroupIdFromBlockId(state, { blockId, groupId }) {
    //   findInStoreById(state.blocks, blockId).group = groupId;
    // },

    // 處理currentFocusBlockId
    editBlockData(state, { id = state.currentFocusBlockId, value, key = 'content' }) {
      findInStoreById(state.blocks, id)[key] = value;
    },

    setFocusBlockById(state, id) {
      state.currentFocusBlockId = id;
    },

    // selectedBlocksIds
    setSelectedBlocksIds(state, arr = []) {
      state.selectedBlocksIds = arr;
    },

    addIdToSelectedBlocksIds(state, id) {
      if (state.selectedBlocksIds.includes(id)) return false;
      state.selectedBlocksIds.push(id);
      return true;
    },

    deleteIdFromSelectedBlocksIds(state, id) {
      if (state.selectedBlocksIds.includes(id)) {
        const index = state.selectedBlocksIds.indexOf(id);
        state.selectedBlocksIds.splice(index, 1);
        return true;
      }
      return false;
    },

    // 處理hiddenBlocksIds
    addIdsToHiddenBlocksIds(state, ids) {
      ids.forEach((id) => {
        if (!state.hiddenBlocksIds.includes(id)) {
          state.hiddenBlocksIds.push(id);
        }
      });
    },

    deleteIdsToHiddenBlocksIds(state, ids) {
      ids.forEach((id) => {
        if (state.hiddenBlocksIds.includes(id)) {
          const index = state.hiddenBlocksIds.indexOf(id);
          state.hiddenBlocksIds.splice(index, 1);
        }
      });
    },

    resetHiddenBlocksIds(state) {
      state.hiddenBlocksIds = [];
    },

    // 處理blockStyleEditor
    setStyleEditorShow(state, isTrueOrFalse) {
      state.blockStyleEditor = isTrueOrFalse;
    },

    setClipboardBlocks(state, blocks) {
      state.clipboardBlocks = [...blocks];
    },
  },
  getters: {
    // 回傳當前page裡面包含的所有blocks
    currentBlocks(state, getters, rootState, rootGetters) { // 這邊的問題 應該讓所有block(包含子block)單純放page裡面
      // eslint-disable-next-line max-len
      return rootGetters['pages/currentPage'].blocks.map((itemId) => findInStoreById(state.blocks, itemId));
    },
    // 回傳當前page裡面包含的所有blocks的id的陣列
    currentBlocksIds(state, getters, rootState, rootGetters) {
      return rootGetters['pages/currentPage'].blocks;
    },
    // 回傳帶入的某id所取得的block
    chooseBlock(state) {
      return (id) => findInStoreById(state.blocks, id);
    },
    // 回傳帶入的block的id所取得的所有子集blocks ; 帶入''回傳當前頁有的根blocks
    childrenCurrentBlocks(state, getters) {
      return (id) => getters.currentBlocks.filter((block) => block.parentId === id);
    },
    // 回傳當前page裡面被選中的block
    currentFocusBlock(state, getters) {
      return findInStoreById(getters.currentBlocks, state.currentFocusBlockId);
    },

    searchBlocks(state) {
      return (str) => (str !== '' ? state.blocks.filter((block) => block.content?.text?.includes(str)) : null);
    },

    isIdInHiddenBlocksIds(state) {
      return (id) => state.hiddenBlocksIds.includes(id);
    },

    getIndexByBlockId(state, getters) {
      return (id) => getters.currentBlocksIds.indexOf(id);
    },

    getPrevBlockByid(state, getters) {
      return (id) => {
        const index = getters.currentBlocksIds.indexOf(id);
        if (index === 0) return null;
        return getters.currentBlocks[index - 1];
      };
    },

    getNextBlockByid(state, getters) {
      return (id) => {
        const index = getters.currentBlocksIds.indexOf(id);
        if (index === getters.currentBlocksIds.length - 1) return null;
        return getters.currentBlocks[index + 1];
      };
    },

    selectedBlocks(state, getters) {
      const blocks = [];
      state.selectedBlocksIds.forEach((blockId) => {
        const block = findInStoreById(getters.currentBlocks, blockId);
        blocks.push(block);
      });
      return blocks;
    },

    isBlockSelected(state) {
      return (id) => state.selectedBlocksIds.includes(id);
    },

    allBlocksIds(state) {
      const allIds = [];
      state.blocks.forEach((block) => {
        allIds.push(block.id);
      });
      return allIds;
    },

    getClipboardBlocksIds(state) {
      return state.clipboardBlocks.map((block) => block.id);
    },
  },
  actions: {
    addBlock({ commit, rootState }, {
      page = findInStoreById(rootState.pages.pages, rootState.pages.currentPageId),
      block = {
        id: generateRandomString(),
        type: 'p',
        content: '',
        blocks: [],
        parentId: '',
        className: 'style-text-color__default',
      },
      index,
    }) {
      commit('addBlock', block);

      commit('pages/addIdToBlocksOfPage', {
        page,
        id: block.id,
        index: index || undefined,
      }, { root: true });
    },

    addBlockAndSetFocusBlockId({ commit, dispatch, rootState }, {
      page = findInStoreById(rootState.pages.pages, rootState.pages.currentPageId),
      block = {
        id: generateRandomString(),
        type: 'p',
        content: {
          text: '',
          html: '',
        },
        blocks: [],
        // group: '',
        parentId: '',
        className: 'style-text-color__default',
      },
      index,
    }) {
      dispatch('addBlock', { block, page, index });
      commit('blocks/setFocusBlockById', block.id, { root: true });
    },

    // pushBlockAndSetFocusBlockId({ commit, dispatch, rootState }, {
    //   page = findInStoreById(rootState.pages.pages, rootState.pages.currentPageId),
    //   block = {
    //     id: generateRandomString(),
    //     type: 'p',
    //     content: '',
    //     blocks: [],
    //     group: '',
    //     parentId: '',
    //   },
    // }) {
    //   dispatch('addBlockAndSetFocusBlockId', { block, page, index:  });
    // },

    // pushBlock({ commit }, {
    //   type = 'p',
    //   id = (new Date().getTime() + 3).toString(),
    //   value = '',
    //   blocks = [],
    //   parentId = '',
    //   group = '',
    // }) {
    //   const newBlock = {
    //     id,
    //     type,
    //     content: value,
    //     blocks,
    //     parentId,
    //     group,
    //   };
    //   commit('addBlock', newBlock);

    //   // 此段處理block的id被加入某page中的blocks陣列裡的某位置
    //   commit('pages/addIdToBlocksOfPage', {
    //     blockId: id,
    //   }, { root: true });

    //   commit('setFocusBlockById', id);
    // },

    // 增加子block
    // addBlockInside({ commit, dispatch }, block) {
    //   const parentBlock = block;

    //   const id = new Date().getTime().toString(); // 創一個新的blockId

    //   dispatch('addBlock', {
    //     type: 'p',
    //     id,
    //     parentId: parentBlock.id,
    //   });

    //   commit('addIdToBlocksOfBlock', {
    //     block: parentBlock,
    //     blockId: id,
    //   });
    // },

    // addGroupTypeBlock({ commit, dispatch }, { block, group }) {
    //   const newBlock = { ...block };
    //   if (newBlock.group !== group.id) {
    //     newBlock.group = group.id;
    //   }

    //   dispatch('addBlock', {
    //     block: newBlock,
    //   });

    //   commit('groups/addIdToGroup', {
    //     id: newBlock.id,
    //     group,
    //   }, { root: true });
    // },

    addPageTypeBlock({ commit, dispatch, rootState }, {
      block,
      page = rootState.pages.currentPageId,
    }) {
      const newBlock = { ...block };
      if (newBlock.content !== page.id) {
        newBlock.content = page.id;
      }

      dispatch('addBlock', {
        block: newBlock,
      });

      const newPage = {
        id: generateRandomString(),
        name: 'untitle',
        blocks: [],
        parentId: page.id,
        createdTime: new Date().getTime().toString(),
        editTime: new Date().getTime().toString(),
        tags: [],
        cover: '',
      };
      commit('pages/addPage', newPage, { root: true });
    },

    deleteBlock({ state, rootState, commit }, {
      containPage = findInStoreById(rootState.pages.pages, rootState.pages.currentPageId),
      block = findInStoreById(state.blocks, state.currentFocusBlockId),
    }) {
      // 刪除當前page的blocks裡面對應的id
      commit('pages/deleteIdToBlocksOfPage', {
        page: containPage,
        id: block.id,
      }, { root: true });

      commit('deleteBlock', block); // 徹底刪除此block
    },

    deleteSelectedBlocks({ state, dispatch }) {
      state.selectedBlocksIds.forEach((blockId) => {
        const block = findInStoreById(state.blocks, blockId);
        dispatch('deleteBlock', { block });
      });
    },

    editSelectedBlocksData({ state, commit }, { key, value }) {
      state.selectedBlocksIds.forEach((blockId) => {
        commit('editBlockData', { key, value, id: blockId });
      });
    },

    goBlockPosition({ commit }, { page, block }) {
      commit('pages/setCurrentPageId', page.id, { root: true });
      commit('setFocusBlockById', block.id);
    },

    // changeGroupIdFromBlocksIds({ commit }, { blocksIds, groupId }) {
    //   blocksIds.forEach((blockId) => {
    //     commit('changeGroupIdFromBlockId', {
    //       blockId,
    //       groupId,
    //     });
    //   });
    // },
  },
};
