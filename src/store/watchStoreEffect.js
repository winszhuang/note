import { computed } from 'vue';
import { useStore } from 'vuex';
import { setDataToLS } from './localStorageEffect';

const watchStoreEffect = () => {
  const store = useStore();

  const updatePagesToLSByWatching = () => {
    store.watch((state) => state.pages.pages, (curr) => {
      setDataToLS('pages', curr);
    }, { deep: true });
  };

  const updateBlocksToLSByWatching = () => {
    store.watch((state) => state.blocks.blocks, (curr) => {
      setDataToLS('blocks', curr);
    }, { deep: true });
  };

  const updateGroupsToLSByWatching = () => {
    store.watch((state) => state.groups.groups, (curr) => {
      setDataToLS('groups', curr);
    }, { deep: true });
  };

  const storeObserver = () => {
    const updateEditTimeOfPageBySubscribe = (mutation, state) => {
      // console.log(mutation.type);
      if (!state.pages.currentPageId) return;
      if (mutation.type === 'blocks/setFocusBlockById') return;
      if (mutation.type === 'pages/editPageData' && mutation.payload?.property === 'editTime') return;

      const mutationsThatDidntRequireRecordingtime = [
        'setStoreData',
        'pages/resetPages',
        'pages/deletePage',
        'pages/setCurrentPageId',
        'pages/addIdToPageHistory',
        'blocks/deleteBlock',
        'blocks/resetBlocks',
        'blocks/setFocusBlockById',
        'blocks/setSelectedBlocksIds',
        'blocks/addIdsToHiddenBlocksIds',
        'blocks/deleteIdToBlocksOfBlock',
        'blocks/deleteIdToBlocksOfPage',
        'blocks/deleteIdsToHiddenBlocksIds',
        'blocks/resetHiddenBlocksIds',
        'groups/resetGroups',
        'userInfo/resetUserInfo',
        'userInfo/setUserInfo',
        'userInfo/deleteIdFromPageHistory',
      ];

      for (let i = 0; i < mutationsThatDidntRequireRecordingtime.length; i += 1) {
        if (mutation.type === mutationsThatDidntRequireRecordingtime[i]) {
          // console.log('不需要紀錄時間');
          return;
        }
      }
      // pages/deleteIdToBlocksOfPage需要紀錄
      // console.log(mutation.type);
      // console.log('需要紀錄時間');
      store.commit('pages/editPageData', {
        property: 'editTime',
        value: new Date().getTime().toString(),
      });
    };

    const collapseSidebarByAddSomething = (mutation, state) => {
      if (!(state.sidebarState.isCollapse === false
        && state.sidebarState.isFloating === true)) return;
      const mutations = [
        'pages/deletePage',
        'pages/setCurrentPageId',
        'blocks/addBlock',
      ];

      for (let i = 0; i < mutations.length; i += 1) {
        if (mutation.type === mutations[i]) {
          store.commit('setSidebarCollapse', true);
          return;
        }
      }
    };

    const checkDataInStoreThen = (mutation, callback) => {
      if (mutation.type === 'setStoreData') {
        callback();
      }
    };

    const updatePageHistory = (mutation) => {
      if (mutation.type === 'pages/setCurrentPageId') {
        store.commit('userInfo/addIdToPageHistory', mutation.payload);
      }
      if (mutation.type === 'pages/deletePage') {
        console.log(mutation.payload);
        store.commit('userInfo/deleteIdFromPageHistory', mutation.payload);
      }
    };
    // const listenBlockDeleteAnd = (mutation) => {
    //   if (mutation.type !== 'blocks/deleteBlock') return;
    //   const block = mutation.payload;
    //   const blockId = mutation.payload.id;
    //   console.log(block, blockId);
    // };

    const checkGroupEmptyAndDelete = (mutation) => {
      if (mutation.type !== 'groups/deleteIdToGroup') return;
      const { groupId } = mutation.payload;
      const group = computed(() => store.getters['groups/getGroupById'](groupId));
      if (group.value.blocks.length === 0) {
        setTimeout(() => {
          store.commit('groups/deleteGroup', group.value);
        }, 1000);
      }
    };

    store.subscribe((mutation, state) => {
      updateEditTimeOfPageBySubscribe(mutation, state);
      collapseSidebarByAddSomething(mutation, state);
      checkDataInStoreThen(mutation, () => {
        if (window.innerWidth > 992) {
          store.commit('setSidebarCollapse', false);
        }
      });
      updatePageHistory(mutation);
      // listenBlockDeleteAnd(mutation);
      checkGroupEmptyAndDelete(mutation);
    });
  };

  return {
    updatePagesToLSByWatching,
    updateBlocksToLSByWatching,
    updateGroupsToLSByWatching,
    storeObserver,
  };
};

export default watchStoreEffect;
