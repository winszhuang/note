<template>
  <div class="block"
      :class="getClassNameOfBlockType(block.type)"
      :data-block-id="block.id"
      @mouseenter="handleShow(true)"
      @mouseleave="handleShow(false)"
      :style="{ 'margin-left': `${getLevelOfBlock(block)*1.65}rem`,
                'border-bottom': isUnderMouseInDrag
                  ? '.3rem solid rgb(134, 193, 241)' : 'none' }">
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
        @drop="$emit('drop', $event)"
        @dragenter="$emit('dragenter', $event)"
        @dragover="$emit('dragover', $event)">
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
import DragItem from './DragItem.vue';

export default {
  name: 'Block',
  props: ['block', 'isSelected', 'isUnderMouseInDrag'],
  components: { DragItem },
  setup() {
    const store = useStore();
    const { isShow, handleShow } = showEffect();
    const { getLevelOfBlock } = commonBlockEffect();
    const { getFirstToUpper } = commonStringEffect();

    // eslint-disable-next-line max-len
    const getClassNameOfBlockType = (type) => computed(() => store.getters.getClassNameOfBlockType(type)).value;

    return {
      isShow,
      handleShow,
      getFirstToUpper,
      // handleLeave,
      getLevelOfBlock,
      getClassNameOfBlockType,
      // setBlockBottom,
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
