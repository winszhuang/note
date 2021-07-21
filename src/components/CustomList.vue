<template>
  <div class="customlist-group-item"
      type="button"
      :class="{'customlist-group-item-action': page.id === currentPageId }"
      @click="goCurrentPage(page.id)"
      @mouseenter="hoverHandle(true)"
      @mouseleave="hoverHandle(false)">

    <div :style="{ 'padding-left': `${number}rem` }"></div> <!--調間距用-->

    <div class="caret-icon customlist-item-1 scale-07 icon-button" @click="toggleShow">
      <font-awesome-icon :icon="caretIcon"/>
    </div>

    <div class="customlist-item-1">
      <font-awesome-icon :icon="['far', 'file']"/>
    </div>

    <div class="customlist-item-name">{{ page.name }}</div>

    <div class="ms-auto icon-button"
        v-show="isHover"
        @click.stop="deletePage(page)">
      <font-awesome-icon :icon="['far', 'minus-square']" style="color: #999999" size="sm"/>
    </div>

    <div class="icon-button"
        v-show="isHover"
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
  toRefs, computed, ref, // onMounted
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
    const { currentPageId } = toRefs(store.state.pages);
    const { goCurrentPage } = commonUpdateEffect();
    const { isShow, handleShow, toggleShow } = showEffect();
    const caretIcon = computed(() => (isShow.value ? faCaretRight : faCaretDown));

    const addPageInside = (page) => {
      store.dispatch('pages/addPageInside', page);
      handleShow(true);
    };

    const deletePage = (item) => {
      store.dispatch('pages/deletePageWithIcon', item);
    };

    const isHover = ref(false);
    const hoverHandle = (isTrueOrFalse) => {
      isHover.value = isTrueOrFalse;
    };

    return {
      goCurrentPage,
      childrenPages,
      currentPageId,
      deletePage,
      addPageInside,
      hoverHandle,
      isHover,
      caretIcon,
      isShow,
      toggleShow,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../style/base.scss';
@import '../style/component/_customlist-group.scss';
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
