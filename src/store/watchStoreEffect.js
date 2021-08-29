// import { computed } from 'vue';
// import SecureLS from 'secure-ls';
import { useStore } from 'vuex';
import { setDataToLS } from './localStorageEffect';

const watchStoreEffect = () => {
  const store = useStore();
  // const ls = new SecureLS();

  const updatePagesToLSByWatching = () => {
    store.watch((state) => state.pages.pages, (curr) => {
      setDataToLS('pages', curr);
      // ls.set('blocktest', curr);
    }, { deep: true });
  };

  const updateBlocksToLSByWatching = () => {
    store.watch((state) => state.blocks.blocks, (curr) => {
      // ls.set('blocktest', curr);
      setDataToLS('blocks', curr);
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
        'pages/addIdToRecentPageIds',
        'blocks/deleteBlock',
        'blocks/resetBlocks',
        'blocks/setFocusBlockById',
        'blocks/setSelectedBlocksIds',
        'blocks/addIdsToHiddenBlocksIds',
        'blocks/deleteIdToBlocksOfBlock',
        'blocks/deleteIdToBlocksOfPage',
        'blocks/deleteIdsToHiddenBlocksIds',
        'blocks/resetHiddenBlocksIds',
        'userInfo/resetUserInfo',
        'userInfo/setUserInfo',
        'userInfo/deleteIdFromRecentPageIds',
      ];

      // 不需要紀錄時間
      for (let i = 0; i < mutationsThatDidntRequireRecordingtime.length; i += 1) {
        if (mutation.type === mutationsThatDidntRequireRecordingtime[i]) return;
      }

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

    const updateRecentPageIds = (mutation) => {
      if (mutation.type === 'pages/setCurrentPageId') {
        store.commit('userInfo/addIdToRecentPageIds', mutation.payload);
      }
      if (mutation.type === 'pages/deletePage') {
        store.commit('userInfo/deleteIdFromRecentPageIds', mutation.payload);
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
      updateRecentPageIds(mutation);
    });
  };

  return {
    updatePagesToLSByWatching,
    updateBlocksToLSByWatching,
    storeObserver,
  };
};

export default watchStoreEffect;
