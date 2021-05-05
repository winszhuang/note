<template>
  <div class="container" v-if="currentPage">
    <div class="card-body">
      <Breadcrumb :page="currentPage"/>
    </div>
    <div class="workspace">
      <div class="title line-break">
        <input class="h1"
            style="font-weight: 900;"
            type="text"
            placeholder="請輸入標題"
            :value="currentPage.name"
            @input="editPageData('name', $event.target.value)"
        >
      </div>
      <hr>
      <div class="content" ref="content" v-if="currentBlocks">
        <div class="d-flex"
              v-for="(block) in currentBlocks"
              :key="block.id"
        >
          <DragItem/>
          <component
              :is="getFirstToUpper(block.type)"
              :block="block"
              >
          </component>
        </div>
      </div>
      <hr>
      <div v-if="currentPage">
        <div>currentPage: </div>
        <ul>
          <li>name ------ {{ currentPage.name }}</li>
          <li>blocks ------ {{ currentPage.blocks }}</li>
          <li>parentID ------ {{ currentPage.parentId }}</li>
          <li>id ------ {{ currentPage.id }}</li>
        </ul>
        <hr>
        <div v-if="currentFocusBlock">
          <div>currentFocusBlockId: {{ currentFocusBlockId }}</div>
          <div>currentFocusBlock: </div>
          <ul>
            <li>content ------ {{ currentFocusBlock.content }}</li>
            <li>type ------ {{ currentFocusBlock.type }}</li>
            <li>id ------ {{ currentFocusBlock.id }}</li>
            <hr>
          </ul>
        </div>
      </div>
      <hr>
      <div v-for="item in pages" :key="item.id">
        <div>id: {{ item.id }}</div>
        <div>blocks: {{ item.blocks }}</div>
        <h1></h1>
      </div>
      <!-- <div>currentBlocks: </div>
      <div v-if="currentBlocks.length">
        <div
          v-for="block in currentBlocks"
          :key="block.id">
          <ul>
            <li>content ------ {{ block.content }}</li>
            <li>type ------ {{ block.type }}</li>
            <li>id ------ {{ block.id }}</li>
            <hr>
          </ul>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  computed, toRefs, ref, watch, nextTick,
} from 'vue';
import { useStore } from 'vuex';
import commonEffect from '../commonEffect';
import commonUpdateEffect from '../commonUpdataEffect';
import Breadcrumb from './Breadcrumb.vue';
import DragItem from '../../components/DragItem.vue';

export default {
  name: 'Workspace',
  components: { Breadcrumb, DragItem },
  setup() {
    const store = useStore();
    const currentPage = computed(() => store.getters.currentPage);
    const currentBlocks = computed(() => store.getters.currentBlocks);
    const currentFocusBlock = computed(() => store.getters.currentFocusBlock);
    const currentBlocksNum = computed(() => store.getters.currentBlocksNum);
    const { editPageData } = commonUpdateEffect();
    const { getFirstToUpper } = commonEffect();
    const {
      currentFocusBlockId, pages, // pages, blocks,
    } = toRefs(store.state);
      // const indexOfCurrentBlock = computed(() => store.getters.indexOfCurrentBlock);

    const content = ref(null);
    if (currentFocusBlockId) {
      watch( // 監聽是否切換到其他元素
        currentFocusBlockId,
        () => {
          // console.log(currentFocusBlockId.value);
          // const index = indexOfCurrentBlock.value;
          nextTick(() => {
            if (!content.value) return;
            const children = [...content.value.children];
            if (!currentFocusBlockId.value) return;
            children.find((e) => e.id === currentFocusBlockId.value).focus();
            // content.value.children.item(index).focus();
          });
        },
      );
    }
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
      getFirstToUpper,
      currentFocusBlockId,
      currentFocusBlock,
      currentBlocksNum,
    };
  },
};
</script>

<style lang="scss">

.content{
  width: 100%;
  &-input{
    width: inherit;
    min-height: 50px;
  }
}
.line-break{
  margin-bottom: 1rem;
}
.workspace{
  flex-grow:1;
  padding: 1rem 15% 0 15%;
  overflow-y: auto;
  // position: absolute;
  // bottom: 0;
  // top: 2rem;
  // left: 18rem;
  // right: 0;
  @media (max-width:900px){
    left: 0;
  }
}
.title{
  margin-top: 4rem;
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
