/* eslint-disable no-undef */
import { createStore } from 'vuex';
import pages from './modules/pages';
import blocks from './modules/blocks';
import groups from './modules/groups';
import userInfo from './modules/userInfo';

export default createStore({
  strict: true, // 正式上線的時候關掉
  state: {
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
    isSidebarCollapse: '', // 這個放index
  },
  mutations: {
    // 把FS的資料全部取到state中
    setStoreData(state, { data, name }) { // 這個放這
      state[name] = data;
    },

    setSidebarCollapse(state, isTrueOrFalse) { // 這個留這
      state.isSidebarCollapse = isTrueOrFalse;
    },
  },
  modules: {
    pages,
    blocks,
    groups,
    userInfo,
  },
});
