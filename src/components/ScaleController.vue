<template>
  <div class="scale-controller">
    <div class="scale-area">
      <div class="scale-compression"
            :style="{ width: offsetX > 0 ? `${offsetX}px` : 0 }"></div>
      <div class="scale-object" :style="{ height: `${getHeight}` }">
        <slot></slot>
        <transition>
          <div class="scale-handle-left" v-show="isShow">
            <div class="scale-handle-item">
            </div>
          </div>
        </transition>
        <transition>
          <div class="scale-handle-right" v-show="isShow">
            <div class="scale-handle-item">
            </div>
          </div>
        </transition>
      </div>
      <div class="scale-compression"
            :style="{ width: offsetX > 0 ? `${offsetX}px` : 0 }"></div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import commonDomEffect from './commonDomEffect';

export default {
  name: 'ScaleController',
  props: ['aspectRatio'],
  setup(props) {
    const offsetX = ref('');
    const container = document.querySelector('.blockcontent').getBoundingClientRect();
    const { showEffect, mouseDownMoveUpEffect } = commonDomEffect();
    const { isShow, handleShow } = showEffect();
    const {
      mouseDownInElement,
      mouseMove,
      mouseUp,
      mousePosition,
    } = mouseDownMoveUpEffect();

    const setOffsetX = () => {
      if (mousePosition.x < container.left + container.width / 2) { // 表示點擊的是左邊的滑桿
        offsetX.value = computed(() => mousePosition.x - container.left).value;
      } else {
        offsetX.value = computed(() => container.right - mousePosition.x).value;
      }

      if (offsetX.value < 0) offsetX.value = 0;
    };

    const multiEvent = (e) => {
      mouseMove(e, setOffsetX);
      if (e.target.closest('.scale-controller')) {
        handleShow(true);
      } else {
        handleShow(false);
      }
    };

    const getHeight = computed(() => {
      if (!props.aspectRatio) return 'auto';
      const aspectRatio = props.aspectRatio[0] / props.aspectRatio[1];
      return `${(container.width - offsetX.value * 2) / aspectRatio}px`;
    });

    onMounted(() => {
      const handleItems = document.querySelectorAll('.scale-handle-item');
      const workspace = document.querySelector('.workspace');

      workspace.addEventListener('mouseup', (e) => mouseUp(e));
      workspace.addEventListener('mousedown', (e) => mouseDownInElement(e, handleItems[0], setOffsetX));
      workspace.addEventListener('mousedown', (e) => mouseDownInElement(e, handleItems[1], setOffsetX));
      workspace.addEventListener('mousemove', (e) => multiEvent(e));
    });

    return {
      mouseDownInElement,
      mouseMove,
      mouseUp,
      offsetX,
      setOffsetX,
      isShow,
      multiEvent,
      getHeight,
    };
  },
};
</script>

<style lang="scss">
$frameX: .4rem;
$frameY: 50%;
.scale{
  &-controller{
    position: relative;
    width: 100%;
    height: 100%;
  }
  &-area{
    display: flex;
    justify-content: space-between;
  }
  &-object{
    flex: 1;
    position: relative;
  }
  &-handle{
    &-right{
      position: absolute;
      top: $frameY;
      right: $frameX;
      transform: translateY(-50%);
    }
    &-left{
      position: absolute;
      top: $frameY;
      left: $frameX;
      transform: translateY(-50%);
    }
    &-item{
      width: .4rem;
      height: 3rem;
      border: .01rem solid #FFF;
      opacity: .7;
      border-radius: .2rem;
      cursor: col-resize;
    }
  }
}
</style>
