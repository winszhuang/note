<template>
  <div class="customlist-group-item customlist-group-item-action"
      type="button"
      :class="{'bg-listhover': page.id === currentPageId }"
      @click="goCurrentPage(page.id)"
      @mouseover="hoverHandle(page.id)"
      @mouseout="hoverHandle('')"
  >
    <div :style="{ 'padding-left': `${count*14}px` }"></div> <!--調間距用-->
    <div class="customlist-item icon-button"
        @click="toggleShow()"
    >
      <font-awesome-icon :icon="caretIcon"/>
    </div>
    <div class="customlist-item">
      <font-awesome-icon :icon="['far', 'file']"/>
    </div>
    <div class="customlist-item">{{ page.name }}</div>
    <div class="customlist-item ms-auto icon-button"
        v-show="page.id === currentPageIdOnMouse"
        @click="deletePage(page)"
    >
      <font-awesome-icon :icon="['fas', 'ellipsis-h']" style="color: #999999" size="sm"/>
    </div>
    <div class="customlist-item icon-button"
        v-show="page.id === currentPageIdOnMouse"
        @click="addPageInside(page)"
    >
      <font-awesome-icon :icon="['far', 'plus-square']" style="color: #999999"/>
    </div>
  </div>

  <div v-if="childrenPages.length !== 0" v-show="isShow">
    <CustomList
      v-for="item in childrenPages"
      :key="item.id"
      :page="item"
      :number="count+1"
    />
  </div>
  <div class="children-list-nopage" v-else>
    沒有頁面
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
import commonDomEffect from './commonDomEffect';

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
    const { showEffect } = commonDomEffect();
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
    padding-left: 3rem;
    color: #b3b3b3;
  }
}
</style>
