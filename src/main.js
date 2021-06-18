import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGooglePlusSquare, faFacebookSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import {
  faPlusSquare,
  faFile,
  faClock,
  faImages,
  faCheckSquare,
  faWindowMinimize,
} from '@fortawesome/free-regular-svg-icons';
import {
  faCaretRight,
  faCaretDown,
  faPlus,
  faEllipsisH,
  faExpandArrowsAlt,
  faHeading,
  faVideo,
  faFont,
  faListUl,
  faListOl,
  faTimes,
  faSearch,
  faUserEdit,
  faTags,
  faDatabase,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faSubscript,
  faPalette,
  faSyncAlt,
  faLaptopCode,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faClock as fasClock,
} from '@fortawesome/free-solid-svg-icons';

import 'bootstrap';

import H1 from './components/blocks/H1.vue';
import H2 from './components/blocks/H2.vue';
import H3 from './components/blocks/H3.vue';
import Img from './components/blocks/Img.vue';
import Page from './components/blocks/Page.vue';
import Video from './components/blocks/Video.vue';
import P from './components/blocks/P.vue';
import TodoItem from './components/blocks/TodoItem.vue';
import NumberItem from './components/blocks/NumberItem.vue';
import BulletItem from './components/blocks/BulletItem.vue';
import DividingLine from './components/blocks/DividingLine.vue';
import ToggleList from './components/blocks/ToggleList.vue';
import CodeEditor from './components/blocks/CodeEditor.vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './style/index.scss';

library.add(faCaretRight);
library.add(faCaretDown);
library.add(faPlusSquare);
library.add(faFile);
library.add(faPlus);
library.add(faEllipsisH);
library.add(faExpandArrowsAlt);
library.add(faHeading);
library.add(faImages);
library.add(faVideo);
library.add(faFont);
library.add(faListUl);
library.add(faListOl);
library.add(faTimes);
library.add(faSearch);
library.add(faCheckSquare);
library.add(faWindowMinimize);
library.add(faUserEdit);
library.add(faTags);
library.add(faClock);
library.add(fasClock);
library.add(faDatabase);
library.add(faSyncAlt);
library.add(faLaptopCode);
library.add(faAngleDoubleLeft);
library.add(faAngleDoubleRight);

// 社群圖標
library.add(faGooglePlusSquare);
library.add(faFacebookSquare);
library.add(faTwitterSquare);

// 文字樣式工具
library.add(faBold);
library.add(faItalic);
library.add(faUnderline);
library.add(faStrikethrough);
library.add(faSubscript);
library.add(faPalette);

createApp(App).component('font-awesome-icon', FontAwesomeIcon)
  .component('H1', H1)
  .component('H2', H2)
  .component('H3', H3)
  .component('P', P)
  .component('Img', Img)
  .component('Page', Page)
  .component('Video', Video)
  .component('NumberItem', NumberItem)
  .component('BulletItem', BulletItem)
  .component('TodoItem', TodoItem)
  .component('DividingLine', DividingLine)
  .component('ToggleList', ToggleList)
  .component('CodeEditor', CodeEditor)
  .use(store)
  .use(router)
  .mount('#app');
