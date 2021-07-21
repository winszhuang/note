<template>
  <BlockStyleEditor @hiddenStyleEditor="hiddenStyleEditor"
      :is-show="isShowBlockStyleEditor"/>
  <main class="mainspace"
      @mousemove="toggleFloatSidebar($event)">
    <div class="workspace" v-if="currentPage" @mousedown="clickActions($event)">
      <!-- {{ pageHistory }} -->
      <div class="header">
        <Breadcrumb :page="currentPage"/>
        <div class="update" type="button" @click="updateToFS">
          <div class="update-icon" v-if="!isFSUpdating">
            <font-awesome-icon :icon="['fas', 'database']"/>
          </div>
          <div class="update-icon" v-else>
            <font-awesome-icon :icon="['fas', 'sync-alt']"/>
          </div>
          <div class="update-text">更新到數據庫</div>
        </div>
      </div>
      <div class="content">
        <AreaSelect :work-area="'.content'"/>
        <StyleTool/>
        <div class="title">
          <PageEditable
              :page="currentPage"
              :placeholder="'請輸入標題'"
              :className="'title-input'"/>
          <!-- <div class="prefix-line"></div> -->
        </div>
        <PageInfo :page="currentPage"/>
        <div class="blockcontent" v-if="currentBlocks">
          <template v-for="(block) in currentBlocks" :key="block.id">
            <Block :block="block" :is-selected="isBlockSelected(block.id)"
                  @showBlockStyleEditor="clickBlockStyleEditorIconAction(block)"
                  v-show="!hiddenBlocksIds.includes(block.id)"/>
          </template>
        </div>

        <!--測試用-->
        <hr>
        <template v-if="groups && groups.length !== 0">
          <div v-for="(item) in groups" :key="item.id">
            <div>GroupId ------ {{ item.id }}</div>
            <div>
              Groupvalue ----
              <li v-for="(item) in item.blocks" :key="item">{{ item }}</li>
            </div>
          </div>
        </template>
        <hr>
        <div v-if="hiddenBlocksIds">
          <div>hiddenBlocksIds:
            {{ hiddenBlocksIds }}
          </div>
        </div>
        <hr>
        <div v-if="currentPage">
          <hr>
          <div>currentFocusBlockId: {{ currentFocusBlockId }}</div>
          <div v-if="currentFocusBlock">
            <div>currentFocusBlock: </div>
            <ul>
              <li style="width: 400px; overflow: hidden; text-overflow: ellipsis;">
                content ------ {{ currentFocusBlock.content }}</li>
              <li>type ------ {{ currentFocusBlock.type }}</li>
              <li>id ------ {{ currentFocusBlock.id }}</li>
              <li>parentId ------ {{ currentFocusBlock.parentId }}</li>
              <li>blocks ------ {{ currentFocusBlock.blocks }}</li>
              <li>group ------ {{ currentFocusBlock.group }}</li>
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
              <li>group ------ {{ block.group }}</li>
              <hr>
            </ul>
          </div>
        </div>
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
import Breadcrumb from './Breadcrumb.vue';
import Block from '../../components/Block.vue';
import AreaSelect from '../../components/AreaSelect.vue';
import PageEditable from '../../components/input/PageEditable.vue';
import StyleTool from '../../components/StyleTool.vue';
import PageInfo from './PageInfo.vue';
import BlockStyleEditor from '../../components/BlockStyleEditor.vue';
import FrontPage from './FrontPage.vue';
import { updateStoreToFS } from '../../store/firestore';
import watchStoreEffect from '../../store/watchStoreEffect';

export default {
  name: 'Workspace',
  components: {
    Block,
    Breadcrumb,
    AreaSelect,
    PageEditable,
    StyleTool,
    PageInfo,
    BlockStyleEditor,
    FrontPage,
  },
  setup() {
    const store = useStore();

    const {
      updatePagesToLSByWatching,
      updateBlocksToLSByWatching,
      updateGroupsToLSByWatching,
      storeObserver,
    } = watchStoreEffect();

    updatePagesToLSByWatching();
    updateBlocksToLSByWatching();
    updateGroupsToLSByWatching();
    storeObserver();

    const groups = computed(() => store.state.groups.groups);
    const currentPage = computed(() => store.getters['pages/currentPage']);
    const currentBlocks = computed(() => store.getters['blocks/currentBlocks']);
    const currentFocusBlock = computed(() => store.getters['blocks/currentFocusBlock']);
    const currentBlocksIds = computed(() => store.getters['blocks/currentBlocksIds']);
    const isSidebarFloating = computed(() => store.state.sidebarState.isFloating);
    const selectedBlocksIds = computed(() => store.state.blocks.selectedBlocksIds);
    const isBlockSelected = (id) => computed(() => store.getters['blocks/isBlockSelected'](id)).value;

    const { editPageData, deleteBlockAndDependByPressBackspace } = commonUpdateEffect();
    const {
      currentFocusBlockId, hiddenBlocksIds, // pages, blocks,
    } = toRefs(store.state.blocks);

    const deleteSelectedBlocks = (e) => {
      if (selectedBlocksIds.value.length === 0) return;
      if (e.keyCode !== 8) return;
      e.preventDefault();
      selectedBlocksIds.value.forEach((blockId) => {
        const block = computed(() => store.getters['blocks/chooseBlock'](blockId));
        deleteBlockAndDependByPressBackspace(block.value);
      });
    };

    window.addEventListener('keydown', deleteSelectedBlocks);

    const isShowEditCoverButton = ref(false);
    const hoverHandle = (choose) => {
      isShowEditCoverButton.value = choose;
    };

    const isShowEditCoverCard = ref(false);
    const editCoverCardHandle = (choose) => {
      isShowEditCoverCard.value = choose;
    };

    const isFSUpdating = ref(false);
    const isFSUpdatingHandle = (choose) => {
      isFSUpdating.value = choose;
    };

    const isShowBlockStyleEditor = ref(false);
    const clickBlockStyleEditorIconAction = (block) => {
      isShowBlockStyleEditor.value = true;
      console.log(selectedBlocksIds.value);
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

    const updateToFS = async () => {
      isFSUpdatingHandle(true);
      try {
        await updateStoreToFS();
        isFSUpdatingHandle(false);
      } catch (error) {
        console.log(error);
        isFSUpdatingHandle(false);
      }
    };

    const { isMouseUnderTheElement } = commonDomEffect();
    const clickActionInContent = (e) => {
      const finalBlock = currentBlocks.value[currentBlocks.value.length - 1];
      if (!finalBlock) {
        e.preventDefault();
        store.dispatch('blocks/addBlockAndSetFocusBlockId', {});
        return;
      }
      const finalBlockDom = document.getElementById(finalBlock.id);
      if (isMouseUnderTheElement(finalBlockDom, e)) {
        e.preventDefault();
        if (finalBlock.content === '') {
          finalBlockDom.focus();
          return;
        }
        store.dispatch('blocks/addBlockAndSetFocusBlockId', {});
      }
    };

    const clickActions = (e) => {
      const el = e.target;
      if (!el.closest('.workspace')) return;
      if (el.closest('.blockcontent')) {
        // console.log('888888888888888');
        clickActionInContent(e);
        return;
      }
      store.commit('blocks/setFocusBlockById', '');
      store.commit('blocks/setSelectedBlocksIds', []);
      hiddenStyleEditor();
      // if (el.classList.contains('content') || el.classList.contains('workspace')) {
      //   console.log('點到外面了');
      // }
    };

    const toggleFloatSidebar = (e) => {
      if (isSidebarFloating.value === false) return;
      if (e.clientX < 45) {
        store.commit('setSidebarCollapse', false);
      } else {
        store.commit('setSidebarCollapse', true);
      }
    };

    onMounted(() => {
      watch( // 監聽是否切換到其他元素
        currentFocusBlockId,
        (curr, prev) => {
          nextTick(() => {
            if (!curr) return;

            const getEditableElementById = (id) => {
              const el = document.getElementById(id);
              if (!el) return null;

              return el.closest('.block').querySelector('[contenteditable]');
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

            if (prevFocusDom === null) return;
            prevFocusDom.placeholder = '';
          });
        },
      );
    });

    // watch(
    //   hiddenBlocksIds,
    //   (curr) => {
    //     console.log(curr);
    //   }
    // )

    // watch(

    // )
    // watch( // 監聽state中的pages資料被更新就馬上更新到FS
    //   () => pages.value,
    //   (currData) => {
    //     store.dispatch('updateToFs', {
    //       collectionName: 'pages',
    //       data: currData,
    //     });
    //   },
    //   { deep: true },
    // );

    // watch( // 監聽state中的blocks資料被更新就馬上更新到FS
    //   () => blocks.value,
    //   (currData, prevData) => {
    //     // console.log(currData);
    //     // 如果數據量比原本的多或者不變，就是新增或者編輯
    //     if (currData.length >= prevData.length) {
    //       store.dispatch('updateToFs', {
    //         collectionName: 'blocks',
    //         data: currData,
    //       });
    //     // 如果數據量比原本的少，就是刪除
    //     } else {
    //       store.dispatch('deleteToFs', {
    //         collectionName: 'blocks',
    //       });
    //     }
    //   },
    //   { deep: true },
    // );

    return {
      deleteSelectedBlocks,
      clickActions,
      currentPage,
      editPageData,
      currentBlocks,
      currentBlocksIds,
      currentFocusBlockId,
      currentFocusBlock,
      hoverHandle,
      isShowEditCoverButton,
      isShowEditCoverCard,
      editCoverCardHandle,
      selectedBlocksIds,
      groups,
      hiddenBlocksIds,
      updateToFS,
      isFSUpdating,
      toggleFloatSidebar,
      isShowBlockStyleEditor,
      clickBlockStyleEditorIconAction,
      hiddenStyleEditor,
      isBlockSelected,
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
  background: #faf9f2;
  // background: #faf9f2;
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
  // padding: 2rem 2rem;
  // background-color: rgb(243, 226, 203);
}

.workspace{
  @include mainspace;
  display: flex;
  flex-direction: column;
  border-radius: .2rem;
  box-shadow: 0 0 5px 0 rgb(209, 193, 171);
}

p{
  margin-bottom: 0;
}

.uncollapse{
  position: absolute;
  left: 0;
  top: 0;
  width: 2rem;
  height: 4.5rem;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  &-btn{
    color: #807683;
  }
}

.header{
  // background: #faf9f2;
  position: sticky;
  top: 0;
  display: flex;
  padding: 1.5rem .5rem 1.5rem 2rem;
  margin-bottom: 5rem;
  z-index: 7;
}

.update{
  top: 0;
  border-radius: .3rem;
  color: #646464;
  padding: 0 .3rem;
  margin-left: auto;
  margin-right: 1rem;
  display: flex;
  &:hover{
    background: #dbdbdb;
  }
  &-text{
    margin-left: .5rem;
  }
}

.decoration{
  position: absolute;
  top: 0;
  right: 20%;
  width: 3rem;
  height: 7rem;
  background: $web-orange;
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
  width: 100%;
  flex-grow: 1;
  min-height: 350px;
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
.pageinfo{
  color: #7c7c7c;
}
.cover{
  position: relative;
  height: 16rem;
  background-size: cover;
  background-origin: content-box;
  width: 100%;
  // margin: 0 -10.5px 0 -10.5px;
  &-edit{
    position: absolute;
    right: 1rem;
    bottom: .5rem;
    button{
      color: #f3f3f3;
      background: rgba($color: #000000, $alpha: 0.3);
    }
  }
}

</style>
