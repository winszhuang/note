/* eslint-disable no-undef */
// import { nextTick } from 'vue';
import { createStore } from 'vuex';
import { db } from './db';

const stateFind = (collection, id) => collection.find((item) => item.id === id);
const arrayDeleteByValue = (arr, value) => {
  console.log(value);
  const newArr = [...arr];
  newArr.forEach((e) => {
    console.log(e);
  });
  const index = newArr.indexOf(value);
  console.log(index);
  newArr.splice(index, 1);
  return newArr;
};

export default createStore({
  strict: true, // 正式上線的時候關掉
  state: {
    pages: [
      {
        id: '1111',
        name: 'Javascript筆記',
        blocks: ['111', '222', '333'],
        parentId: '',
        cover: '',
      },
    ],
    blocks: [
      {
        id: '111',
        type: 'h2',
        content: '1111111111111',
        blocks: [],
        parentId: '',
      },
      {
        id: '222',
        type: 'h3',
        content: '2222222222222',
        blocks: [],
        parentId: '',
      },
      {
        id: '333',
        type: 'p',
        content: '33333333333333',
        blocks: [],
        parentId: '',
      },
    ],
    blocktype: [
      {
        type: 'h1',
        icon: 'heading',
        style: 'solid',
        name: '大標題',
      },
      {
        type: 'h2',
        icon: 'heading',
        style: 'solid',
        name: '中標題',
      },
      {
        type: 'h3',
        icon: 'heading',
        style: 'solid',
        name: '小標題',
      },
      {
        type: 'video',
        icon: 'video',
        style: 'solid',
        name: '影片',
      },
      {
        type: 'img',
        icon: 'images',
        style: 'regular',
        name: '圖片',
      },
      {
        type: 'p',
        icon: 'font',
        style: 'solid',
        name: '文字片段',
      },
      {
        type: 'page',
        icon: 'file',
        style: 'regular',
        size: '1x',
        name: '內嵌頁面',
      },
      {
        type: 'numberList',
        icon: 'list-ol',
        style: 'solid',
        name: '順序列表',
      },
      {
        type: 'bulletList',
        icon: 'list-ul',
        style: 'solid',
        name: '無序列表',
      },
    ],
    currentPageId: '', // 存當前頁面id 不用放數據庫
    currentPageIdOnMouse: '',
    currentBlockIdOnMouse: '',
    currentFocusBlockId: '',
    currentBlocksByAreaSelect: [],
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
      state.pages = arrayDeleteByValue(state.pages, item);
    },

    editPageData(state, { property, value, pageId }) {
      const editPageId = pageId || state.currentPageId;
      stateFind(state.pages, editPageId)[property] = value;
    },
    changeCurrentPage(state, id) {
      state.currentPageId = id;
    },
    addBlock(state, item) {
      state.blocks.push(item);
    },
    deleteBlock(state, item) {
      const index = state.blocks.indexOf(item);
      state.blocks.splice(index, 1);
    },
    changeCurrentPageIdOnMouse(state, id) {
      state.currentPageIdOnMouse = id;
    },
    changeCurrentBlockIdOnMouse(state, id) {
      state.currentBlockIdOnMouse = id;
    },

    addIdToBlocksOfPage(state, { page, blockId, index }) {
      const thispage = page || stateFind(state.pages, state.currentPageId);
      if (index !== undefined) {
        thispage.blocks.splice(index, 0, blockId);
      } else {
        thispage.blocks.push(blockId);
      }
    },
    addIdToBlocksOfBlock(state, { block, blockId, index }) {
      if (index) {
        block.blocks.splice(index, 0, blockId);
      } else {
        block.blocks.push(blockId);
      }
    },
    deleteIdToBlocksOfPage(state, { page, blockId }) {
      const thispage = page || stateFind(state.pages, state.currentPageId);
      const index = thispage.blocks.indexOf(blockId);
      thispage.blocks.splice(index, 1);
    },
    deleteIdToBlocksOfBlock(state, { block, blockId }) {
      const index = block.blocks.indexOf(blockId);
      block.blocks.splice(index, 1);
    },
    editBlockData(state, { id, key = 'content', value }) {
      if (state.currentPageId === '') return;
      stateFind(state.blocks, id)[key] = value;
    },
    changeFocusBlock(state, id) {
      if (id) {
        state.currentFocusBlockId = id;
      } else {
        state.currentFocusBlockId = '';
      }
    },
    changeBlocksByAreaSelect(state, { arr }) {
      state.currentBlocksByAreaSelect = arr;
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
    currentBlocks(state, getters) { // 這邊的問題 應該讓所有block(包含子block)單純放page裡面
      return getters.currentPage.blocks.map((itemId) => stateFind(state.blocks, itemId));
    },
    // 回傳當前page裡面包含的所有blocks的id的陣列
    currentBlocksIds(state, getters) {
      return getters.currentPage.blocks;
    },
    // 回傳帶入的某id所取得的block
    chooseBlock(state) {
      return (id) => stateFind(state.blocks, id);
    },
    // 回傳帶入的block的id所取得的所有子集blocks ; 帶入''回傳當前頁有的根blocks
    childrenCurrentBlocks(state, getters) {
      return (id) => getters.currentBlocks.filter((block) => block.parentId === id);
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
    addPageInside(store, page) {
      const parentPage = page || store.getters.currentPage;

      const id = new Date().getTime().toString(); // 新的id
      store.commit('addPage', {
        id,
        parentPageId: parentPage.id,
      });
      store.dispatch('addBlock', {
        typeName: 'page',
        page: parentPage,
        value: id,
      });
    },
    // 添加block到某page，須帶入參數含
    addBlock(store, {
      page, typeName, value, id, blocks, parentId, // 若typeName是page，value存新id
    }) {
      const newBlockId = id || (new Date().getTime() + 3).toString();
      const newBlock = {
        id: newBlockId,
        type: typeName,
        content: value || '',
        blocks: blocks || [],
        parentId: parentId || '',
      };

      // 此段處理block的id被加入某page中的blocks陣列裡的某位置
      const thisPage = page || stateFind(store.state.pages, store.state.currentPageId);
      const isSelect = store.state.currentFocusBlockId !== '';

      const index = thisPage.blocks.indexOf(store.state.currentFocusBlockId);
      store.commit('addIdToBlocksOfPage', {
        page: thisPage,
        blockId: newBlockId,
        index: isSelect ? index + 1 : null,
      });
      store.commit('addBlock', newBlock);
      store.commit('changeFocusBlock', newBlockId);
    },

    // 增加子block
    addBlockInside(store, block) {
      const parentBlock = block;

      const id = new Date().getTime().toString(); // 創一個新的blockId

      store.dispatch('addBlock', {
        typeName: 'p',
        id,
        parentId: parentBlock.id,
      });

      const newBlocks = [...parentBlock.blocks, id];
      store.commit('editBlockData', {
        id: parentBlock.id, // 此處id為父集id
        key: 'blocks',
        value: newBlocks,
      });
    },

    deleteBlock(store, { containPage, block }) {
      const page = containPage || stateFind(store.state.pages, store.state.currentPageId);
      const thisBlock = block || stateFind(store.state.blocks, store.state.currentFocusBlockId);

      // 如果刪除的block是包在某父集block裡面的情況，就刪除父集block屬性blocks中的對應ID
      if (thisBlock.parentId !== '') {
        const parentBlock = stateFind(store.state.blocks, thisBlock.parentId);
        const index = parentBlock.blocks.indexOf(thisBlock.id);
        store.commit('changeFocusBlock', parentBlock.blocks[index - 1]);
        store.commit('deleteIdToBlocksOfBlock', {
          block: parentBlock,
          blockId: thisBlock.id,
        });
      } else { // 單純的刪除page裡面某位置的blockId
        const index = page.blocks.indexOf(thisBlock.id);
        store.commit('changeFocusBlock', page.blocks[index - 1]);
      }

      // 刪除當前page的blocks裡面對應的id
      store.commit('deleteIdToBlocksOfPage', {
        page,
        blockId: thisBlock.id,
      });

      store.commit('deleteBlock', thisBlock); // 徹底刪除此block
    },

    // 刪除某頁面 item是點擊刪除按鈕同行的page
    deletePageWithIcon(store, item) {
      if (item.parentId !== '') {
        store.dispatch('deleteBlock', {
          containPage: stateFind(store.state.pages, item.parentId),
          block: store.state.blocks.find((block) => block.content === item.id),
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
