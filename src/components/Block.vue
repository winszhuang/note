<template>
  <div class="block"
        @mouseover="hoverHandle(block.id, $event)"
        @mouseout="hoverHandle('')"
  >
    <div class="block-indent"></div>
    <div class="block-drag" >
      <DragItem :block="block" v-show="isDragShow" v-if="block.blocks.length === 0"/>
    </div>
    <div
        @drop="handleDrop($event)"
        @dragenter="cancelDefault($event, true)"
        @dragleave="handleLeave($event)"
        @dragover="handleBeforeDrop($event)"
    >
      <component
          :is="getFirstToUpper(block.type)"
          :block="block"
          >
      </component>
    </div>
  </div>
</template>

<script>
import { computed, ref, toRefs } from 'vue';
import { useStore } from 'vuex';
import commonEffect from '../views/commonEffect';
import DragItem from './DragItem.vue';

export default {
  name: 'Block',
  props: ['block'],
  components: { DragItem },
  setup() {
    const store = useStore();
    const { currentBlockIdOnMouse } = toRefs(store.state);
    const currentPage = computed(() => store.getters.currentPage).value;
    const { getFirstToUpper } = commonEffect();
    const isDragShow = ref(false);

    const hoverHandle = (id) => {
      store.commit('changeCurrentBlockIdOnMouse', id);
      if (id === currentBlockIdOnMouse.value) {
        isDragShow.value = true;
      }
      if (id === '') {
        isDragShow.value = false;
      }
    };

    const cancelDefault = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleBeforeDrop = (e) => {
      cancelDefault(e);
      const y = e.clientY; // 取得滑鼠放開時候的Y位置
      const catchBlockId = e.dataTransfer.getData('text/plain'); // 其他地方丟過來的blockId
      const currentDOM = e.target; // 當前block的DOM元素
      if (currentDOM.id === catchBlockId) return; // 如果選到同個元素就不執行

      const outerDom = currentDOM.parentElement;
      const rect = currentDOM.getBoundingClientRect();
      const currentDOMMidline = rect.top + rect.height / 2; // 找選到的元素的中線位置

      if (y < currentDOMMidline) {
        outerDom.classList.remove('block-border-bottom');
        outerDom.classList.add('block-border-top');
      } else {
        outerDom.classList.remove('block-border-top');
        outerDom.classList.add('block-border-bottom');
      }
    };

    const handleLeave = (e) => {
      cancelDefault(e);
      const outerDom = e.currentTarget;
      if (outerDom.classList.contains('block-border-top')) {
        outerDom.classList.remove('block-border-top');
      }
      if (outerDom.classList.contains('block-border-bottom')) {
        outerDom.classList.remove('block-border-bottom');
      }
    };

    const handleDrop = (e) => {
      const y = e.clientY; // 取得滑鼠放開時候的Y位置
      const catchBlockId = e.dataTransfer.getData('text/plain'); // 其他地方丟過來的blockId
      const currentDOM = e.target; // 當前block的DOM元素

      handleLeave(e);
      if (currentDOM.id === catchBlockId) return; // 如果選到同個元素就不執行

      store.commit('deleteIdToBlocksOfPage', { // 先刪除原本的位置的lbockID
        page: currentPage,
        blockId: catchBlockId,
      });

      if (currentDOM.hasAttribute('id')) {
        const rect = currentDOM.getBoundingClientRect();
        const currentDOMMidline = rect.top + rect.height / 2; // 找選到的元素的中線位置

        const newIndex = currentPage.blocks.indexOf(currentDOM.id); // 新的要插入的位置

        store.commit('addIdToBlocksOfPage', {
          page: currentPage,
          blockId: catchBlockId,
          index: y < currentDOMMidline ? newIndex : newIndex + 1,
        });
      }

      if (currentDOM.hasAttribute('data-pageid')) {
        const childrenPageId = currentDOM.getAttribute('data-pageid');
        const childrenPage = computed(() => store.getters.choosePage(childrenPageId)).value;

        store.commit('addIdToBlocksOfPage', {
          page: childrenPage,
          blockId: catchBlockId,
        });
      }

      handleLeave(e);
    };

    return {
      getFirstToUpper,
      hoverHandle,
      currentBlockIdOnMouse,
      isDragShow,
      handleDrop,
      cancelDefault,
      handleBeforeDrop,
      handleLeave,
    };
  },
};
</script>

<style lang="scss" scoped>
.block{
  position: relative;
  display: flex;
  margin-left: -1.5rem;
  &-drag{
    width: 1.5rem;
  }
  &-border-top{
    border-top: .1rem dashed rgb(173, 173, 173);
  }
  &-border-bottom{
    border-bottom: .1rem dashed rgb(173, 173, 173);
  }
}
</style>
