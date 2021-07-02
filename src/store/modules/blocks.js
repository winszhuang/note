import { findInStoreById } from './commonStoreEffect';

export default {
  namespaced: true,
  state: {
    blocks: [],
    currentFocusBlockId: '',
    currentBlocksByAreaSelect: [],
    hiddenBlocksIds: [],
  },
  mutations: {
    // 處理blocks
    resetBlocks(state) {
      state.blocks = [];
      state.currentFocusBlockId = '';
      state.currentBlocksByAreaSelect = [];
      state.hiddenBlocksIds = [];
    },

    addBlock(state, item) {
      state.blocks.push(item);
    },

    deleteBlock(state, item) {
      const index = state.blocks.indexOf(item);
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

    changeGroupIdFromBlockId(state, { blockId, groupId }) {
      findInStoreById(state.blocks, blockId).group = groupId;
    },

    // 處理currentFocusBlockId
    editBlockData(state, { id = state.currentFocusBlockId, value, key = 'content' }) {
      if (state.currentPageId === '') return;
      findInStoreById(state.blocks, id)[key] = value;
    },

    setFocusBlockById(state, id) {
      state.currentFocusBlockId = id;
    },

    // 處理currentBlocksByAreaSelect
    changeBlocksByAreaSelect(state, { arr }) {
      state.currentBlocksByAreaSelect = arr;
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
      return (str) => (str !== '' ? state.blocks.filter((block) => block.content.includes(str)) : null);
    },

    isIdInHiddenBlocksIds(state) {
      return (id) => state.hiddenBlocksIds.includes(id);
    },

    allBlocksIds(state) {
      const allIds = [];
      state.blocks.forEach((block) => {
        allIds.push(block.id);
      });
      return allIds;
    },
  },
  actions: {
    addBlock({
      state, commit, rootState,
    }, {
      page = findInStoreById(rootState.pages.pages, rootState.pages.currentPageId),
      type = 'p',
      id = (new Date().getTime() + 3).toString(),
      value = '',
      blocks = [],
      parentId = '',
      group = '',
    }) {
      const newBlock = {
        id,
        type,
        content: value,
        blocks,
        parentId,
        group,
      };
      commit('addBlock', newBlock);

      // 此段處理block的id被加入某page中的blocks陣列裡的某位置
      const isSelect = state.currentFocusBlockId !== '';
      if (isSelect) {
        const index = page.blocks.indexOf(state.currentFocusBlockId);
        commit('pages/addIdToBlocksOfPage', {
          page,
          blockId: id,
          index: index + 1,
        }, { root: true });
      } else {
        commit('pages/addIdToBlocksOfPage', {
          page,
          blockId: id,
        }, { root: true });
      }

      // const lastBlock = findInStoreById(rootState.blocks.blocks, state.currentFocusBlockId);
      // if (lastBlock.content === '') {
      //   dispatch('deleteBlock', { block: lastBlock });
      // }

      commit('setFocusBlockById', id);
    },

    pushBlock({ commit }, {
      type = 'p',
      id = (new Date().getTime() + 3).toString(),
      value = '',
      blocks = [],
      parentId = '',
      group = '',
    }) {
      const newBlock = {
        id,
        type,
        content: value,
        blocks,
        parentId,
        group,
      };
      commit('addBlock', newBlock);

      // 此段處理block的id被加入某page中的blocks陣列裡的某位置
      commit('pages/addIdToBlocksOfPage', {
        blockId: id,
      }, { root: true });

      commit('setFocusBlockById', id);
    },

    // 增加子block
    addBlockInside({ commit, dispatch }, block) {
      const parentBlock = block;

      const id = new Date().getTime().toString(); // 創一個新的blockId

      dispatch('addBlock', {
        type: 'p',
        id,
        parentId: parentBlock.id,
      });

      commit('addIdToBlocksOfBlock', {
        block: parentBlock,
        blockId: id,
      });
    },

    addBlockInGroup({ commit, dispatch }, { type, groupId }) {
      const blockId = (new Date().getTime() + 3).toString();
      const newGroupId = groupId || (new Date().getTime() + 5).toString();

      dispatch('addBlock', {
        type,
        id: blockId,
        group: newGroupId,
      });

      commit('groups/addIdToGroup', {
        groupId: newGroupId,
        id: blockId,
      }, { root: true });
    },

    deleteBlock({ state, rootState, commit }, {
      containPage = findInStoreById(rootState.pages.pages, rootState.pages.currentPageId),
      block = findInStoreById(state.blocks, state.currentFocusBlockId),
    }) {
      // 如果刪除的block是包在某父集block裡面的情況，就刪除父集block屬性blocks中的對應ID
      if (block.parentId !== '') {
        const parentBlock = findInStoreById(state.blocks, block.parentId);
        commit('deleteIdToBlocksOfBlock', {
          block: parentBlock,
          blockId: block.id,
        });
      }

      if (block.group !== '') { // 如果此block有包含在某個group，就把group中此id刪除
        commit('groups/deleteIdToGroup', {
          groupId: block.group,
          id: block.id,
        }, { root: true });
      }

      // 刪除當前page的blocks裡面對應的id
      commit('pages/deleteIdToBlocksOfPage', {
        page: containPage,
        blockId: block.id,
      }, { root: true });

      commit('deleteBlock', block); // 徹底刪除此block
    },

    goBlockPosition({ commit }, { page, block }) {
      commit('pages/setCurrentPageId', page.id, { root: true });
      commit('setFocusBlockById', block.id);
    },

    changeGroupIdFromBlocksIds({ commit }, { blocksIds, groupId }) {
      blocksIds.forEach((blockId) => {
        commit('changeGroupIdFromBlockId', {
          blockId,
          groupId,
        });
      });
    },
  },
};
