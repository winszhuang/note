export default {
  namespaced: true,
  state: {
    userInfo: {},
  },
  mutations: {
    resetUserInfo(state) {
      state.userInfo = {};
    },

    setUserInfo(state, info) {
      state.userInfo = info;
    },

    // 處理pageHistory
    addIdToPageHistory(state, id = state.currentPageId) {
      state.userInfo.pageHistory.push(id);
      if (state.userInfo.pageHistory.length > 10) {
        state.userInfo.pageHistory.splice(0, 1);
      }
    },

    deleteIdFromPageHistory(state, id) {
      const index = state.userInfo.pageHistory.indexOf(id);
      state.userInfo.pageHistory.splice(index, 1);
    },
  },
  getters: {
    selectDistinctPageHistory(state) {
      return new Set(state.userInfo.pageHistory);
    },

    getPageNameListInHistory(state, getters, rootState, rootGetters) {
      const pageNameList = [];
      getters.selectDistinctPageHistory.forEach((id) => {
        pageNameList.push(rootGetters['pages/choosePage'](id).name);
      });
      return pageNameList;
    },

  },
  actions: {

  },
};
