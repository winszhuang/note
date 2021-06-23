import { findInStore } from './commonStoreEffect';

export default {
  namespaced: true,
  state: {
    groups: [],
  },
  mutations: {
    addGroup(state, groupId) {
      const group = {
        id: groupId || new Date().getTime().toString(),
        value: [],
      };
      state.groups.push(group);
    },

    addIdToGroup(state, { groupId, id, index }) {
      const group = findInStore(state.groups, groupId);
      if (index !== undefined) {
        group.value.splice(index, 0, id);
      } else {
        group.value.push(id);
      }
    },

    addIdsToGroup(state, { groupId, ids }) {
      const group = findInStore(state.groups, groupId);
      group.value = [...group.value, ...ids];
    },

    deleteIdToGroup(state, { groupId, id }) {
      const group = findInStore(state.groups, groupId);
      const index = group.value.indexOf(id);
      group.value.splice(index, 1);
    },

    deleteGroup(state, group) {
      const index = state.groups.indexOf(group);
      state.groups.splice(index, 1);
    },
  },
  getters: {
    getGroupByBlock(state) {
      return (block) => findInStore(state.groups, block.group);
    },

    getIndexFromGroupByBlock(state) {
      return (block) => findInStore(state.groups, block.group).value.indexOf(block.id);
    },

    getGroups(state) {
      return state.groups;
    },
  },
  actions: {
    deleteIdsToGroup({ commit }, { groupId, ids }) {
      ids.forEach((id) => {
        commit('deleteIdToGroup', {
          groupId,
          id,
        });
      });
    },
  },
};
