<template>
  <div class="block">
   <!-- <div class="block-spacing" :style="{ width: `${getLevelOfBlock(block)*1.5}rem` }"></div> -->
    <div class="block-drag" >
      <transition name="drag">
        <DragItem :block="block"
                  v-show="showdrag"/>
      </transition>
    </div>
    <div class="block-content"
        @drop="handleDrop($event)"
        @dragenter="cancelDefault($event, true)"
        @dragleave="handleLeave($event)"
        @dragover="handleBeforeDrop($event)">
      <component
          :is="getFirstToUpper(block.type)"
          :block="block">
      </component>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { commonStringEffect } from './commonEffect';
import commonBlockEffect from './commonBlockEffect';
import DragItem from './DragItem.vue';

export default {
  name: 'Block',
  props: ['block', 'showdrag'],
  components: { DragItem },
  setup() {
    const store = useStore();
    const { getLevelOfBlock } = commonBlockEffect();
    const { getFirstToUpper } = commonStringEffect();

    const cancelDefault = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const getVerticalDirByMousePosition = (dom, mouseY) => {
      const rect = dom.getBoundingClientRect();
      const domMidline = rect.top + rect.height / 2; // 找選到的元素的中線位置
      return mouseY < domMidline ? 'up' : 'down';
    };

    const handleBeforeDrop = (e) => {
      cancelDefault(e);
      // console.log(e.target);
      const catchBlockId = e.dataTransfer.getData('text/plain'); // 其他地方丟過來的blockId
      const targetDOM = e.target; // 當前block的DOM元素

      if (targetDOM.id === catchBlockId) return; // 如果選到同個元素就不執行

      const y = e.clientY; // 取得滑鼠放開時候的Y位置
      const direction = getVerticalDirByMousePosition(targetDOM, y);
      const blockContentDom = targetDOM.closest('.block-content');
      if (direction === 'up') {
        blockContentDom.classList.remove('block-border-bottom');
        blockContentDom.classList.add('block-border-top');
      } else {
        blockContentDom.classList.remove('block-border-top');
        blockContentDom.classList.add('block-border-bottom');
      }
    };

    const handleLeave = (e) => {
      cancelDefault(e);
      const blockContentDom = e.target.closest('.block-content');
      if (blockContentDom.classList.contains('block-border-top')) {
        blockContentDom.classList.remove('block-border-top');
      }
      if (blockContentDom.classList.contains('block-border-bottom')) {
        blockContentDom.classList.remove('block-border-bottom');
      }
    };

    const handleDrop = (e) => {
      console.log('插進來');
      const currentPage = computed(() => store.getters.currentPage).value;
      const catchBlockId = e.dataTransfer.getData('text/plain'); // 其他地方丟過來的blockId
      const catchBlock = computed(() => store.getters.chooseBlock(catchBlockId)).value;
      const targetDOM = e.target; // 當前block的DOM元素
      // const targetBlock = computed(() => store.getters.chooseBlock(targetDOM.id)).value;

      handleLeave(e); // 刪除所有拖動過程會產生的邊線style

      if (targetDOM.id === catchBlockId) return; // 如果選到同個元素就不執行
      if (!(targetDOM.hasAttribute('id') || targetDOM.hasAttribute('data-pageid'))) return;

      // 先刪除原本的位置的blockID
      store.commit('deleteIdToBlocksOfPage', {
        page: currentPage,
        blockId: catchBlockId,
      });

      const direction = getVerticalDirByMousePosition(targetDOM, e.clientY); // 取得滑鼠放開時候的Y位置
      const newIndex = currentPage.blocks.indexOf(targetDOM.id); // 新的要插入的位置
      // 添加blockID到新的位置
      store.commit('addIdToBlocksOfPage', {
        page: currentPage,
        blockId: catchBlockId,
        index: direction === 'up' ? newIndex : newIndex + 1,
      });

      const currentBlocks = computed(() => store.getters.currentBlocks).value;
      const catchBlockIndex = currentBlocks.indexOf(catchBlock);
      const lastBlock = currentBlocks[catchBlockIndex - 1];
      const nextBlock = currentBlocks[catchBlockIndex + 1];

      if (catchBlock.group !== '') {
        store.commit('deleteIdToGroup', {
          groupId: catchBlock.group,
          id: catchBlock.id,
        });

        const groupFromCatchBlock = computed(() => store.getters.getGroupByBlock(catchBlock)).value;
        if (groupFromCatchBlock.value.length === 0) {
          store.commit('deleteGroup', groupFromCatchBlock);
        }

        if ((lastBlock.group === nextBlock.group && lastBlock.group !== '')
              || (lastBlock.group !== '' && nextBlock.group === '')) { // 上有group 下沒有  或者上下都有
          console.log('上有group 下沒有  或者上下都有');
          const lastBlockGroup = computed(() => store.getters.getGroupByBlock(lastBlock)).value;
          const index = lastBlockGroup.value.indexOf(lastBlock.id);

          store.commit('changeGroupIdFromBlockId', {
            blockId: catchBlockId,
            groupId: lastBlock.group,
          });

          store.commit('addIdToGroup', {
            groupId: lastBlock.group,
            id: catchBlockId,
            index: index + 1,
          });
        }

        if (lastBlock.group === '' && nextBlock.group !== '') { // 上沒有group 下有
          console.log('上沒有group 下有');
          const nextBlockGroup = computed(() => store.getters.getGroupByBlock(nextBlock)).value;
          const index = nextBlockGroup.value.indexOf(nextBlock.id);
          store.commit('changeGroupIdFromBlockId', {
            blockId: catchBlockId,
            groupId: nextBlock.group,
          });

          store.commit('addIdToGroup', {
            groupId: nextBlock.group,
            id: catchBlockId,
            index,
          });
        }

        if (lastBlock.group === '' && nextBlock.group === '') { // 上下都沒有group
          console.log('上下都沒有group');

          const groupId = new Date().getTime().toString();
          store.commit('addGroup', groupId);

          store.commit('addIdToGroup', {
            groupId,
            id: catchBlockId,
          });

          store.commit('changeGroupIdFromBlockId', {
            blockId: catchBlockId,
            groupId,
          });
        }
      }

      if (catchBlock.group === '' && lastBlock.group !== '' && lastBlock.group === nextBlock.group) {
        const nextBlockGroup = computed(() => store.getters.getGroupByBlock(nextBlock)).value;
        const index = nextBlockGroup.value.indexOf(nextBlock.id);

        const shiftIds = nextBlockGroup.value.slice(index);
        store.dispatch('deleteIdsToGroup', {
          groupId: nextBlockGroup.id,
          ids: shiftIds,
        });

        const groupId = new Date().getTime().toString();
        store.commit('addGroup', groupId);
        store.commit('addIdsToGroup', {
          groupId,
          ids: shiftIds,
        });
        store.dispatch('changeGroupIdFromBlocksIds', {
          blocksIds: shiftIds,
          groupId,
        });
      }

      // if (catchBlock.parentId.length === 0 && )

      handleLeave(e);
      // 以下判斷涉及兩置換物件某一方或者兩方有group屬性
      // handleGroupWithBlock();
      // if (!(targetDOM.hasAttribute('data-group-id') && catchDom.hasAttribute('data-group-id')))

      // const catchBlockGroup = computed(() => store.getters.getGroupByBlock(catchBlock)).value;
      // const targetGroup = computed(() => store.getters.getGroupByBlock(targetBlock)).value;

      // const actionCheck = (catch, target) => {
      //   let action = [...actions].filter((key, value) => key.)
      // }

      // store.commit('deleteIdToGroup', { // 先刪除原本位置group的blockID
      //   groupId: catchBlockGroup.id,
      //   id: catchBlockId,
      // });

      // if (catchBlockGroup.id === targetGroup.id) {
      //   const index = targetGroup.value.indexOf(targetBlock.id);
      //   store.commit('addIdToGroup', {
      //     groupId: targetGroup.id,
      //     id: catchBlockId,
      //     index: direction === 'up' ? index : index + 1,
      //   });
      // }

      // if (catchBlockGroup.id !== targetGroup.id) {
      //   const index = targetGroup.value.indexOf(targetBlock.id);
      //   store.commit('addIdToGroup', {
      //     groupId: targetGroup.id,
      //     id: catchBlockId,
      //     index: direction === 'up' ? index : index + 1,
      //   });
      //   store.commit('changeGroupIdFromBlock', {
      //     block: catchBlock,
      //     groupId: targetGroup.id,
      //   });
      // }
    };

    return {
      getFirstToUpper,
      handleDrop,
      cancelDefault,
      handleBeforeDrop,
      handleLeave,
      getLevelOfBlock,
    };
  },
};
</script>

<style lang="scss" scoped>
.drag-enter-active,
.drag-leave-active{
  transition: opacity 0.3s ease;
}

.drag-enter-from,
.drag-leave-to{
  opacity: 0;
}

.drag-enter-to,
.drag-leave-from{
  opacity: 1;
}
</style>
