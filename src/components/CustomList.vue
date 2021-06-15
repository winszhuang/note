<template>
  <div class="customlist-group-item customlist-group-item-action"
      type="button"
      :class="{'bg-listhover': page.id === currentPageId }"
      @click="goCurrentPage(page.id)"
      @mouseover="hoverHandle(page.id)"
      @mouseout="hoverHandle('')">

    <div :style="{ 'padding-left': `${count}rem` }"></div> <!--調間距用-->

    <div class="customlist-item icon-button" @click="toggleShow"> <!--切換顯示子集-->
      <font-awesome-icon :icon="caretIcon"/>
    </div>

    <div class="customlist-item">
      <font-awesome-icon :icon="['far', 'file']"/>
    </div>

    <div class="customlist-item">{{ page.name }}</div>

    <div class="customlist-item ms-auto icon-button"
        v-show="page.id === currentPageIdOnMouse"
        @click="deletePage(page)">
      <font-awesome-icon :icon="['fas', 'ellipsis-h']" style="color: #999999" size="sm"/>
    </div>

    <div class="customlist-item icon-button"
        v-show="page.id === currentPageIdOnMouse"
        @click="addPageInside(page)">
      <font-awesome-icon :icon="['far', 'plus-square']" style="color: #999999"/>
    </div>

  </div>

  <div v-show="isShow">
    <template v-if="childrenPages.length !== 0">
      <CustomList
        v-for="item in childrenPages"
        :key="item.id"
        :page="item"
        :number="count+1"
      />
    </template>
    <template v-else>
      <div class="children-list-nopage" :style="{ 'padding-left': `${3.5 + count}rem` }">
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
    const childrenPages = computed(() => store.getters.childrenPages(props.page.id));
    const { currentPageId, currentPageIdOnMouse } = toRefs(store.state);
    const { goCurrentPage } = commonUpdateEffect();
    const { isShow, handleShow, toggleShow } = showEffect();
    const caretIcon = computed(() => (isShow.value ? faCaretRight : faCaretDown));

    // eslint-disable-next-line vue/no-setup-props-destructure
    const count = props.number; // 用來指定目前page是第幾層

    const hoverHandle = (id) => {
      store.commit('changeCurrentPageIdOnMouse', id);
    };

    const addPageInside = (page) => {
      store.dispatch('addPageInside', page);
      handleShow(true);
    };

    const deletePage = (item) => {
      store.dispatch('deletePageWithIcon', item);
    };

    return {
      goCurrentPage,
      childrenPages,
      currentPageId,
      currentPageIdOnMouse,
      deletePage,
      addPageInside,
      hoverHandle,
      count,
      caretIcon,
      isShow,
      toggleShow,
    };
  },
};
</script>

<style lang="scss">
.children-list{
  &-nopage{
    color: #666666;
    font-size: 10px;
    line-height: 1.9rem;;
  }
}
</style>
