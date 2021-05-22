import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusSquare, faFile, faImages } from '@fortawesome/free-regular-svg-icons';
import { faGooglePlusSquare, faFacebookSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
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
} from '@fortawesome/free-solid-svg-icons';

import 'bootstrap';

import H1 from './components/blocks/H1.vue';
import H2 from './components/blocks/H2.vue';
import H3 from './components/blocks/H3.vue';
import Img from './components/blocks/Img.vue';
import Page from './components/blocks/Page.vue';
import Video from './components/blocks/Video.vue';
import P from './components/blocks/P.vue';
import NumberList from './components/blocks/NumberList.vue';
import BulletList from './components/blocks/BulletList.vue';
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

library.add(faGooglePlusSquare);
library.add(faFacebookSquare);
library.add(faTwitterSquare);

createApp(App).component('font-awesome-icon', FontAwesomeIcon)
  .component('H1', H1)
  .component('H2', H2)
  .component('H3', H3)
  .component('P', P)
  .component('Img', Img)
  .component('Page', Page)
  .component('Video', Video)
  .component('NumberList', NumberList)
  .component('BulletList', BulletList)
  .use(store)
  .use(router)
  .mount('#app');
