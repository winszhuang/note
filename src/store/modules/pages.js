import { findInStoreById, arrayDeleteByValue } from './commonStoreEffect';
import { generateRandomString, getRandomLightColor } from '../../components/commonEffect';

export default {
  namespaced: true,
  state: {
    pages: [],
    currentPageId: '',
    currentPageIdOnMouse: '',
  },
  mutations: {
    // 處理pages
    resetPages(state) {
      state.pages = [];
      state.currentPageId = '';
    },

    addPage(state,
      page = {
        id: generateRandomString(),
        name: 'untitle',
        blocks: [],
        parentId: '',
        createdTime: new Date().getTime().toString(),
        editTime: new Date().getTime().toString(),
        tags: [],
        cover: '',
      }) {
      state.pages.push(page);
    },

    deletePage(state, page) {
      state.pages = arrayDeleteByValue(state.pages, page);
    },

    editPageData(state, {
      page = findInStoreById(state.pages, state.currentPageId),
      key,
      value,
    }) {
      if (!page) {
        console.log('請先選擇頁面');
        return;
      }
      // eslint-disable-next-line no-param-reassign
      page[key] = value;
    },

    addIdToBlocksOfPage(state, {
      page = findInStoreById(state.pages, state.currentPageId),
      id,
      index,
    }) {
      if (index === undefined) {
        page.blocks.push(id);
        return;
      }
      page.blocks.splice(index, 0, id);
    },

    deleteIdToBlocksOfPage(state, {
      page = findInStoreById(state.pages, state.currentPageId),
      id,
    }) {
      const index = page.blocks.indexOf(id);
      page.blocks.splice(index, 1);
    },

    // 處理currentPageId
    setCurrentPageId(state, id) {
      if (id === state.currentPageId) return;
      state.currentPageId = id;
    },
  },
  getters: {
    // 回傳帶入的page的id所取得的所有子集pages ; 帶入''回傳根pages
    childrenPages(state) {
      return (id) => state.pages.filter((page) => page.parentId === id);
    },
    // 回傳帶入的page所取得的父page
    parentPage(state) {
      return (page) => findInStoreById(state.pages, page.parentId);
    },
    // 回傳帶入的某id所取得的page
    choosePage(state) {
      return (id) => findInStoreById(state.pages, id);
    },
    // 回傳當前workspace顯示的page
    currentPage(state) {
      return findInStoreById(state.pages, state.currentPageId);
    },

    searchPages(state) {
      return (str) => (str !== '' ? state.pages.filter((page) => page.name.includes(str)) : null);
    },

    getPageByBlockId(state) {
      return (blockId) => state.pages.find((page) => page.blocks.includes(blockId));
    },

    allPagesIds(state) {
      const allIds = [];
      state.pages.forEach((page) => {
        allIds.push(page.id);
      });
      return allIds;
    },
  },
  actions: {
    moveIdInBlocksOfPage({ commit }, { page, id, index }) {
      commit('deleteIdToBlocksOfPage', {
        page,
        id,
      });
      commit('addIdToBlocksOfPage', {
        page,
        id,
        index,
      });
    },

    // 刪除某頁面 item是點擊刪除按鈕同行的page
    deletePage({
      state, rootState, commit, dispatch,
    }, page) {
      if (page.parentId !== '') {
        const blockThatHasPageId = rootState.blocks.blocks
          .find((block) => block.content === page.id);
        if (blockThatHasPageId) {
          dispatch('blocks/deleteBlock', {
            containPage: findInStoreById(state.pages, page.parentId),
            block: blockThatHasPageId,
          }, { root: true });
        }
      }

      const blockList = [...page.blocks];
      blockList.forEach((blockId) => {
        const blockInPage = rootState.blocks.blocks.find((block) => block.id === blockId);
        dispatch('blocks/deleteBlock', {
          containPage: page,
          block: blockInPage,
        }, { root: true });
      });

      commit('deletePage', page);

      const childrenPages = state.pages.filter((aPage) => aPage.parentId === page.id);
      if (childrenPages && childrenPages.length !== 0) {
        childrenPages.forEach((aPage) => dispatch('deletePage', aPage));
      }
    },

    addTag({ state, commit }, name) {
      const page = findInStoreById(state.pages, state.currentPageId);
      const tag = {
        name,
        color: getRandomLightColor(),
      };
      commit('editPageData', {
        key: 'tags',
        value: [...page.tags, tag],
      });
    },

    deleteTag({ state, commit }, tag) {
      const page = findInStoreById(state.pages, state.currentPageId);
      commit('editPageData', {
        key: 'tags',
        value: page.tags.filter((aTag) => aTag !== tag),
      });
    },
  },
};
