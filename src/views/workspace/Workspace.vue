<template>
  <div class="container" v-if="currentPage">
    <div class="ps-1 pe-3 pt-3 pb-3">
      <Breadcrumb :page="currentPage"/>
    </div>
    <div class="cover"
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
    </div>
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
    <div class="workspace">
      <AreaSelect/>
      <div class="title ">
        <input class="title-input"
            type="text"
            placeholder="請輸入標題"
            :value="currentPage.name"
            @input="editPageData('name', $event.target.value)"
        >
      </div>
      <div class="content" ref="content" v-if="currentBlocks">
        <template v-for="(block) in rootCurrentBlocks"
                  :key="block.id">
          <Block :block="block"/>
        </template>
      </div>
      <hr>
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
            <hr>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  computed, toRefs, ref, watch, nextTick,
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
    const currentPage = computed(() => store.getters.currentPage);
    const currentBlocks = computed(() => store.getters.currentBlocks);
    const rootCurrentBlocks = computed(() => store.getters.childrenCurrentBlocks(''));
    const currentFocusBlock = computed(() => store.getters.currentFocusBlock);
    const currentBlocksNum = computed(() => store.getters.currentBlocksNum);
    const currentBlocksByAreaSelect = computed(() => store.getters.currentBlocksByAreaSelect);
    const { editPageData } = commonUpdateEffect();
    const {
      currentFocusBlockId, pages, // pages, blocks,
    } = toRefs(store.state);
      // const indexOfCurrentBlock = computed(() => store.getters.indexOfCurrentBlock);

    const isShowEditCoverButton = ref(false);
    const hoverHandle = (choose) => {
      isShowEditCoverButton.value = choose;
    };

    const isShowEditCoverCard = ref(false);
    const editCoverCardHandle = (choose) => {
      isShowEditCoverCard.value = choose;
    };
    // const hoverHandle = (choose) => {
    //   isShowEditImageCard.value = choose;
    // };

    const content = ref(null);
    if (currentFocusBlockId) {
      watch( // 監聽是否切換到其他元素
        currentFocusBlockId,
        () => {
          nextTick(() => {
            if (!content.value) return;
            if (!currentFocusBlockId.value) return;

            document.getElementById(currentFocusBlockId.value).focus();
            // console.log(rootCurrentBlocks.value);
          });
        },
      );
    }

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
      content,
      currentPage,
      editPageData,
      currentBlocks,
      rootCurrentBlocks,
      currentFocusBlockId,
      currentFocusBlock,
      currentBlocksNum,
      hoverHandle,
      isShowEditCoverButton,
      isShowEditCoverCard,
      editCoverCardHandle,
      currentBlocksByAreaSelect,
    };
  },
};
</script>

<style lang="scss">
.container{
  background: #FCFFFC;
}

.content{
  width: 100%;
  &-input{
    width: inherit;
    min-height: 50px;
  }
}
.workspace{
  flex-grow:1;
  padding: 0 15% 0 15%;
  overflow-y: auto;
  // position: absolute;
  // bottom: 0;
  // top: 2rem;
  // left: 18rem;
  // right: 0;
  @media (max-width:900px){
    left: 0;
  }
  @media (min-width:1100px){
    padding: 0 20% 0 20%;
  }
}
.title{
  margin-top: 2rem;
  margin-bottom: 3rem;
  input{
    font-family: 'Noto Sans TC', sans-serif;
    font-weight: 700;
    color: #464646;
    font-size: 3rem;
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
  margin: 0 -10.5px 0 -10.5px;
  &-edit{
    position: absolute;
    right: 1rem;
    bottom: .5rem;
    button{
      color: #f3f3f3;
      background: rgba($color: #000000, $alpha: 0.3);
    }
  }
  // &-input{
  // }
}

input, textarea{
  background: transparent;
  border: none;
  outline: none;
  &:hover{
    border: none;
  }
  &::placeholder{
    color: #f3f3f3;
  }
}

</style>
