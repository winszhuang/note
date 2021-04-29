<template>
  <div class="workspace" v-if="currentPage">
    <Breadcrumb/>
    <div class="title line-break">
      <input class="h1"
          style="font-weight: bold;"
          type="text"
          placeholder="請輸入標題"
          :value="currentPage.name"
          @input="editPageData('name', $event.target.value)"
      >
    </div>
    <hr>
    <div class="content">
      <component
          :is="getFirstToUpper(block.type)"
          v-for="(block) in currentBlocks"
          :key="block.id"
          :block="block"
          >
      </component>
    </div>
    {{ currentBlocksNum }}
    <!-- <hr> -->
    <!-- <div>currentPage: </div>
    <ul>
      <li>name ------ {{ currentPage.name }}</li>
      <li>parentID ------ {{ currentPage.parentID }}</li>
      <li>id ------ {{ currentPage.id }}</li>
    </ul>
    <hr> -->
    <!-- <div v-if="currentFocusBlock">
      <div>currentFocusBlockId: {{ currentFocusBlockId }}</div>
      <div>currentFocusBlock: </div>
      <ul>
        <li>content ------ {{ currentFocusBlock.content }}</li>
        <li>type ------ {{ currentFocusBlock.type }}</li>
        <li>id ------ {{ currentFocusBlock.id }}</li>
        <hr>
      </ul>
    </div> -->
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
</template>

<script>
import { computed, toRefs, watch } from 'vue';
import { useStore } from 'vuex';
import commonEffect from '../commonEffect';
import commonUpdateEffect from '../commonUpdataEffect';
import Breadcrumb from './Breadcrumb.vue';

export default {
  name: 'Workspace',
  components: { Breadcrumb },
  setup() {
    const store = useStore();
    const currentPage = computed(() => store.getters.currentPage);
    const currentBlocks = computed(() => store.getters.currentBlocks);
    const currentFocusBlock = computed(() => store.getters.currentFocusBlock);
    const currentBlocksNum = computed(() => store.getters.currentBlocksNum);
    const { pages, blocks, currentFocusBlockId } = toRefs(store.state);
    const { editPageData } = commonUpdateEffect();
    const { getFirstToUpper } = commonEffect();

    watch( // 監聽state中的資料被更新就馬上更新到FS
      () => pages.value,
      (currData) => {
        store.dispatch('updateToFs', {
          collectionName: 'pages',
          data: currData,
        });
      },
      { deep: true },
    );
    watch( // 監聽state中的資料被更新就馬上更新到FS
      () => blocks.value,
      (currData, prevData) => {
        // console.log(currData);
        // 如果數據量比原本的多或者不變，就是新增或者編輯
        if (currData.length >= prevData.length) {
          store.dispatch('updateToFs', {
            collectionName: 'blocks',
            data: currData,
          });
        // 如果數據量比原本的少，就是刪除
        } else {
          store.dispatch('deleteToFs', {
            collectionName: 'blocks',
          });
        }
      },
      { deep: true },
    );

    return {
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
  padding: 1rem 4rem 0 4rem;
  overflow-y: auto;
  position: absolute;
  bottom: 0;
  top: 0;
  left: 18rem;
  @media (max-width:900px){
    left: 0;
  }
}
.title{
  margin-top: 4rem;
}

input, textarea{
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
