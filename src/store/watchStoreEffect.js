// import { computed } from 'vue';
import SecureLS from 'secure-ls';
import { useStore } from 'vuex';
// import { setDataToLS } from './localStorageEffect';

const watchStoreEffect = () => {
  const store = useStore();
  const ls = new SecureLS();

  const updatePagesToLSByWatching = () => {
    store.watch((state) => state.pages.pages, (curr) => {
      // setDataToLS('pages', curr);
      ls.set('pages', curr);
    }, { deep: true });
  };

  const updateBlocksToLSByWatching = () => {
    store.watch((state) => state.blocks.blocks, (curr) => {
      ls.set('blocks', curr);
      // setDataToLS('blocks', curr);
    }, { deep: true });
  };

  const storeObserver = () => {
    const updateEditTimeOfPage = (mutation, state) => {
      if (!state.pages.currentPageId) return;

      const hasEditBlock = mutation.type === 'blocks/editBlockData';
      const hasEditPage = mutation.type === 'pages/editPageData'
        && mutation.payload?.key !== 'editTime';

      if (hasEditBlock || hasEditPage) {
        store.commit('pages/editPageData', {
          key: 'editTime',
          value: new Date().getTime().toString(),
        });
      }
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
      updateEditTimeOfPage(mutation, state);
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
