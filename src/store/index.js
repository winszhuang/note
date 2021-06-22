/* eslint-disable no-undef */
// import { nextTick } from 'vue';
import { createStore } from 'vuex';
import { db } from './firebase';

const findInStore = (collection, id) => collection.find((item) => item.id === id);
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
      // {
      //   id: 'page1',
      //   name: 'Javascript筆記',
      //   blocks: ['js1', 'js2', 'js3', 'js4', 'js5', 'js6', 'js7'],
      //   parentId: '',
      //   cover: '',
      // },
      // {
      //   id: 'page2',
      //   name: 'vue筆記',
      //   blocks: ['vue1', 'vue2', 'vue3', 'vue4', 'vue5', 'vue6', 'vue7', 'vue8', 'vue9'],
      //   parentId: '',
      //   cover: '',
      // },
    ],
    blocks: [
      // {
      //   id: 'js1',
      //   type: 'h2',
      //   content: 'Array方法',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'js2',
      //   type: 'p',
      //   content: 'find',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'js3',
      //   type: 'p',
      //   content: 'forEach',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'js4',
      //   type: 'p',
      //   content: 'map',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'js5',
      //   type: 'h2',
      //   content: 'String方法',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'js6',
      //   type: 'p',
      //   content: 'includes',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'js7',
      //   type: 'p',
      //   content: 'indexOf',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'vue1',
      //   type: 'h2',
      //   content: '指令',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'vue2',
      //   type: 'p',
      //   content: 'v-model',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'vue3',
      //   type: 'p',
      //   content: 'v-for',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'vue4',
      //   type: 'p',
      //   content: 'v-if',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'vue5',
      //   type: 'p',
      //   content: 'v-show',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'vue6',
      //   type: 'h2',
      //   content: '生命週期',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'vue7',
      //   type: 'p',
      //   content: 'onMounted',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'vue8',
      //   type: 'p',
      //   content: 'onUpdate',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
      // {
      //   id: 'vue9',
      //   type: 'p',
      //   content: 'unMounted',
      //   blocks: [],
      //   parentId: '',
      //   group: '',
      // },
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
        type: 'numberItem',
        icon: 'list-ol',
        style: 'solid',
        name: '順序列表',
      },
      {
        type: 'bulletItem',
        icon: 'list-ul',
        style: 'solid',
        name: '無序列表',
      },
      {
        type: 'toggleList',
        icon: 'caret-right',
        style: 'solid',
        size: '1x',
        name: '切換列表',
      },
      {
        type: 'todoItem',
        icon: 'check-square',
        style: 'regular',
        name: '核取框',
      },
      {
        type: 'dividingLine',
        icon: 'window-minimize',
        style: 'regular',
        name: '分割線',
      },
      {
        type: 'codeEditor',
        icon: 'laptop-code',
        style: 'solid',
        name: '程式碼',
      },
    ],
    colors: [
      'D7EBBA',
      'fac3cd',
      'c5d9e4',
      'fac9c9',
      'c2d1f1',
      'faeca5',
      'E6F8B2',
    ],
    groups: [],
    userInfo: {}, // 當前登入的user
    currentPageId: '', // 存當前頁面id 不用放數據庫
    currentPageIdOnMouse: '',
    currentFocusBlockId: '',
    currentBlocksByAreaSelect: [],
    hiddenBlocksIds: [],
    pageHistory: [],
    isSidebarCollapse: '',
  },
  mutations: {
    // 把FS的資料全部取到state中
    setStoreData(state, { data, name }) {
      state[name] = data;
    },
    addTag(state, name) {
      const thisPage = findInStore(state.pages, state.currentPageId);
      const tagIndex = thisPage.tags.length;
      console.log(tagIndex);
      const tag = {
        name,
        color: state.colors[tagIndex],
      };
      thisPage.tags.push(tag);
    },

    deleteTag(state, tag) {
      const { tags } = findInStore(state.pages, state.currentPageId);
      const index = tags.indexOf(tag);
      tags.splice(index, 1);
    },
    // 增加新頁面
    addPage(state, { id, parentPageId }) {
      const newDate = new Date().getTime().toString();
      const newId = id || newDate;
      const page = {
        id: newId,
        name: 'untitle',
        blocks: [],
        parentId: parentPageId || '',
        createdTime: newDate,
        editTime: newDate,
        tags: [],
        cover: '',
      };
      state.pages.push(page);
    },
    deletePage(state, item) {
      state.pages = arrayDeleteByValue(state.pages, item);
    },

    editPageData(state, { property, value, pageId = state.currentPageId }) {
      findInStore(state.pages, pageId)[property] = value;
    },

    setCurrentPageId(state, id) {
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

    addIdToBlocksOfPage(state, { page, blockId, index }) {
      const thispage = page || findInStore(state.pages, state.currentPageId);
      if (index !== undefined) {
        thispage.blocks.splice(index, 0, blockId);
      } else {
        thispage.blocks.push(blockId);
      }
    },

    addIdToBlocksOfBlock(state, { block, blockId, index }) {
      if (index !== undefined) {
        block.blocks.splice(index, 0, blockId);
      } else {
        block.blocks.push(blockId);
      }
    },

    deleteIdToBlocksOfPage(state, { page, blockId }) {
      const thispage = page || findInStore(state.pages, state.currentPageId);
      const index = thispage.blocks.indexOf(blockId);
      thispage.blocks.splice(index, 1);
    },

    deleteIdToBlocksOfBlock(state, { block, blockId }) {
      const index = block.blocks.indexOf(blockId);
      block.blocks.splice(index, 1);
    },

    editBlockData(state, { id = state.currentFocusBlockId, value, key = 'content' }) {
      if (state.currentPageId === '') return;
      findInStore(state.blocks, id)[key] = value;
    },

    changeFocusBlock(state, id) {
      state.currentFocusBlockId = id;
    },

    changeBlocksByAreaSelect(state, { arr }) {
      state.currentBlocksByAreaSelect = arr;
    },

    // 此部分處理group邏輯
    addGroup(state, groupId) {
      const group = {
        id: groupId || new Date().getTime().toString(),
        value: [],
      };
      state.groups.push(group);
    },

    addIdToGroup(state, { groupId, id, index }) {
      const group = findInStore(state.groups, groupId);
      if (index !== undefined) {
        group.value.splice(index, 0, id);
      } else {
        group.value.push(id);
      }
    },

    addIdsToGroup(state, { groupId, ids }) {
      const group = findInStore(state.groups, groupId);
      group.value = [...group.value, ...ids];
    },

    deleteIdToGroup(state, { groupId, id }) {
      const group = findInStore(state.groups, groupId);
      const index = group.value.indexOf(id);
      group.value.splice(index, 1);
    },

    deleteGroup(state, group) {
      const index = state.groups.indexOf(group);
      state.groups.splice(index, 1);
    },

    changeGroupIdFromBlockId(state, { blockId, groupId }) {
      findInStore(state.blocks, blockId).group = groupId;
    },

    addIdsToHiddenBlocksIds(state, ids) {
      ids.forEach((id) => {
        if (!state.hiddenBlocksIds.includes(id)) {
          state.hiddenBlocksIds.push(id);
        }
      });
    },

    deleteIdsToHiddenBlocksIds(state, ids) {
      ids.forEach((id) => {
        if (state.hiddenBlocksIds.includes(id)) {
          const index = state.hiddenBlocksIds.indexOf(id);
          state.hiddenBlocksIds.splice(index, 1);
        }
      });
    },

    resetHiddenBlocksIds(state) {
      state.hiddenBlocksIds = [];
    },

    setUserInfo(state, info) {
      state.userInfo = info;
    },

    getUserInfo(state) {
      return state.userInfo;
    },

    deleteUserInfo(state) {
      state.userInfo = {};
    },

    addPageHistory(state, id = state.currentPageId) {
      state.pageHistory.push(id);
      if (state.pageHistory.length > 10) {
        state.pageHistory.splice(0, 1);
      }
    },

    setSidebarCollapse(state, isTrueOrFalse) {
      state.isSidebarCollapse = isTrueOrFalse;
    },
  },
  getters: {
    // 回傳帶入的page的id所取得的所有子集pages ; 帶入''回傳根pages
    childrenPages(state) {
      return (id) => state.pages.filter((page) => page.parentId === id);
    },
    // 回傳帶入的page所取得的父page
    parentPage(state) {
      return (page) => findInStore(state.pages, page.parentId);
    },
    // 回傳帶入的某id所取得的page
    choosePage(state) {
      return (id) => findInStore(state.pages, id);
    },
    // 回傳當前workspace顯示的page
    currentPage(state) {
      return findInStore(state.pages, state.currentPageId);
    },

    searchPages(state) {
      return (str) => (str !== '' ? state.pages.filter((page) => page.name.includes(str)) : null);
    },
    // 回傳當前page裡面包含的所有blocks
    currentBlocks(state, getters) { // 這邊的問題 應該讓所有block(包含子block)單純放page裡面
      return getters.currentPage.blocks.map((itemId) => findInStore(state.blocks, itemId));
    },
    // 回傳當前page裡面包含的所有blocks的id的陣列
    currentBlocksIds(state, getters) {
      return getters.currentPage.blocks;
    },
    // 回傳帶入的某id所取得的block
    chooseBlock(state) {
      return (id) => findInStore(state.blocks, id);
    },
    // 回傳帶入的block的id所取得的所有子集blocks ; 帶入''回傳當前頁有的根blocks
    childrenCurrentBlocks(state, getters) {
      return (id) => getters.currentBlocks.filter((block) => block.parentId === id);
    },
    // 回傳當前page裡面被選中的block
    currentFocusBlock(state, getters) {
      return findInStore(getters.currentBlocks, state.currentFocusBlockId);
    },

    searchBlocks(state) {
      return (str) => (str !== '' ? state.blocks.filter((block) => block.content.includes(str)) : null);
    },

    getPageByBlockId(state) {
      return (blockId) => state.pages.find((page) => page.blocks.includes(blockId));
    },

    getGroupByBlock(state) {
      return (block) => findInStore(state.groups, block.group);
    },

    getIndexFromGroupByBlock(state) {
      return (block) => findInStore(state.groups, block.group).value.indexOf(block.id);
    },

    getGroups(state) {
      return state.groups;
    },

    isIdInHiddenBlocksIds(state) {
      return (id) => state.hiddenBlocksIds.includes(id);
    },

    allPagesIds(state) {
      const allIds = [];
      state.pages.forEach((page) => {
        allIds.push(page.id);
      });
      return allIds;
    },

    allBlocksIds(state) {
      const allIds = [];
      state.blocks.forEach((block) => {
        allIds.push(block.id);
      });
      return allIds;
    },

    selectDistinctPageHistory(state) {
      return new Set(state.pageHistory);
    },

    getPageNameListInHistory(state, getters) {
      const pageNameList = [];
      getters.selectDistinctPageHistory.forEach((id) => {
        pageNameList.push(getters.choosePage(id).name);
      });
      return pageNameList;
    },

    // isUserInfoExist(state) {
    //   // eslint-disable-next-line no-unneeded-ternary
    //   return state.userInfo.email;
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

    changeCurrentPage(store, id) {
      if (id === store.state.currentPageId) return;
      store.commit('setCurrentPageId', id);
      store.commit('addPageHistory', id);
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
        type: 'page',
        page: parentPage,
        value: id,
      });
    },
    // 添加block到某page，須帶入參數含
    addBlock(store, {
      page,
      type = 'p',
      id = (new Date().getTime() + 3).toString(),
      value = '',
      blocks = [],
      parentId = '',
      group = '',
    }) {
      const newBlock = {
        id,
        type,
        content: value,
        blocks,
        parentId,
        group,
      };
      store.commit('addBlock', newBlock);

      // 此段處理block的id被加入某page中的blocks陣列裡的某位置
      const thisPage = page || findInStore(store.state.pages, store.state.currentPageId);
      const isSelect = store.state.currentFocusBlockId !== '';
      const index = thisPage.blocks.indexOf(store.state.currentFocusBlockId);
      store.commit('addIdToBlocksOfPage', {
        page: thisPage,
        blockId: id,
        index: isSelect ? index + 1 : undefined,
      });

      store.commit('changeFocusBlock', id);
    },

    // 增加子block
    addBlockInside(store, block) {
      const parentBlock = block;

      const id = new Date().getTime().toString(); // 創一個新的blockId

      store.dispatch('addBlock', {
        type: 'p',
        id,
        parentId: parentBlock.id,
      });

      store.commit('addIdToBlocksOfBlock', {
        block: parentBlock,
        blockId: id,
      });
    },

    addBlockInGroup(store, { type, groupId }) {
      const blockId = (new Date().getTime() + 3).toString();
      const newGroupId = groupId || (new Date().getTime() + 5).toString();

      store.dispatch('addBlock', {
        type,
        id: blockId,
        group: newGroupId,
      });

      store.commit('addIdToGroup', {
        groupId: newGroupId,
        id: blockId,
      });
    },

    moveIdInBlocksOfPage(store, { page, blockId, index }) {
      store.commit('deleteIdToBlocksOfPage', {
        page,
        blockId,
      });
      store.commit('addIdToBlocksOfPage', {
        page,
        blockId,
        index,
      });
    },

    deleteBlock(store, { containPage, block }) {
      const page = containPage || findInStore(store.state.pages, store.state.currentPageId);
      const thisBlock = block || findInStore(store.state.blocks, store.state.currentFocusBlockId);

      // 如果刪除的block是包在某父集block裡面的情況，就刪除父集block屬性blocks中的對應ID
      if (thisBlock.parentId !== '') {
        const parentBlock = findInStore(store.state.blocks, thisBlock.parentId);
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

      if (thisBlock.group !== '') { // 如果此block有包含在某個group，就把group中此id刪除
        store.commit('deleteIdToGroup', {
          groupId: thisBlock.group,
          id: thisBlock.id,
        });
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
          containPage: findInStore(store.state.pages, item.parentId),
          block: store.state.blocks.find((block) => block.content === item.id),
        });
      }
      store.commit('deletePage', item);

      const childrenPages = store.state.pages.filter((page) => page.parentId === item.id);
      if (childrenPages && childrenPages.length !== 0) {
        childrenPages.forEach((page) => store.dispatch('deletePageWithIcon', page));
      }
    },

    goBlockPosition(store, { page, block }) {
      store.dispatch('changeCurrentPage', page.id);
      store.commit('changeFocusBlock', block.id);
    },

    deleteIdsToGroup(store, { groupId, ids }) {
      ids.forEach((id) => {
        store.commit('deleteIdToGroup', {
          groupId,
          id,
        });
      });
    },

    changeGroupIdFromBlocksIds(store, { blocksIds, groupId }) {
      blocksIds.forEach((blockId) => {
        store.commit('changeGroupIdFromBlockId', {
          blockId,
          groupId,
        });
      });
    },
  },
  modules: {
  },
});
