/* eslint-disable no-undef */
import { createStore } from 'vuex';
import { db } from './db';

const stateFind = (collection, id) => collection.find((item) => item.id === id);

export default createStore({
  strict: true, // 正式上線的時候關掉
  state: {
    pages: [],
    blocks: [],
    blocktype: [],
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
        ParentID: '',
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
      const block = {
        id: new Date().getTime().toString(),
        content: '',
        type: typeName,
        parentID: state.currentPageId,
      };
      state.blocks.push(block);
    },
    addP(state) {
      const id = new Date().getTime().toString();
      const block = {
        id,
        content: '',
        type: 'p',
        parentID: state.currentPageId,
      };
      state.blocks.push(block);
      state.currentFocusBlockId = '';
    },
    editBlockData(state, { id, value }) {
      if (state.currentPageId === '') return;
      stateFind(state.blocks, id).content = value;
    },
    changeFocusBlock(state, id) {
      state.currentFocusBlockId = id;
    },
    deleteBlock(state, block) { // 感覺就出錯了
      if (block.id === state.currentFocusBlockId) {
        console.log(block.id);
        state.blocks = state.blocks.filter((item) => item.id !== block.id);
      }
    },

    // updateCurrentPage(state, item) {
    //   state.notes.forEach((page) => {
    //     if (page.item === state.currentPageId) {
    //       const notes = [...state.notes];
    //       notes.page = item;
    //       state.notes = notes;
    //       console.log(state.notes.page);
    //       console.log(state.notes);
    //     }
    //   });
    // },
  },
  getters: {
    currentPage(state) {
      return stateFind(state.pages, state.currentPageId);
    },
    currentBlocks(state) {
      return state.blocks.filter((block) => block.parentID === state.currentPageId);
    },
    currentBlocksNum(state, getters) {
      return getters.currentBlocks.length;
    },
    currentFocusBlock(state, getters) {
      return stateFind(getters.currentBlocks, state.currentFocusBlockId);
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
