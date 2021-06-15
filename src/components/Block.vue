<template>
  <div class="block" :style="{ 'margin-left': `${getLevelOfBlock(block)*1.65}rem` }">
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
import { commonStringEffect } from './commonEffect';
import commonBlockEffect from './commonBlockEffect';
import dragDropActionInBlocks from './dragDropActionInBlocks';
import DragItem from './DragItem.vue';

export default {
  name: 'Block',
  props: ['block', 'showdrag'],
  components: { DragItem },
  setup() {
    const { getLevelOfBlock } = commonBlockEffect();
    const { getFirstToUpper } = commonStringEffect();
    const {
      handleDrop,
      cancelDefault,
      handleBeforeDrop,
      handleLeave,
    } = dragDropActionInBlocks();

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
