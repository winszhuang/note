<template>
  <div class="workspace" v-if="currentPage" @mousemove="checkElement($event)">
    <div class="header">
      <Breadcrumb :page="currentPage"/>
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
    <!-- <div>rootCurrentBlocks: </div>
      <div v-if="rootCurrentBlocks.length > 0">
        <div
          v-for="block in rootCurrentBlocks"
          :key="block.id">
          <ul>
            <li>content ------ {{ block.content }}</li>
            <li>type ------ {{ block.type }}</li>
            <li>id ------ {{ block.id }}</li>
            <li>parentId ------ {{ block.parentId }}</li>
            <li>blocks ------ {{ block.blocks }}</li>
            <hr>
          </ul>
        </div>
      </div> -->
    <div class="content">
      <AreaSelect :ids="currentBlocksIds" />
      <template v-if="groups.length !== 0">
        <div v-for="(item) in groups" :key="item.id">
          <ul>
              <li>id ------ {{ item.id }}</li>
              <li>value ---- {{ item.value }}</li>
              <hr>
          </ul>
        </div>
      </template>
      <div class="title">
        <div class="title-input"
            contenteditable=true
            spellcheck="false"
            type="text"
            placeholder="請輸入標題"
            :value="currentPage.name"
            @input="editPageData('name', $event.target.innerHTML)">{{ currentPage.name }}</div>
        <div class="prefix-line"></div>
      </div>
      <div class="blockcontent" v-if="currentBlocks">
        <template v-for="(block) in currentBlocks" :key="block.id">
          <Block :block="block"
                :showdrag="block.id === currentIdOnMouse ? true : false"
                v-show="!hiddenBlocksIds.includes(block.id)"/>
        </template>
      </div>
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
        <!-- <div>currentPage: </div>
        <ul>
          <li>name ------ {{ currentPage.name }}</li>
          <li>blocks ------ {{ currentPage.blocks }}</li>
          <li>parentID ------ {{ currentPage.parentId }}</li>
          <li>id ------ {{ currentPage.id }}</li>
        </ul> -->
        <hr>
        <div v-if="currentFocusBlock">
          <div>currentFocusBlockId: {{ currentFocusBlockId }}</div>
          <div>currentFocusBlock: </div>
          <ul>
            <li>content ------ {{ currentFocusBlock.content }}</li>
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
      <!-- <div v-for="item in pages" :key="item.id">
        <div>id: {{ item.id }}</div>
        <div>blocks: {{ item.blocks }}</div>
        <h1></h1>
      </div> -->
      <div>currentBlocks: </div>
      <div v-if="currentBlocks.length">
        <div
          v-for="block in currentBlocks"
          :key="block.id">
          <ul>
            <li>content ------ {{ block.content }}</li>
            <li>type ------ {{ block.type }}</li>
            <li>id ------ {{ block.id }}</li>
            <li>parentId ------ {{ block.parentId }}</li>
            <li>blocks ------ {{ block.blocks }}</li>
            <li>group ------ {{ block.group }}</li>
            <hr>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  computed, toRefs, ref, watch, nextTick, onMounted,
} from 'vue';
import { useStore } from 'vuex';
import commonUpdateEffect from '../commonUpdataEffect';
import Breadcrumb from './Breadcrumb.vue';
import Block from '../../components/Block.vue';
import AreaSelect from '../../components/AreaSelect.vue';

export default {
  name: 'Workspace',
  components: { Block, Breadcrumb, AreaSelect },
  setup() {
    const store = useStore();
    const groups = computed(() => store.getters.getGroups);
    const currentPage = computed(() => store.getters.currentPage);
    const currentBlocks = computed(() => store.getters.currentBlocks);
    const rootCurrentBlocks = computed(() => store.getters.childrenCurrentBlocks(''));
    const currentFocusBlock = computed(() => store.getters.currentFocusBlock);
    const currentBlocksNum = computed(() => store.getters.currentBlocksNum);
    const currentBlocksByAreaSelect = computed(() => store.getters.currentBlocksByAreaSelect);
    const currentBlocksIds = computed(() => store.getters.currentBlocksIds);

    const { editPageData } = commonUpdateEffect();
    const {
      currentFocusBlockId, pages, hiddenBlocksIds, // pages, blocks,
    } = toRefs(store.state);

    const isShowEditCoverButton = ref(false);
    const hoverHandle = (choose) => {
      isShowEditCoverButton.value = choose;
    };

    const isShowEditCoverCard = ref(false);
    const editCoverCardHandle = (choose) => {
      isShowEditCoverCard.value = choose;
    };

    const currentIdOnMouse = ref('');
    const checkElement = (e) => {
      const blockEl = e.target.closest('.block');
      if (!blockEl) {
        currentIdOnMouse.value = '';
        return;
      }
      const hasIdEl = blockEl.querySelector('[id]');
      // console.log(hasIdEl);
      currentIdOnMouse.value = hasIdEl.getAttribute('id');
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
      pages,
      currentPage,
      editPageData,
      currentBlocks,
      currentBlocksIds,
      rootCurrentBlocks,
      currentFocusBlockId,
      currentFocusBlock,
      currentBlocksNum,
      hoverHandle,
      isShowEditCoverButton,
      isShowEditCoverCard,
      editCoverCardHandle,
      currentBlocksByAreaSelect,
      groups,
      currentIdOnMouse,
      checkElement,
      hiddenBlocksIds,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/color.scss';

.workspace{
  flex: 1;
  height: 100vh;
  background: #F1F0EA;
  // background: #faf9f2;
  position: relative;
  overflow-y: auto;
}

.decoration{
  position: absolute;
  top: 0;
  right: 20%;
  width: 3rem;
  height: 7rem;
  background: $web-orange;
}

.header{
  padding: 1.5rem .5rem 1.5rem 2rem;
  margin-bottom: 4.5rem;
}

.blockcontent{
  width: 100%;
  &-input{
    width: inherit;
    min-height: 50px;
  }
}
.content{
  flex-grow:1;
  padding: 0 20%;
  // padding: 0 20% 0 20%;
  @media (min-width:1100px){
    padding: 0 25%;
  }
}
.title{
  margin-top: 2rem;
  margin-bottom: 5rem;
  position: relative;
  &-input{
    // resize: none;
    // height: auto;
    // width: 100%;
    font-family: 'Noto Sans TC', sans-serif;
    font-weight: 700;
    font-size: 3.5rem;
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
