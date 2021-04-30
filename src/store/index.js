/* eslint-disable no-undef */
// import { nextTick } from 'vue';
import { createStore } from 'vuex';
import { db } from './db';

const stateFind = (collection, id) => collection.find((item) => item.id === id);

export default createStore({
  strict: true, // 正式上線的時候關掉
  state: {
    pages: [],
    blocks: [],
    blocktype: [
      {
        type: 'h1',
        name: '大標題',
      },
      {
        type: 'h2',
        name: '中標題',
      },
      {
        type: 'h3',
        name: '小標題',
      },
      {
        type: 'img',
        name: '圖片',
      },
      {
        type: 'p',
        name: '文字片段',
      },
    ],
    currentPageId: '', // 存當前頁面id 不用放數據庫
    currentFocusBlockId: '',
  },
  mutations: {
    setStoreData(state, { data, name }) {
      state[name] = data;
    },
    addPage(state) {
      const page = {
        id: new Date().getTime().toString(),
        name: 'untitle',
        contain: [],
      };
      state.pages.push(page);
    },
    editPageData(state, { property, value }) {
      stateFind(state.pages, state.currentPageId)[property] = value;
    },
    changeCurrentPage(state, id) {
      state.currentPageId = id;
    },
    addBlock(state, typeName) {
      if (state.currentPageId === '') return;
      const isSelect = state.currentFocusBlockId !== '';
      const currentPage = stateFind(state.pages, state.currentPageId);
      const id = new Date().getTime().toString();
      const block = {
        id,
        content: '',
        type: typeName,
      };
      if (isSelect) {
        const index = currentPage.contain.indexOf(state.currentFocusBlockId);
        currentPage.contain.splice(index + 1, 0, id);
      } else {
        currentPage.contain.push(id);
      }
      state.blocks.push(block);
      state.currentFocusBlockId = id;
    },
    editBlockData(state, { id, value }) {
      if (state.currentPageId === '') return;
      stateFind(state.blocks, id).content = value;
    },
    changeFocusBlock(state, id) {
      state.currentFocusBlockId = id;
    },
    deleteBlock(state) {
      const currentPage = stateFind(state.pages, state.currentPageId);
      const index = currentPage.contain.indexOf(state.currentFocusBlockId);
      state.blocks = state.blocks.filter((item) => item.id !== state.currentFocusBlockId);
      currentPage.contain.splice(index, 1);
      state.currentFocusBlockId = currentPage.contain[index - 1];
    },
  },
  getters: {
    currentPage(state) {
      return stateFind(state.pages, state.currentPageId);
    },
    currentBlocks(state, getters) {
      return getters.currentPage.contain.map((itemId) => stateFind(state.blocks, itemId));
      // return state.blocks.filter((block) => block.parentID === state.currentPageId);
    },
    currentFocusBlock(state, getters) {
      return stateFind(getters.currentBlocks, state.currentFocusBlockId);
    },
    currentIndexofContain(state, getters) {
      return getters.currentPage.contain.indexOf(state.currentFocusBlockId);
    },
  },
  actions: {
    getAllData(store, collection) {
      db.collection(collection)
        .get()
        .then((querySnapshot) => {
          const all = [];
          querySnapshot.forEach((doc) => {
            if (doc.data()) {
              const list = {
                ...doc.data(),
              };
              all.push(list);
            }
          });
          store.commit('setStoreData', {
            data: all,
            name: collection,
          });
        })
        .catch((error) => reject(error));
    },
    updateToFs(store, { collectionName, data }) {
      data.forEach((item) => {
        db.collection(collectionName)
          .doc(item.id)
          .set(item);
      });
    },
    deleteToFs(store, { collectionName }) {
      // console.log(collectionName);
      db.collection(collectionName)
        .doc(store.state.currentFocusBlockId)
        .delete();
    },
    // 可獲取集合裡面任何數據到state
    // getAllData(store, payload) {
    //   db.collection(payload)
    //     .get()
    //     .then((querySnapshot) => {
    //       const all = [];
    //       querySnapshot.forEach((doc) => {
    //         if (doc.data()) {
    //           const list = {
    //             ...doc.data(),
    //             id: doc.id,
    //           };
    //           all.push(list);
    //         }
    //       });
    //       store.commit('setStoreData', {
    //         data: all,
    //         name: payload,
    //       });
    //     })
    //     .catch((error) => reject(error));
    // },
    // getPageData(store) {
    //   db.collection('notes')
    //     .where('id', '==', store.state.currentPageId)
    //     .get()
    //     .then((querySnapshot) => {
    //       querySnapshot.forEach((doc) => {
    //         store.commit('updateCurrentPage', doc.data());
    //       });
    //     });
    // },
    // addPage(store, { id, name, blocks }) {
    //   db.collection('notes')
    //     .doc(id)
    //     .set({ name, id, blocks })
    //     .then(() => {
    //       console.log('成功新增頁面');
    //       store.dispatch('getAllData', 'notes');
    //     });
    // },
    // addBlock(store, typeName) {
    //   if (!store.state.currentPage.name) {
    //     return;
    //   }
    //   const item = {
    //     type: typeName,
    //     content: '',
    //     id: new Date().getTime().toString(),
    //   };
    //   const list = [...store.getters.currentBlockList || []];
    //   list.push(item);
    //   db.collection('notes')
    //     .doc(store.state.currentPage.id)
    //     .update({ blocks: list })
    //     .then(() => {
    //       // store.dispatch('getAllData', 'notes');
    //       store.dispatch('getPageData');
    //     });
    // },
    // updateFsData(store, { key, value }) {
    //   db.collection('notes')
    //     .doc(store.state.currentPageId)
    //     .update({
    //       [key]: value,
    //     })
    //     .then(() => {
    //       store.dispatch('getPageData');
    //     });
    // },
    // updateFsBlocksData(store, { index, value }) {
    //   const list = [...store.getters.currentBlockList];
    //   const item = { ...list[index] };
    //   item.content = value;
    //   list[index] = item;
    //   db.collection('notes')
    //     .doc(store.state.currentPageId)
    //     .update({ blocks: list })
    //     .then(() => {
    //       store.dispatch('getPageData');
    //     });
    // },
  },
  modules: {
  },
});
