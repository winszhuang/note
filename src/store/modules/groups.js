import { findInStoreById } from './commonStoreEffect';
import { generateRandomString } from '../../components/commonEffect';

export default {
  namespaced: true,
  state: {
    groups: [],
  },
  mutations: {
    resetGroups(state) {
      state.groups = [];
    },

    addGroup(state, group = {
      id: generateRandomString(),
      blocks: [],
    }) {
      state.groups.push(group);
    },

    addIdToGroup(state, { id, groupId, index }) {
      const group = findInStoreById(state.groups, groupId);
      if (index !== undefined) {
        group.blocks.splice(index, 0, id);
      } else {
        group.blocks.push(id);
      }
    },

    addIdsToGroup(state, { groupId, ids }) {
      const group = findInStoreById(state.groups, groupId);
      group.blocks = [...group.blocks, ...ids];
    },

    deleteIdToGroup(state, { groupId, id }) {
      const group = findInStoreById(state.groups, groupId);
      const index = group.blocks.indexOf(id);
      group.blocks.splice(index, 1);
    },

    deleteGroup(state, group) {
      const index = state.groups.indexOf(group);
      state.groups.splice(index, 1);
    },
  },
  getters: {
    getGroupById(state) {
      return (id) => findInStoreById(state.groups, id);
    },

    getGroupByBlock(state) {
      return (block) => findInStoreById(state.groups, block.group);
    },

    getIndexFromGroupByBlock(state) {
      return (block) => findInStoreById(state.groups, block.group).blocks.indexOf(block.id);
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
