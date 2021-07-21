<template>
  <div class="block"
      :class="getClassNameOfBlockType(block.type)"
      @mouseenter="handleShow(true)"
      @mouseleave="handleShow(false)"
      :style="{ 'margin-left': `${getLevelOfBlock(block)*1.65}rem`}">
    <div class="block-tools">
      <transition name="drag">
        <div class="block-tool"
            v-show="isShow"
            type="button"
            @click="$emit('showBlockStyleEditor', true)">
          <font-awesome-icon :icon="['fas', 'adjust']" size="xs"/>
        </div>
      </transition>
      <transition name="drag">
        <DragItem :block="block"
                  v-show="isShow"/>
      </transition>
    </div>
    <div class="block-content"
        :class="{ 'block-selected': isSelected }"
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
import { commonStringEffect, showEffect } from './commonEffect';
import commonBlockEffect from './commonBlockEffect';
import dragDropActionInBlocks from './dragDropActionInBlocks';
import DragItem from './DragItem.vue';

export default {
  name: 'Block',
  props: ['block', 'isSelected'],
  components: { DragItem },
  setup() {
    const store = useStore();
    // const blocktype = computed(() => store.state.blocktype);
    const { isShow, handleShow } = showEffect();
    const { getLevelOfBlock } = commonBlockEffect();
    const { getFirstToUpper } = commonStringEffect();
    const {
      handleDrop,
      cancelDefault,
      handleBeforeDrop,
      handleLeave,
    } = dragDropActionInBlocks();

    // eslint-disable-next-line max-len
    const getClassNameOfBlockType = (type) => computed(() => store.getters.getClassNameOfBlockType(type)).value;

    return {
      isShow,
      handleShow,
      getFirstToUpper,
      handleDrop,
      cancelDefault,
      handleBeforeDrop,
      handleLeave,
      getLevelOfBlock,
      getClassNameOfBlockType,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../style/component/_block.scss';
@import '../style/_block-styles.scss';
@import '../style/component/_block-type.scss';
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
