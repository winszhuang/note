/* eslint-disable no-undef */
import { createStore } from 'vuex';
import pages from './modules/pages';
import blocks from './modules/blocks';
import groups from './modules/groups';
import userInfo from './modules/userInfo';
import { waitSecondAndCallBack } from '../components/commonEffect';

export default createStore({
  strict: true, // 正式上線的時候關掉
  state: {
    blocktype: [
      {
        type: 'h1',
        icon: 'heading',
        style: 'solid',
        name: '大標題',
        className: 'block-h1',
      },
      {
        type: 'h2',
        icon: 'heading',
        style: 'solid',
        name: '中標題',
        className: 'block-h2',
      },
      {
        type: 'h3',
        icon: 'heading',
        style: 'solid',
        name: '小標題',
        className: 'block-h3',
      },
      {
        type: 'video',
        icon: 'video',
        style: 'solid',
        name: '影片',
        className: 'block-video',
      },
      {
        type: 'img',
        icon: 'images',
        style: 'regular',
        name: '圖片',
        className: 'block-img',
      },
      {
        type: 'p',
        icon: 'font',
        style: 'solid',
        name: '文字片段',
        className: 'block-p',
      },
      {
        type: 'page',
        icon: 'file',
        style: 'regular',
        size: '1x',
        name: '內嵌頁面',
        className: 'block-page',
      },
      {
        type: 'numberItem',
        icon: 'list-ol',
        style: 'solid',
        name: '順序列表',
        className: 'block-number-item',
      },
      {
        type: 'bulletItem',
        icon: 'list-ul',
        style: 'solid',
        name: '無序列表',
        className: 'block-bullet-item',
      },
      {
        type: 'toggleList',
        icon: 'caret-right',
        style: 'solid',
        size: '1x',
        name: '切換列表',
        className: 'block-toggle-list',
      },
      {
        type: 'todoItem',
        icon: 'check-square',
        style: 'regular',
        name: '核取框',
        className: 'block-todo-item',
      },
      {
        type: 'dividingLine',
        icon: 'window-minimize',
        style: 'regular',
        name: '分割線',
        className: 'block-dividing-line',
      },
      {
        type: 'codeEditor',
        icon: 'laptop-code',
        style: 'solid',
        name: '程式碼',
        className: 'block-code-editor',
      },
      {
        type: 'quote',
        icon: 'quote-left',
        style: 'solid',
        name: '引言',
        className: 'block-quote',
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
    sidebarState: {
      isCollapse: '',
      isFloating: '',
      currentWidth: '',
    },
    windowWidth: '',
  },
  mutations: {
    // 把FS的資料全部取到state中
    setStoreData(state, { data, name }) { // 這個放這
      state[name][name] = data;
    },

    setWindowWidth(state, width) {
      state.windowWidth = width;
    },

    setSidebarCollapse(state, isTrueOrFalse) { // 這個留這
      state.sidebarState.isCollapse = isTrueOrFalse;
    },

    setSidebarFloating(state, isTrueOrFalse) {
      state.sidebarState.isFloating = isTrueOrFalse;
    },

    setCurrentSidebarWidth(state, width) {
      state.sidebarState.currentWidth = width;
    },
  },
  getters: {
    getClassNameOfBlockType(state) {
      return (type) => state.blocktype.find((item) => item.type === type).className;
    },
  },
  actions: {
    resetStoreData({ commit }) {
      commit('pages/resetPages', null, { root: true });
      commit('blocks/resetBlocks', null, { root: true });
      commit('groups/resetGroups', null, { root: true });
      // commit('userInfo/resetUserInfo', null, { root: true });
    },

    async floatSidebar({ commit, state }) {
      if (state.sidebarState.isCollapse === false) {
        commit('setSidebarCollapse', true);
      }
      await waitSecondAndCallBack(1.2, () => {
        if (state.sidebarState.isFloating === false) {
          commit('setSidebarFloating', true);
        }
      });
    },

    async lockSidebar({ commit }) {
      await waitSecondAndCallBack(0.5, () => {
        commit('setSidebarFloating', false);
      });
      commit('setSidebarCollapse', false);
    },
  },
  modules: {
    pages,
    blocks,
    groups,
    userInfo,
  },
});
