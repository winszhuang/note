export default {
  namespaced: true,
  state: {
    userInfo: {},
  },
  mutations: {
    setUserInfo(state, info) {
      state.userInfo = info;
    },

    getUserInfo(state) {
      return state.userInfo;
    },

    deleteUserInfo(state) {
      state.userInfo = {};
    },
  },
  getters: {

  },
  actions: {

  },
};
