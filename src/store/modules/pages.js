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

    addTag(state, name) {
      const page = findInStoreById(state.pages, state.currentPageId);
      const tag = {
        name,
        color: getRandomLightColor(),
      };
      page.tags.push(tag);
    },

    deleteTag(state, tag) {
      const { tags } = findInStoreById(state.pages, state.currentPageId);
      const index = tags.indexOf(tag);
      tags.splice(index, 1);
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
    // addPageInside({ getters, commit, dispatch }, page) {
    //   const parentPage = page || getters.currentPage;

    //   const id = new Date().getTime().toString(); // 新的id
    //   commit('addPage', {
    //     id,
    //     parentPageId: parentPage.id,
    //   });
    //   dispatch('blocks/addBlock', {
    //     type: 'page',
    //     page: parentPage,
    //     value: id,
    //   }, { root: true });
    // },

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
    deletePageWithIcon({
      state, rootState, commit, dispatch,
    }, item) {
      if (item.parentId !== '') {
        console.log('山上面');
        dispatch('blocks/deleteBlock', {
          containPage: findInStoreById(state.pages, item.parentId),
          block: rootState.blocks.blocks.find((block) => block.content === item.id),
        }, { root: true });
      }

      const blockList = [...item.blocks];
      blockList.forEach((blockId) => {
        const blockInPage = rootState.blocks.blocks.find((block) => block.id === blockId);
        dispatch('blocks/deleteBlock', {
          containPage: item,
          block: blockInPage,
        }, { root: true });
      });
      commit('deletePage', item);

      const childrenPages = state.pages.filter((page) => page.parentId === item.id);
      if (childrenPages && childrenPages.length !== 0) {
        childrenPages.forEach((page) => dispatch('deletePageWithIcon', page));
      }
    },
  },
};
