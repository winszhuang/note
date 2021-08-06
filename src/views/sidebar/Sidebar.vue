/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
<template>
  <Modal v-if="isShow"
        @close="handleShow(false)"
        :mode="'component'"
        :container-class="'search-container'"
        :is-bg-static="false">
    <template #component>
      <Search @close="handleShow(false)"/>
    </template>
  </Modal>
  <div :class="{ sidebar: true, 'sidebar-float': isSidebarFloating }"
          :style="{ width: isSidebarCollapse === true ? '0' : `${sidebarWidth}px` }">
      <UserField/>
      <Splitter :class-name="'splitter'"
          v-if="!isSidebarFloating"
          @getMouseOffset="setSidebarWidth"
          @stopMouseMove="setPrevSidebarWidth"/>
      <div class="field-title">通用 :</div>
      <div class="customlist-group">
        <div class="customlist-group-item"
              type="button"
              @click="handleShow(true)">
          <div class="customlist-item-1 ms-4" style="margin-left: 1rem;">
            <font-awesome-icon
                :icon="['fas', 'search']" />
          </div>
          <div class="customlist-item-6 block-name ">關鍵字搜尋</div>
        </div>
        <div class="customlist-group-item"
              type="button">
          <div class="customlist-item-1 ms-4" style="margin-left: 1rem;">
            <font-awesome-icon
                :icon="['fas', 'adjust']" />
          </div>
          <div class="customlist-item-6 block-name ">編輯區塊樣式</div>
        </div>
      </div>
      <div class="scollitem">
        <!-- <div v-if="currentPage">
          {{ currentPage.blocks }}
        </div> -->
        <div class="field-title">頁面 :</div>
        <div class="customlist-group">
          <CustomList
            v-for="item in rootPages"
            :key="item.id"
            :page="item"/>
          <div class="customlist-group-item addpage-small"
              type="button"
              @click="addPage">
              <div class="ms-4 customlist-item-1">+</div>
              <div class="customlist-item-6">增加頁面</div>
          </div>
        </div>
        <div class="field-title">區塊 :</div>
        <div class="customlist-group">
          <div class="customlist-group-item"
                type="button"
                v-for="item in blocktype"
                :key="item.type"
                @click="checkBlockTypeThenAdd(item.type)">
            <div class="customlist-item-1 ms-4">
              <font-awesome-icon
                  :icon="[transStyleToFAPrefix(item.style),
                    item.icon || 'heading']" :size="item.size || 'xs'"/>
              <!-- {{ item.type }} -->
            </div>
            <div class="customlist-item-6 block-name">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div class="sidebar-footer">
        <div class="addpage" type="button" @click="addPage">
          <div class="addpage-text">+ 新頁面</div>
        </div>
      </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import {
  toRefs, computed, onMounted, watch, ref, // reactive watch
} from 'vue';
import UserField from './UserField.vue';
import CustomList from '../../components/CustomList.vue';
import Modal from '../../components/Modal.vue';
import Search from '../Search.vue';
import Splitter from '../../components/Splitter.vue';
import commonBlockEffect from '../../components/commonBlockEffect';
import { showEffect, generateRandomString } from '../../components/commonEffect';

const DEFAULT_SIDEBAR_WIDTH = 300;

const useSidebarWidthEffect = (minWidth, maxWidth) => {
  const store = useStore();
  const sidebarWidth = ref(0);
  const prevSidebarWidth = ref(0);

  const getSidebarWidthInRange = (offset) => {
    sidebarWidth.value = prevSidebarWidth.value + offset.x;
    if (sidebarWidth.value > maxWidth) sidebarWidth.value = maxWidth;
    if (sidebarWidth.value < minWidth) sidebarWidth.value = minWidth;
    return sidebarWidth.value;
  };

  const setSidebarWidth = (offset) => {
    sidebarWidth.value = getSidebarWidthInRange(offset);
  };

  const setPrevSidebarWidth = () => {
    prevSidebarWidth.value = sidebarWidth.value;
  };

  onMounted(() => {
    sidebarWidth.value = DEFAULT_SIDEBAR_WIDTH;
    prevSidebarWidth.value = DEFAULT_SIDEBAR_WIDTH;
  });

  watch(sidebarWidth, (curr) => {
    store.commit('setCurrentSidebarWidth', curr);
  }, { immediate: true });

  return {
    setSidebarWidth,
    setPrevSidebarWidth,
    sidebarWidth,
    prevSidebarWidth,
  };
};

const useSidebarStateEffect = () => {
  const store = useStore();
  const breakpoint = { value: '' };
  const windowWidth = computed(() => store.state.windowWidth);
  const isSidebarCollapse = computed(() => store.state.sidebarState.isCollapse);
  const isSidebarFloating = computed(() => store.state.sidebarState.isFloating);
  const { isShow, handleShow } = showEffect();

  onMounted(() => {
    handleShow(false);
    if (window.innerWidth < 992) {
      breakpoint.value = 'sm';
    } else {
      breakpoint.value = 'lg';
    }
  });

  watch(() => windowWidth.value, (curr) => {
    if (curr === '') return;
    if (curr < 992) {
      if (breakpoint.value === 'sm') return;
      breakpoint.value = 'sm';
      console.log(isSidebarCollapse.value, isSidebarFloating.value);
      store.dispatch('floatSidebar');
    } else {
      if (breakpoint.value === 'lg') return;
      breakpoint.value = 'lg';
      console.log(isSidebarCollapse.value, isSidebarFloating.value);
      store.dispatch('lockSidebar');
    }
  });

  return {
    isShow,
    handleShow,
    isSidebarCollapse,
    isSidebarFloating,
  };
};

const addBlockEffect = () => {
  const store = useStore();
  const { blocktype } = toRefs(store.state);
  const { currentPageId } = toRefs(store.state.pages);
  const { Block } = commonBlockEffect();

  const addBlockFlow = (block) => {
    const currentFocusBlock = computed(() => store.getters['blocks/currentFocusBlock']);
    if (currentFocusBlock.value) {
      const focusBlockIndex = computed(() => store.getters['blocks/getIndexByBlockId'](currentFocusBlock.value.id));
      // console.log(focusBlockIndex.value);
      store.dispatch('blocks/addBlockAndSetFocusBlockId', { block, index: focusBlockIndex.value + 1 });
    } else {
      store.dispatch('blocks/addBlockAndSetFocusBlockId', { block, index: undefined });
    }
  };

  const addTextTypeBlockFlow = (type) => {
    const block = new Block(type).addContent({ text: '', html: '' });
    addBlockFlow(block);
  };

  const addMediaTypeBlockFlow = (type) => {
    const block = new Block(type).addContent({ url: '', compressionWidth: '' });
    addBlockFlow(block);
  };

  const addCheckBoxTypeBlockFlow = (type) => {
    const block = new Block(type).addContent({ text: '', html: '', isChecked: false });
    addBlockFlow(block);
  };

  const addToggleTypeBlockFlow = (type) => {
    const block = new Block(type).addContent({ text: '', html: '', isHidden: false });
    addBlockFlow(block);
  };

  const addPageTypeBlockFlow = (type) => {
    const innerPageId = generateRandomString();

    store.commit('pages/addPage', {
      id: innerPageId,
      name: 'untitle',
      blocks: [],
      parentId: currentPageId.value,
      createdTime: new Date().getTime().toString(),
      editTime: new Date().getTime().toString(),
      tags: [],
      cover: '',
    });

    const block = new Block(type).addContent(innerPageId);
    store.dispatch('blocks/addBlock', { block });
  };

  const checkBlockTypeThenAdd = (type = 'p') => {
    if (currentPageId.value === '') {
      console.log('請先選擇頁面');
      return;
    }

    if (!blocktype.value.find((item) => item.type === type)) {
      console.log('沒有此type類型');
      return;
    }

    const actions = {
      page: addPageTypeBlockFlow,
      h1: addTextTypeBlockFlow,
      h2: addTextTypeBlockFlow,
      h3: addTextTypeBlockFlow,
      p: addTextTypeBlockFlow,
      quote: addTextTypeBlockFlow,
      numberItem: addTextTypeBlockFlow,
      bulletItem: addTextTypeBlockFlow,
      codeEditor: addTextTypeBlockFlow,

      img: addMediaTypeBlockFlow,
      video: addMediaTypeBlockFlow,

      todoItem: addCheckBoxTypeBlockFlow,

      toggleList: addToggleTypeBlockFlow,

      dividingLine: () => addBlockFlow(new Block(type)),
    };

    actions[type](type);
  };

  return {
    checkBlockTypeThenAdd,
  };
};

export default {
  name: 'Sidebar',
  components: {
    UserField,
    CustomList,
    Modal,
    Search,
    Splitter,
  },
  setup() {
    const store = useStore();
    const rootPages = computed(() => store.getters['pages/childrenPages'](''));
    const { blocktype } = toRefs(store.state);
    const {
      setSidebarWidth,
      setPrevSidebarWidth,
      sidebarWidth,
    } = useSidebarWidthEffect(220, 420);
    const {
      isShow,
      handleShow,
      isSidebarCollapse,
      isSidebarFloating,
    } = useSidebarStateEffect();

    const { checkBlockTypeThenAdd } = addBlockEffect();

    const transStyleToFAPrefix = (style) => `fa${style.charAt(0)}`;

    const addPage = () => {
      store.commit('pages/addPage');
    };

    return {
      rootPages,
      blocktype,
      addPage,
      checkBlockTypeThenAdd,
      transStyleToFAPrefix,
      isShow,
      handleShow,
      isSidebarCollapse,
      isSidebarFloating,
      sidebarWidth,
      setSidebarWidth,
      setPrevSidebarWidth,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/component/_sidebar.scss';
@import '../../style/component/_customlist-group.scss';
.search-container{
  width: 30%;
  height: 50%;
}

.splitter{
  position: absolute;
  right: -0.4rem;
  top: 73px;
  bottom: 35px;
  width: .7rem;
  // background: rgb(235, 78, 78);
  z-index: 10;
  &:hover{
    cursor: col-resize;
  }
}

// .caret-right{
//   margin-right: .3rem;
// }

.block-name{
  padding-top: .05rem;
}

</style>
