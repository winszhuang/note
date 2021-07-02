<template>
  <div class="customlist-group-item"
      type="button"
      :class="{'customlist-group-item-action': page.id === currentPageId }"
      @click="goCurrentPage(page.id)"
      @mouseover="hoverHandle(page.id)"
      @mouseout="hoverHandle('')">

    <div :style="{ 'padding-left': `${number}rem` }"></div> <!--調間距用-->

    <div class="caret-icon customlist-item-1 scale-07 icon-button" @click="toggleShow">
      <font-awesome-icon :icon="caretIcon"/>
    </div>

    <div class="customlist-item-1">
      <font-awesome-icon :icon="['far', 'file']"/>
    </div>

    <div class="customlist-item-name">{{ page.name }}</div>

    <div class="ms-auto icon-button"
        v-show="page.id === currentPageIdOnMouse"
        @click.stop="deletePage(page)">
      <font-awesome-icon :icon="['far', 'minus-square']" style="color: #999999" size="sm"/>
    </div>

    <div class="icon-button"
        v-show="page.id === currentPageIdOnMouse"
        @click.stop="addPageInside(page)">
      <font-awesome-icon :icon="['far', 'plus-square']" style="color: #999999"/>
    </div>

  </div>

  <div v-show="isShow">
    <template v-if="childrenPages.length !== 0">
      <CustomList
        v-for="item in childrenPages"
        :key="item.id"
        :page="item"
        :number="number+1"
      />
    </template>
    <template v-else>
      <div class="children-list-nopage" :style="{ 'padding-left': `${3.5 + number}rem` }">
        沒有頁面
      </div>
    </template>
  </div>
</template>

<script>
import {
  toRefs, computed, // onMounted
} from 'vue';
import { useStore } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCaretRight, faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import commonUpdateEffect from '../views/commonUpdataEffect';
import { showEffect } from './commonEffect';

export default {
  name: 'CustomList',
  components: {
    FontAwesomeIcon,
  },
  props: {
    page: {
      type: Object,
    },
    number: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const store = useStore();
    const childrenPages = computed(() => store.getters['pages/childrenPages'](props.page.id));
    const { currentPageId, currentPageIdOnMouse } = toRefs(store.state.pages);
    const { goCurrentPage } = commonUpdateEffect();
    const { isShow, handleShow, toggleShow } = showEffect();
    const caretIcon = computed(() => (isShow.value ? faCaretRight : faCaretDown));

    const hoverHandle = (id) => {
      store.commit('pages/changeCurrentPageIdOnMouse', id);
    };

    const addPageInside = (page) => {
      store.dispatch('pages/addPageInside', page);
      handleShow(true);
    };

    const deletePage = (item) => {
      store.dispatch('pages/deletePageWithIcon', item);
    };

    return {
      goCurrentPage,
      childrenPages,
      currentPageId,
      currentPageIdOnMouse,
      deletePage,
      addPageInside,
      hoverHandle,
      // count,
      caretIcon,
      isShow,
      toggleShow,
    };
  },
};
</script>

<style lang="scss">
@import '../style/base.scss';
.icon-button{
  width: 1.5rem;
  text-align: center;
  &:hover{
    background:#847786;
    color: #c9c0c2;
  }
}
.children-list{
  &-nopage{
    color: #666666;
    font-size: 10px;
    line-height: 1.9rem;;
  }
}
.caret-icon{
  width: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
