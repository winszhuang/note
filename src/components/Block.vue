<template>
  <div class="block"
      @mouseenter="handleShow(true)"
      @mouseleave="handleShow(false)"
      :style="{ 'margin-left': `${getLevelOfBlock(block)*1.65}rem` }">
    <div class="block-drag" >
      <transition name="drag">
        <DragItem :block="block"
                  v-show="isShow"/>
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
import { commonStringEffect, showEffect } from './commonEffect';
import commonBlockEffect from './commonBlockEffect';
import dragDropActionInBlocks from './dragDropActionInBlocks';
import DragItem from './DragItem.vue';

export default {
  name: 'Block',
  props: ['block'],
  components: { DragItem },
  setup() {
    const { isShow, handleShow } = showEffect();
    const { getLevelOfBlock } = commonBlockEffect();
    const { getFirstToUpper } = commonStringEffect();
    const {
      handleDrop,
      cancelDefault,
      handleBeforeDrop,
      handleLeave,
    } = dragDropActionInBlocks();

    return {
      isShow,
      handleShow,
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
