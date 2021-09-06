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

    // 處理recentPageIds
    addIdToRecentPageIds(state, id = state.currentPageId) {
      if (state.userInfo.recentPageIds.includes(id)) return;
      state.userInfo.recentPageIds.push(id);
      if (state.userInfo.recentPageIds.length > 10) {
        state.userInfo.recentPageIds.splice(0, 1);
      }
    },

    deleteIdFromRecentPageIds(state, id) {
      const index = state.userInfo.recentPageIds.indexOf(id);
      state.userInfo.recentPageIds.splice(index, 1);
    },
  },
  getters: {
    getPagesInRecentPageIds(state, getters, rootState, rootGetters) {
      const pageList = [];
      state.userInfo.recentPageIds.forEach((id) => {
        const page = rootGetters['pages/choosePage'](id);
        if (page) pageList.push(page);
      });
      return pageList;
    },

  },
};
