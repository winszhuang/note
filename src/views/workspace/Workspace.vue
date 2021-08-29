<template>
  <BlockStyleEditor @hiddenStyleEditor="hiddenStyleEditor"
      :is-show="isShowBlockStyleEditor"/>
  <main class="mainspace"
      @mousemove="toggleFloatSidebar($event)">
    <div class="workspace" v-if="currentPage" @mousedown="clickActions($event)">
      <Header :currentPage="currentPage"/>
      <div class="content">
        <AreaSelect :work-area="'.content'"/>
        <!-- <StyleTool/> -->
        <div class="title">
          <PageEditable
              :page="currentPage"
              :key="currentPage.id"
              :placeholder="'請輸入標題'"
              :className="'title-input'"/>
          <!-- <div class="prefix-line"></div> -->
        </div>
        <PageInfo :page="currentPage"/>
        <div class="blockcontent" v-if="currentBlocks">
          <!-- <div class="fixblock" id="fixblock"></div> -->
          <template v-for="(block) in currentBlocks" :key="block.id">
            <Block :block="block" :is-selected="isBlockSelected(block.id)"
                  :is-under-mouse-on-drag="currentIdUnderTheMouse === block.id
                        && !dragStartIds.includes(block.id)"
                  v-show="!hiddenBlocksIds.includes(block.id)"
                  @showBlockStyleEditor="clickBlockStyleEditorIconAction(block)"
                  @drop="dropActions"
                  @dragenter="cancelDefault"
                  @dragover="handleBeforeDrop"/>
          </template>
          <!-- {{ dragStartIds }} -->
        </div>

        <!--測試用-->
        <!-- <hr>
        <div v-if="hiddenBlocksIds">
          <div>hiddenBlocksIds:
            {{ hiddenBlocksIds }}
          </div>
        </div>
        <hr>
        <div v-if="currentPage">
          <hr>
          <div>currentFocusBlockId: {{ currentFocusBlockId }}</div>
          <hr>
          <div>clipboardBlocksIds: {{ clipboardBlocksIds }}</div>
          <hr>
          <div>selectedBlocksIds: {{ selectedBlocksIds }}</div>
          <hr>
          <div v-if="currentFocusBlock">
            <div>currentFocusBlock: </div>
            <ul>
              <li style="width: 400px; overflow: hidden; text-overflow: ellipsis;">
                content ------ {{ currentFocusBlock.content }}</li>
              <li>type ------ {{ currentFocusBlock.type }}</li>
              <li>id ------ {{ currentFocusBlock.id }}</li>
              <li>parentId ------ {{ currentFocusBlock.parentId }}</li>
              <li>blocks ------ {{ currentFocusBlock.blocks }}</li>
              <li>check ------ {{ currentFocusBlock.check }}</li>
              <hr>
            </ul>
          </div>
        </div>
        <hr>
        <div>currentBlocks: </div>
        <div v-if="currentBlocks.length">
          <div
            v-for="block in currentBlocks"
            :key="block.id">
            <ul>
              <li style="width: 400px; overflow: hidden; text-overflow: ellipsis;">
                content ------ {{ block.content }}</li>
              <li>className ------ {{ block.className }}</li>
              <li>type ------ {{ block.type }}</li>
              <li>id ------ {{ block.id }}</li>
              <li>parentId ------ {{ block.parentId }}</li>
              <li>blocks ------ {{ block.blocks }}</li>
              <hr>
            </ul>
          </div>
        </div> -->
        <!--測試用-->

      </div>
    </div>
    <FrontPage v-else/>
  </main>
</template>

<script>
import {
  computed, toRefs, ref, watch, nextTick, onMounted,
} from 'vue';
import { useStore } from 'vuex';
import commonUpdateEffect from '../commonUpdataEffect';
import commonDomEffect from '../../components/commonDomEffect';
// import commonBlockEffect from '../../components/commonBlockEffect';
import Header from './header/Header.vue';
import Block from '../../components/Block.vue';
import AreaSelect from '../../components/AreaSelect.vue';
import PageEditable from '../../components/input/PageEditable.vue';
// import StyleTool from '../../components/StyleTool.vue';
import PageInfo from './PageInfo.vue';
import BlockStyleEditor from '../../components/BlockStyleEditor.vue';
import FrontPage from './FrontPage.vue';
import watchStoreEffect from '../../store/watchStoreEffect';
import updateIDsEffectByDragDrop from '../../components/updateIDsEffectByDragDrop';

const useKeyDownEffectWithBlocks = () => {
  const store = useStore();
  const selectedBlocksIds = computed(() => store.state.blocks.selectedBlocksIds);
  const hasSelectedBlocks = () => (!!selectedBlocksIds.value?.length);

  const {
    pasteBlocksAction,
    setClipboardBlocks,
    setSelectedBlocksInClipboardBlocks,
    deleteSelectedBlocks,
    duplicateBlocksFromSelectedBlocks,
  } = commonUpdateEffect();

  const handleBlocksByPaste = (e) => {
    if (selectedBlocksIds.value.length) {
      pasteBlocksAction(e);
    }
  };

  const handleBlocksByKeyDown = (e) => {
    const setClipboardText = (text) => navigator.clipboard.writeText(text);

    if (e.ctrlKey && e.key === 'c') {
      console.log(hasSelectedBlocks());
      if (hasSelectedBlocks()) {
        setClipboardText('');
        e.preventDefault();
        setSelectedBlocksInClipboardBlocks();
        console.log('8888888888888');
      } else {
        setClipboardBlocks([]);
      }
      document.activeElement.blur();
    }

    if (hasSelectedBlocks() && (e.key === 'Backspace' || e.key === 'Delete')) {
      e.preventDefault();
      deleteSelectedBlocks(e);
      document.activeElement.blur();
    }

    if (hasSelectedBlocks() && e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      duplicateBlocksFromSelectedBlocks();
      document.activeElement.blur();
    }
  };

  const executeKeydownListeningWithBlocks = () => {
    window.addEventListener('keydown', handleBlocksByKeyDown);
    window.addEventListener('paste', handleBlocksByPaste);
  };

  return { executeKeydownListeningWithBlocks };
};

const useDragDropBlocksEffect = () => {
  const store = useStore();

  const dragStartIds = computed(() => store.state.dragStartIds);
  const currentBlocksIds = computed(() => store.getters['blocks/currentBlocksIds']);

  const {
    ids,
    currentIdUnderTheMouse,
    cancelDefault,
    handleDrop,
    handleBeforeDrop,
  } = updateIDsEffectByDragDrop(currentBlocksIds,
    (e) => e.target.closest('.block').dataset.blockId,
    () => dragStartIds.value);

  const dropActions = (e) => {
    handleDrop(e, () => {
      store.commit('setDragStartIds', []);
    });
  };

  watch(() => ids.value, (curr) => {
    store.commit('pages/editPageData', { key: 'blocks', value: [...curr] });
  }, { deep: true });

  watch(currentIdUnderTheMouse, (curr) => {
    store.commit('setIframeActive', curr === '');
  });

  return {
    cancelDefault,
    handleBeforeDrop,
    dropActions,
    dragStartIds,
    currentIdUnderTheMouse,
  };
};

const useClickEffectInWorkspace = (hiddenStyleEditor) => {
  const store = useStore();
  const currentBlocks = computed(() => store.getters['blocks/currentBlocks']);
  const { isMouseUnderTheElement } = commonDomEffect();

  const clickActionInContent = (e) => {
    const finalBlock = currentBlocks.value[currentBlocks.value.length - 1];
    if (!finalBlock) {
      e.preventDefault();
      store.dispatch('blocks/addBlockAndSetFocusBlockId', {});
      return;
    }

    const finalBlockDom = document.querySelector(`[data-block-id="${finalBlock.id}"]`);
    if (isMouseUnderTheElement(finalBlockDom, e)) {
      e.preventDefault();

      const finalBlockEditable = finalBlockDom.querySelector('[contenteditable]');
      if (!finalBlockEditable) {
        store.dispatch('blocks/addBlockAndSetFocusBlockId', {});
        return;
      }

      if (finalBlock.content.text === '') {
        finalBlockEditable.focus();
        return;
      }

      store.dispatch('blocks/addBlockAndSetFocusBlockId', {});
    }
  };

  const clickActions = (e) => {
    const el = e.target;
    if (!el.closest('.workspace')) return;
    if (el.closest('.blockcontent')) {
      clickActionInContent(e);
      return;
    }
    store.commit('blocks/setFocusBlockById', '');
    store.commit('blocks/setSelectedBlocksIds', []);
    hiddenStyleEditor();
  };

  return {
    clickActions,
  };
};

const useBlockStyleEditorEffect = () => {
  const store = useStore();
  const selectedBlocksIds = computed(() => store.state.blocks.selectedBlocksIds);

  const isShowBlockStyleEditor = ref(false);

  const clickBlockStyleEditorIconAction = (block) => {
    isShowBlockStyleEditor.value = true;
    // console.log(selectedBlocksIds.value);
    if (selectedBlocksIds.value.length === 0) {
      store.commit('blocks/addIdToSelectedBlocksIds', block.id);
      return;
    }
    if (!selectedBlocksIds.value.find((id) => id === block.id)) {
      store.commit('blocks/setSelectedBlocksIds', []);
      store.commit('blocks/addIdToSelectedBlocksIds', block.id);
    }
  };

  const hiddenStyleEditor = () => {
    isShowBlockStyleEditor.value = false;
  };

  return {
    isShowBlockStyleEditor,
    clickBlockStyleEditorIconAction,
    hiddenStyleEditor,
  };
};

export default {
  name: 'Workspace',
  components: {
    Header,
    Block,
    AreaSelect,
    PageEditable,
    PageInfo,
    BlockStyleEditor,
    FrontPage,
  },
  setup() {
    const store = useStore();

    const {
      updatePagesToLSByWatching,
      updateBlocksToLSByWatching,
      storeObserver,
    } = watchStoreEffect();

    updatePagesToLSByWatching();
    updateBlocksToLSByWatching();
    storeObserver();

    const { executeKeydownListeningWithBlocks } = useKeyDownEffectWithBlocks();
    executeKeydownListeningWithBlocks();

    const {
      cancelDefault,
      handleBeforeDrop,
      dropActions,
      dragStartIds,
      currentIdUnderTheMouse,
    } = useDragDropBlocksEffect();

    const currentPage = computed(() => store.getters['pages/currentPage']);
    const currentBlocks = computed(() => store.getters['blocks/currentBlocks']);
    const currentFocusBlock = computed(() => store.getters['blocks/currentFocusBlock']);
    const isSidebarFloating = computed(() => store.state.sidebarState.isFloating);
    const selectedBlocksIds = computed(() => store.state.blocks.selectedBlocksIds);
    const clipboardBlocks = computed(() => store.state.blocks.clipboardBlocks);
    const clipboardBlocksIds = computed(() => store.getters['blocks/getClipboardBlocksIds']);
    const isBlockSelected = (id) => computed(() => store.getters['blocks/isBlockSelected'](id)).value;

    const {
      currentFocusBlockId, hiddenBlocksIds, // pages, blocks,
    } = toRefs(store.state.blocks);

    const {
      isShowBlockStyleEditor,
      clickBlockStyleEditorIconAction,
      hiddenStyleEditor,
    } = useBlockStyleEditorEffect();

    const {
      clickActions,
    } = useClickEffectInWorkspace(hiddenStyleEditor);

    const toggleFloatSidebar = (e) => {
      if (isSidebarFloating.value === false) return;
      if (e.clientX < 45) {
        store.commit('setSidebarCollapse', false);
      } else {
        store.commit('setSidebarCollapse', true);
      }
    };

    const isWindowWidthLarge = () => window.innerWidth > 992;

    const initSidebarState = () => {
      if (isWindowWidthLarge()) {
        store.dispatch('lockSidebar');
      }
    };

    onMounted(() => {
      window.addEventListener('resize', () => {
        if (!isWindowWidthLarge() && isSidebarFloating.value === false) {
          store.dispatch('floatSidebar');
        }
      });

      initSidebarState();

      watch( // 監聽是否切換到其他元素
        currentFocusBlockId,
        (curr, prev) => {
          nextTick(() => {
            if (!curr) return;

            const getContenteditable = (el) => el.querySelector('[contenteditable]');

            const getEditableElementById = (id) => {
              const el = document.querySelector(`[data-block-id="${id}"]`);
              if (!el) return null;
              if (getContenteditable(el)) return getContenteditable(el);
              return null;
            };

            const setCursorToEnd = (el) => {
              const range = window.getSelection();
              range.selectAllChildren(el);
              range.collapseToEnd();
            };

            const currFocusDom = getEditableElementById(curr);
            const prevFocusDom = getEditableElementById(prev);

            if (!currFocusDom) return;
            currFocusDom.focus();
            setCursorToEnd(currFocusDom);

            if (!prevFocusDom) return;
            prevFocusDom.placeholder = '';
          });
        },
      );
    });

    // onMounted(() => {
    //   let breakpoint = '';

    //   if (window.innerWidth < 992) {
    //     breakpoint = 'sm';
    //     store.commit('setSidebarCollapse', true);
    //     store.commit('setSidebarFloating', true);
    //   } else {
    //     breakpoint = 'lg';
    //     console.log('1');
    //     store.commit('setSidebarFloating', false);
    //     store.commit('setSidebarCollapse', true);
    //   }
    //   store.commit('setWindowWidth', window.innerWidth);

    //   window.addEventListener('resize', () => {
    //     store.commit('setWindowWidth', window.innerWidth);
    //   });

    //   watch(() => windowWidth.value, (curr) => {
    //     if (curr === '') return;
    //     if (curr < 992) {
    //       if (breakpoint.value === 'sm') return;
    //       breakpoint.value = 'sm';
    //       // console.log(isSidebarCollapse.value, isSidebarFloating.value);
    //       store.dispatch('floatSidebar');
    //     } else {
    //       console.log('2');
    //       if (breakpoint.value === 'lg') return;
    //       breakpoint.value = 'lg';
    //       // console.log(isSidebarCollapse.value, isSidebarFloating.value);
    //       store.dispatch('lockSidebar');
    //     }
    //   });

    //   watch( // 監聽是否切換到其他元素
    //     currentFocusBlockId,
    //     (curr, prev) => {
    //       nextTick(() => {
    //         if (!curr) return;

    //         const getContenteditable = (el) => el.querySelector('[contenteditable]');

    //         const getEditableElementById = (id) => {
    //           const el = document.querySelector(`[data-block-id="${id}"]`);
    //           if (!el) return null;
    //           if (getContenteditable(el)) return getContenteditable(el);
    //           return null;
    //         };

    //         const setCursorToEnd = (el) => {
    //           const range = window.getSelection();
    //           range.selectAllChildren(el);
    //           range.collapseToEnd();
    //         };

    //         const currFocusDom = getEditableElementById(curr);
    //         const prevFocusDom = getEditableElementById(prev);

    //         if (!currFocusDom) return;
    //         currFocusDom.focus();
    //         setCursorToEnd(currFocusDom);

    //         if (!prevFocusDom) return;
    //         prevFocusDom.placeholder = '';
    //       });
    //     },
    //   );
    // });

    return {
      clickActions,
      currentPage,
      currentBlocks,
      currentFocusBlockId,
      currentFocusBlock,
      selectedBlocksIds,
      hiddenBlocksIds,
      toggleFloatSidebar,
      isShowBlockStyleEditor,
      clickBlockStyleEditorIconAction,
      hiddenStyleEditor,
      isBlockSelected,
      cancelDefault,
      dropActions,
      handleBeforeDrop,
      currentIdUnderTheMouse,
      dragStartIds,
      clipboardBlocks,
      clipboardBlocksIds,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/color.scss';

[v-cloak] {
  display: none;
}

@mixin mainspace {
  // height: 100%;
  // background: #fbfbf6;
  // background: #fffffa;
  // background: #faf9f2;
  // background: #f5f5f5;
  position: relative;
  z-index: 1;
  &::-webkit-scrollbar {
    width: 8px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #faf9f2;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #bebeb9;
    border-radius: 4px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #a3a39e;
  }
}

.mainspace{
  width: 100%;
  position: relative;
  z-index: 1;
  height: 100vh;
  overflow-y: auto;
  // background: #fdfdf8;
  background: rgb(250, 248, 247);
}

.workspace{
  @include mainspace;
  display: flex;
  flex-direction: column;
  border-radius: .2rem;
  box-shadow: 0 0 5px 0 rgb(209, 193, 171);
  height: 100%;
  overflow: auto;
  position: relative;
}

.content{
  flex-grow:1;
  padding: 0 20%;
  padding-bottom: 7rem;
  display: flex;
  flex-direction: column;
  @media (min-width:1100px){
    padding: 0 22%;
  }
  @media (max-width:992px){
    padding: 0 12%;
  }

  transition: padding .3s ease-out;
  // @media (min-width:1200px){
  //   padding: 0 27%;
  // }
}
.blockcontent{
  box-sizing: border-box;
  width: 100%;
  flex-grow: 1;
  min-height: 350px;
  padding-bottom: 10vh;
  &-input{
    width: inherit;
    min-height: 50px;
  }
}

.title{
  position: relative;
  &-input{
    font-family: 'Noto Sans TC', sans-se rif;
    font-weight: 700;
    font-size: 3rem;
    line-height: 3.8rem;
    color: #4d464d;
  }
  .prefix-line{
    position:absolute;
    bottom: -.2rem;
    left: 0;
    width: 2rem;
    height: .3rem;
    background: $web-orange;
    // background: #F3C87A;
  }
}

</style>
