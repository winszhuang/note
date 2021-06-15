import { useStore } from 'vuex';

const watchStoreEffect = () => {
  const store = useStore();

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
    updateEditTimeOfPageBySubscribe,
  };
};

export default watchStoreEffect;
