import { findInStore, arrayDeleteByValue } from './commonStoreEffect';

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
      state.currentPageIdOnMouse = '';
    },

    addPage(state, { id, parentPageId }) {
      const newDate = new Date().getTime().toString();
      const newId = id || newDate;
      const page = {
        id: newId,
        name: 'untitle',
        blocks: [],
        parentId: parentPageId || '',
        createdTime: newDate,
        editTime: newDate,
        tags: [],
        cover: '',
      };
      state.pages.push(page);
    },

    deletePage(state, item) {
      state.pages = arrayDeleteByValue(state.pages, item);
    },

    editPageData(state, { property, value, pageId = state.currentPageId }) {
      findInStore(state.pages, pageId)[property] = value;
    },

    addIdToBlocksOfPage(state, { page, blockId, index }) {
      const thispage = page || findInStore(state.pages, state.currentPageId);
      if (index !== undefined) {
        thispage.blocks.splice(index, 0, blockId);
      } else {
        thispage.blocks.push(blockId);
      }
    },

    deleteIdToBlocksOfPage(state, { page, blockId }) {
      const thispage = page || findInStore(state.pages, state.currentPageId);
      const index = thispage.blocks.indexOf(blockId);
      thispage.blocks.splice(index, 1);
    },

    addTag(state, name) {
      const thisPage = findInStore(state.pages, state.currentPageId);
      const tagIndex = thisPage.tags.length;
      console.log(tagIndex);
      const tag = {
        name,
        color: state.colors[tagIndex],
      };
      thisPage.tags.push(tag);
    },

    deleteTag(state, tag) {
      const { tags } = findInStore(state.pages, state.currentPageId);
      const index = tags.indexOf(tag);
      tags.splice(index, 1);
    },

    // 處理currentPageId
    setCurrentPageId(state, id) {
      if (id === state.currentPageId) return;
      state.currentPageId = id;
    },

    // 處理currentPageIdOnMouse
    changeCurrentPageIdOnMouse(state, id) {
      state.currentPageIdOnMouse = id;
    },
  },
  getters: {
    // 回傳帶入的page的id所取得的所有子集pages ; 帶入''回傳根pages
    childrenPages(state) {
      return (id) => state.pages.filter((page) => page.parentId === id);
    },
    // 回傳帶入的page所取得的父page
    parentPage(state) {
      return (page) => findInStore(state.pages, page.parentId);
    },
    // 回傳帶入的某id所取得的page
    choosePage(state) {
      return (id) => findInStore(state.pages, id);
    },
    // 回傳當前workspace顯示的page
    currentPage(state) {
      return findInStore(state.pages, state.currentPageId);
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
    addPageInside({ getters, commit, dispatch }, page) {
      const parentPage = page || getters.currentPage;

      const id = new Date().getTime().toString(); // 新的id
      commit('addPage', {
        id,
        parentPageId: parentPage.id,
      });
      dispatch('blocks/addBlock', {
        type: 'page',
        page: parentPage,
        value: id,
      }, { root: true });
    },

    moveIdInBlocksOfPage({ commit }, { page, blockId, index }) {
      commit('deleteIdToBlocksOfPage', {
        page,
        blockId,
      });
      commit('addIdToBlocksOfPage', {
        page,
        blockId,
        index,
      });
    },

    // 刪除某頁面 item是點擊刪除按鈕同行的page
    deletePageWithIcon({
      state, rootState, commit, dispatch,
    }, item) {
      if (item.parentId !== '') {
        dispatch('blocks/deleteBlock', {
          containPage: findInStore(state.pages, item.parentId),
          block: rootState.blocks.blocks.find((block) => block.content === item.id),
        }, { root: true });
      }
      commit('deletePage', item);

      const childrenPages = state.pages.filter((page) => page.parentId === item.id);
      if (childrenPages && childrenPages.length !== 0) {
        childrenPages.forEach((page) => dispatch('deletePageWithIcon', page));
      }
    },
  },
};
