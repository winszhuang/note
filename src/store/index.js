/* eslint-disable no-undef */
// import { nextTick } from 'vue';
import { createStore } from 'vuex';
import { db } from './db';

const stateFind = (collection, id) => collection.find((item) => item.id === id);

export default createStore({
  strict: true, // 正式上線的時候關掉
  state: {
    pages: [
      {
        id: '1111',
        name: 'Javascript筆記',
        blocks: [
          '777',
        ],
        parentId: '',
        cover: '',
      },
      {
        id: '2222',
        name: '旅遊規劃',
        blocks: [],
        parentId: '1111',
      },
    ],
    blocks: [
      {
        id: '777',
        content: '2222',
        type: 'page',
      },
    ],
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
        type: 'video',
        name: '影片',
      },
      {
        type: 'p',
        name: '文字片段',
      },
      {
        type: 'page',
        name: '頁面',
      },
      {
        type: 'numberList',
        name: '順序列表',
      },
    ],
    currentPageId: '', // 存當前頁面id 不用放數據庫
    currentPageIdOnMouse: '',
    currentBlockIdOnMouse: '',
    currentFocusBlockId: '',
  },
  mutations: {
    // 把FS的資料全部取到state中
    setStoreData(state, { data, name }) {
      state[name] = data;
    },

    // 增加新頁面
    addPage(state, { id, parentPageId }) {
      const newId = id || new Date().getTime().toString();
      const page = {
        id: newId,
        name: 'untitle',
        blocks: [],
        parentId: parentPageId || '',
        cover: '',
      };
      // console.log(page.parentId);
      state.pages.push(page);
    },
    deletePage(state, item) {
      const index = state.pages.indexOf(item);
      state.pages.splice(index, 1);
    },

    editPageData(state, { property, value, pageId }) {
      const editPageId = pageId || state.currentPageId;
      stateFind(state.pages, editPageId)[property] = value;
    },
    changeCurrentPage(state, id) {
      state.currentPageId = id;
    },
    changeCurrentPageIdOnMouse(state, id) {
      state.currentPageIdOnMouse = id;
    },
    changeCurrentBlockIdOnMouse(state, id) {
      state.currentBlockIdOnMouse = id;
    },
    // 添加block到某page，須帶入參數含
    addBlock(state, { typeName, page, value }) { // 若typeName是page，value存新id
      const newBlockId = (new Date().getTime() + 3).toString();
      // console.log(newBlockId);
      const newBlock = {
        id: newBlockId,
        content: value || '',
        type: typeName,
      };
      // 此段處理block的id被加入某page中的blocks陣列裡的某位置
      const isSelect = state.currentFocusBlockId !== '';
      if (isSelect) {
        const index = page.blocks.indexOf(state.currentFocusBlockId);
        page.blocks.splice(index + 1, 0, newBlockId);
      } else {
        page.blocks.push(newBlockId);
      }
      // 把新的block加入blocks裡面
      state.blocks.push(newBlock);
      state.currentFocusBlockId = newBlockId;
    },
    editBlockData(state, { id, value }) {
      if (state.currentPageId === '') return;
      stateFind(state.blocks, id).content = value;
    },
    changeFocusBlock(state, id) {
      state.currentFocusBlockId = id;
    },
    deleteBlock(state, { containPage, blockId }) {
      const page = containPage || stateFind(state.pages, state.currentPageId);
      const thisBlockId = blockId || state.currentFocusBlockId;
      const index = page.blocks.indexOf(thisBlockId);
      page.blocks.splice(index, 1);
      state.blocks = state.blocks.filter((item) => item.id !== thisBlockId);
      if (state.currentFocusBlockId !== '') {
        state.currentFocusBlockId = page.blocks[index - 1];
      }
    },
  },
  getters: {
    // 回傳帶入的page的id所取得的所有子集pages ; 帶入''回傳根pages
    childrenPages(state) {
      return (id) => state.pages.filter((page) => page.parentId === id);
    },
    // 回傳帶入的page所取得的父page
    parentPage(state) {
      return (page) => stateFind(state.pages, page.parentId);
    },
    // 回傳帶入的某id所取得的page
    choosePage(state) {
      return (id) => stateFind(state.pages, id);
    },
    // 回傳當前workspace顯示的page
    currentPage(state) {
      return stateFind(state.pages, state.currentPageId);
    },
    // 回傳當前page裡面包含的所有blocks
    currentBlocks(state, getters) {
      return getters.currentPage.blocks.map((itemId) => stateFind(state.blocks, itemId));
      // return state.blocks.filter((block) => block.parentID === state.currentPageId);
    },
    // 回傳當前page裡面被選中的block
    currentFocusBlock(state, getters) {
      return stateFind(getters.currentBlocks, state.currentFocusBlockId);
    },
    // 回傳當前page裡面被選中的block是第幾順位的數字
    // indexOfCurrentBlock(state, getters) {
    //   return getters.currentPage.blocks.indexOf(state.currentFocusBlockId);
    // },
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

    // 增加子頁面
    // 先創一個type是page的block，再把新創的page連結丟入此block的content
    addPageInside(store, parentPage) {
      const id = new Date().getTime().toString(); // 新的id
      // console.log('newPageId: ', id);
      // console.log('newPageId: ',);
      store.commit('addPage', {
        id,
        parentPageId: parentPage.id,
      });
      store.commit('addBlock', {
        typeName: 'page',
        page: parentPage,
        value: id,
      });
    },
    // 刪除某頁面 item是點擊刪除按鈕同行的page
    deletePageWithIcon(store, item) {
      if (item.parentId !== '') {
        store.commit('deleteBlock', {
          containPage: stateFind(store.state.pages, item.parentId),
          blockId: store.state.blocks.find((block) => block.content === item.id).id,
        });
      }
      store.commit('deletePage', item);

      const childrenPages = store.state.pages.filter((page) => page.parentId === item.id);
      if (childrenPages && childrenPages.length !== 0) {
        childrenPages.forEach((page) => store.dispatch('deletePageWithIcon', page));
      }
    },
  },
  modules: {
  },
});
