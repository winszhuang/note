import { useStore } from 'vuex';
import { setDataToLS } from './localStorageEffect';

const watchStoreEffect = () => {
  const store = useStore();

  const updatePagesToLSByWatching = () => {
    store.watch((state) => state.pages, (curr) => {
      setDataToLS('pages', curr);
    }, { deep: true });
  };

  const updateBlocksToLSByWatching = () => {
    store.watch((state) => state.blocks, (curr) => {
      setDataToLS('blocks', curr);
    }, { deep: true });
  };

  const updateGroupsToLSByWatching = () => {
    store.watch((state) => state.groups, (curr) => {
      setDataToLS('groups', curr);
    }, { deep: true });
  };

  // const listenDelete = () => {
  //   store.subscribe((mutation, state) => {
  //     if (mutation.type)
  //   })
  // }

  const updateEditTimeOfPageBySubscribe = () => {
    store.subscribe((mutation, state) => {
      // console.log(mutation.type);
      // console.log(mutation.payload);
      if (!state.currentPageId) return;
      if (mutation.type === 'editPageData' && mutation.payload?.property === 'editTime') return;

      const mutationsThatDidntRequireRecordingtime = [
        'setStoreData',
        'setCurrentPageId',
        'changeCurrentPageIdOnMouse',
        'changeFocusBlock',
        'changeBlocksByAreaSelect',
        'addIdsToHiddenBlocksIds',
        'deleteIdsToHiddenBlocksIds',
        'resetHiddenBlocksIds',
        'setUserInfo',
        'getUserInfo',
        'deleteUserInfo',
        'addPageHistory',
      ];

      for (let i = 0; i < mutationsThatDidntRequireRecordingtime.length; i += 1) {
        if (mutation.type === mutationsThatDidntRequireRecordingtime[i]) {
          // console.log('不需要紀錄時間');
          return;
        }
      }
      // console.log('需要紀錄時間');
      store.commit('editPageData', {
        property: 'editTime',
        value: new Date().getTime().toString(),
      });
    });
  };

  return {
    updatePagesToLSByWatching,
    updateBlocksToLSByWatching,
    updateGroupsToLSByWatching,
    updateEditTimeOfPageBySubscribe,
  };
};

export default watchStoreEffect;
