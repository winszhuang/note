<template>
  <main class="mainspace" @mousemove="toggleFloatSidebar($event)">
    <div class="workspace" v-if="currentPage">
      <!-- {{ pageHistory }} -->
      <div class="header">
        <Breadcrumb :page="currentPage"/>
        <div class="update" type="button" @click="updateToFS">
          <div class="update-icon" v-if="!isUpdating">
            <font-awesome-icon :icon="['fas', 'database']"/>
          </div>
          <div class="update-icon" v-else>
            <font-awesome-icon :icon="['fas', 'sync-alt']"/>
          </div>
          <div class="update-text">更新到數據庫</div>
        </div>
      </div>
      <!-- <div class="decoration"></div> -->
      <!-- <div class="cover"
          style="background-image: url(https://images.unsplash.com/photo-1496681859237-6039cd585c4e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80);"
          @mouseover="hoverHandle(true)"
          @mouseout="hoverHandle(false)"
      >
        <div class="cover-edit" v-show="isShowEditCoverButton">
          <button type="button"
                class="btn btn-transparent"
                @click="editCoverCardHandle(true)"
          >編輯圖片</button>
        </div>
      </div> -->
      <div class="content">
        <AreaSelect :ids="currentBlocksIds" />
        <StyleTool/>
        <div class="title">
          <PageEditable
              :page="currentPage"
              :placeholder="'請輸入標題'"
              :className="'title-input'"/>
          <!-- <div class="prefix-line"></div> -->
        </div>
        <PageInfo :page="currentPage"/>
        <div class="blockcontent" v-if="currentBlocks" @mousedown="clickActionInContent($event)">
          <template v-for="(block) in currentBlocks" :key="block.id">
            <Block :block="block"
                  v-show="!hiddenBlocksIds.includes(block.id)"/>
          </template>
        </div>

        <!--測試用-->
        <!-- <hr>
        <template v-if="groups && groups.length !== 0">
          <div v-for="(item) in groups" :key="item.id">
            <ul>
                <li>id ------ {{ item.id }}</li>
                <li>value ---- {{ item.value }}</li>
                <hr>
            </ul>
          </div>
        </template>
        <hr>
        <div v-if="hiddenBlocksIds">
          <div>hiddenBlocksIds:
            {{ hiddenBlocksIds }}
          </div>
        </div>
        <div v-if="currentBlocksByAreaSelect">
          {{ currentBlocksByAreaSelect }}
        </div>
        <hr>
        <div v-if="currentPage">
          <hr>
          <div v-if="currentFocusBlock">
            <div>currentFocusBlockId: {{ currentFocusBlockId }}</div>
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
              <li>type ------ {{ block.type }}</li>
              <li>id ------ {{ block.id }}</li>
              <li>parentId ------ {{ block.parentId }}</li>
              <li>blocks ------ {{ block.blocks }}</li>
              <li>group ------ {{ block.group }}</li>
              <hr>
            </ul>
          </div>
        </div> -->
        <!--測試用-->

      </div>
    </div>
    <template v-else>
      <div class="base">
        <div class="base-container">
          <div class="base-title">
            <div class="base-title-first">N</div>
            <div class="base-title-second">ote</div>
          </div>
          <div class="base-small">區塊構成的世界...</div>
          <div class="base-intro">
            <div class="base-intro-quote">Note是一個筆記軟體</div>
            <br>
            <br>
            <div class="base-intro-text">
              <p>使用不同的區塊工具</p>
              <p>來記錄文字、影片、圖像等載體...</p>
              <p></p>
              <p></p>
              <!-- <p>使用區塊工具</p>
              <p>來記錄文字、影片</p>
              <p>圖像等載體...</p> -->
              <br>
              <!-- <br> -->
              <p>也能夠創建頁面</p>
              <p>來為多個不同區塊分類</p>
              <br>
              <br>
              <!-- <p>更多說明參考</p> -->

            </div>
            <!-- <p>左方側邊欄可以創建頁面、區塊</p>
            <p>在頁面中，可以創建無數的區塊</p>
            <p>甚至是内嵌頁</p>
            <p>而不同種類的區塊有不同的功能</p> -->
          </div>
        </div>
      </div>
    </template>

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
    // eslint-disable-next-line max-len
    const currentBlocksByAreaSelect = computed(() => store.getters['blocks/currentBlocksByAreaSelect']);
    const currentBlocksIds = computed(() => store.getters['blocks/currentBlocksIds']);
    const isSidebarFloating = computed(() => store.state.sidebarState.isFloating);

    const unCollapseSidebar = () => {
      store.dispatch('lockSidebar');
    };

    const { editPageData } = commonUpdateEffect();
    const {
      currentFocusBlockId, hiddenBlocksIds, // pages, blocks,
    } = toRefs(store.state.blocks);

    const isShowEditCoverButton = ref(false);
    const hoverHandle = (choose) => {
      isShowEditCoverButton.value = choose;
    };

    const isShowEditCoverCard = ref(false);
    const editCoverCardHandle = (choose) => {
      isShowEditCoverCard.value = choose;
    };

    const isUpdating = ref(false);
    const isUpdatingHandle = (choose) => {
      isUpdating.value = choose;
    };

    const updateToFS = async () => {
      isUpdatingHandle(true);
      try {
        await updateStoreToFS();
        isUpdatingHandle(false);
      } catch (error) {
        console.log(error);
        isUpdatingHandle(false);
      }
    };

    const { isMouseUnderTheElement } = commonDomEffect();
    const clickActionInContent = (e) => {
      const lastBlock = currentBlocks.value[currentBlocks.value.length - 1];
      if (!lastBlock) {
        e.preventDefault();
        store.dispatch('blocks/pushBlock', {
          type: 'p',
        });
        return;
      }
      const lastBlockDom = document.getElementById(lastBlock.id);
      if (isMouseUnderTheElement(lastBlockDom, e)) {
        e.preventDefault();
        if (lastBlock.content === '') {
          lastBlockDom.focus();
          return;
        }
        store.dispatch('blocks/pushBlock', {
          type: 'p',
        });
      }
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
      clickActionInContent,
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
      currentBlocksByAreaSelect,
      groups,
      hiddenBlocksIds,
      updateToFS,
      isUpdating,
      unCollapseSidebar,
      toggleFloatSidebar,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/color.scss';

@mixin mainspace {
  height: 100vh;
  // background: #F1F0EA;
  background: #faf9f2;
  position: relative;
  z-index: 1;
  overflow-y: auto;
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
}

.workspace{
  @include mainspace;
  display: flex;
  flex-direction: column;
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

.base{
  @include mainspace;
  display: flex;
  justify-content: center;
  align-items: center;
  &-title{
    width: 100%;
    color: #504952;
    height: 12rem;
    // margin-top: 12rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    &-first{
      // background: #504952;
      // background: #645b66;
      background: #584d58;
      color: #F1F0EA;
      // color: #645b66;
      font-size: 8rem;
      font-weight: bold;
      line-height: 9rem;
      box-shadow: .2rem .2rem .3rem .1rem #a1a1a1;
      border-radius: .5rem;
      margin: 0 .1rem 0 1.5rem;
      padding: 0 .7rem;
    }
    &-second{
      box-shadow: .1rem .1rem .3rem .1rem #858585;
      font-size: 2rem;
      font-weight: 900;
      padding: 0 .5rem;
      border-radius: .5rem;
      color: #645b66;
    }
  }
  &-small{
    margin: .7rem;
    padding-left: .7rem;
    text-align: center;
    color: #999999;
    transform: scale(.85);
  }
  &-intro{
    text-align: center;
    color: #5f5661;
    margin-top: 4rem;
    &-quote{
      font-size: 1.3rem;
      font-weight: bold;
      color: #676269;
    }
    &-text{
      color: #807883;
    }
  }
}

.header{
  background: #faf9f2;
  position: sticky;
  top: 0;
  display: flex;
  padding: 1.5rem .5rem 1.5rem 2rem;
  margin-bottom: 6rem;
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
  margin: 0 20%;
  padding-bottom: 7rem;
  display: flex;
  flex-direction: column;
  @media (min-width:1100px){
    margin: 0 22%;
  }
  @media (max-width:992px){
    margin: 0 12%;
  }

  transition: margin .3s ease-out;
  // @media (min-width:1200px){
  //   padding: 0 27%;
  // }
}
.blockcontent{
  width: 100%;
  flex-grow: 1;
  &-input{
    width: inherit;
    min-height: 50px;
  }
}
.title{
  position: relative;
  &-input{
    font-family: 'Noto Sans TC', sans-serif;
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
