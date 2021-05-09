import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusSquare, faFile } from '@fortawesome/free-regular-svg-icons';
import {
  faCaretRight,
  faCaretDown,
  faPlus,
  faEllipsisH,
  faExpandArrowsAlt,
} from '@fortawesome/free-solid-svg-icons';
import H1 from './components/blocks/H1.vue';
import H2 from './components/blocks/H2.vue';
import H3 from './components/blocks/H3.vue';
import Img from './components/blocks/Img.vue';
import Page from './components/blocks/Page.vue';
import Video from './components/blocks/Video.vue';
import P from './components/blocks/P.vue';
import NumberList from './components/blocks/NumberList.vue';
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

createApp(App).component('font-awesome-icon', FontAwesomeIcon)
  .component('H1', H1)
  .component('H2', H2)
  .component('H3', H3)
  .component('P', P)
  .component('Img', Img)
  .component('Page', Page)
  .component('Video', Video)
  .component('NumberList', NumberList)
  .use(store)
  .use(router)
  .mount('#app');
