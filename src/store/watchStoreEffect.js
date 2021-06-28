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
      if (!state.pages.currentPageId) return;
      if (mutation.type === 'blocks/changeFocusBlock') return;
      if (mutation.type === 'pages/changeCurrentPageIdOnMouse') return;
      if (mutation.type === 'pages/editPageData' && mutation.payload?.property === 'editTime') return;
      // console.log(mutation.type);
      // console.log(mutation.payload);
      const mutationsThatDidntRequireRecordingtime = [
        'setStoreData',
        'pages/resetPages',
        'pages/deletePage',
        'pages/setCurrentPageId',
        'pages/changeCurrentPageIdOnMouse',
        'pages/addIdToPageHistory',
        'blocks/resetBlocks',
        'blocks/changeFocusBlock',
        'blocks/changeBlocksByAreaSelect',
        'blocks/addIdsToHiddenBlocksIds',
        'blocks/deleteIdsToHiddenBlocksIds',
        'blocks/resetHiddenBlocksIds',
        'groups/resetGroups',
        'userInfo/resetUserInfo',
        'userInfo/setUserInfo',
      ];

      for (let i = 0; i < mutationsThatDidntRequireRecordingtime.length; i += 1) {
        if (mutation.type === mutationsThatDidntRequireRecordingtime[i]) {
          console.log('不需要紀錄時間');
          return;
        }
      }
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

    store.subscribe((mutation, state) => {
      updateEditTimeOfPageBySubscribe(mutation, state);
      collapseSidebarByAddSomething(mutation, state);
      checkDataInStoreThen(mutation, () => {
        if (window.innerWidth > 992) {
          store.commit('setSidebarCollapse', false);
        }
      });
      updatePageHistory(mutation);
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
