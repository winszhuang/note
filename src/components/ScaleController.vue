<template>
  <div class="scale-controller">
    <div class="scale-area">
      <div class="scale-compression"
            :style="{ width: width > 0 ? `${width}px` : 0 }"></div>
      <div class="scale-object" :style="{ height: `${getHeight}` }" :id="id">
        <slot :isActive="isActive"></slot>
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
            :style="{ width: width > 0 ? `${width}px` : 0 }"></div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { showEffect } from './commonEffect';

export default {
  name: 'ScaleController',
  props: ['aspectRatio', 'id', 'min-width'],
  setup(props) {
    let prevWidth = 0;
    const offsetX = ref('');
    const width = ref(0);
    const isActive = ref('false');
    const { isShow, handleShow } = showEffect();

    const getHeight = computed(() => {
      if (!props.aspectRatio) return 'auto';
      const aspectRatio = props.aspectRatio[0] / props.aspectRatio[1];
      const container = document.getElementsByClassName('blockcontent')[0].getBoundingClientRect();
      return `${(container.width - width.value * 2) / aspectRatio}px`;
    });

    onMounted(() => {
      isActive.value = false;
      // const scaleHandleLeft = document.getElementsByClassName('scale-handle-left')[0];
      // const scaleHandleRight = document.getElementsByClassName('scale-handle-right')[0];
      // const {
      //   mouseDown,
      //   mouseMove,
      //   mouseUp,
      // } = getMouseOffsetByClickElAndMove();

      let rightX = 0;
      let leftX = 0;
      let leftOrRightHandle = '';

      const scaleObject = document.getElementById(props.id);

      const mouseMoveLeft = (e) => {
        if (isActive.value === false) return;
        if (leftOrRightHandle === 'right') return;
        offsetX.value = e.clientX - leftX;
        width.value = prevWidth + offsetX.value;
        if (width.value > props.minWidth / 2) {
          width.value = props.minWidth / 2;
        }
        if (width.value < 0) {
          width.value = 0;
        }
      };

      const mouseMoveRight = (e) => {
        if (isActive.value === false) return;
        if (leftOrRightHandle === 'left') return;
        offsetX.value = rightX - e.clientX;
        width.value = prevWidth + offsetX.value;
        if (width.value > props.minWidth / 2) {
          width.value = props.minWidth / 2;
        }
        if (width.value < 0) {
          width.value = 0;
        }
      };

      const mouseUp = () => {
        prevWidth = width.value;
        isActive.value = false;
      };

      const mouseDownLeft = (e) => {
        // e.stopPropagation();
        e.preventDefault();
        isActive.value = true;
        offsetX.value = 0;
        leftX = e.clientX;
        leftOrRightHandle = 'left';
      };

      const mouseDownRight = (e) => {
        // e.stopPropagation();
        e.preventDefault();
        isActive.value = true;
        offsetX.value = 0;
        rightX = e.clientX;
        leftOrRightHandle = 'right';
      };

      scaleObject.addEventListener('mouseenter', () => {
        handleShow(true);
      });

      scaleObject.addEventListener('mouseleave', () => {
        handleShow(false);
      });

      scaleObject.querySelector('.scale-handle-left').addEventListener('mousedown', mouseDownLeft);
      scaleObject.querySelector('.scale-handle-right').addEventListener('mousedown', mouseDownRight);
      document.addEventListener('mousemove', mouseMoveLeft);
      document.addEventListener('mousemove', mouseMoveRight);
      document.addEventListener('mouseup', mouseUp);
    });

    return {
      // mouseDownInElement,
      // mouseMove,
      // mouseUp,
      offsetX,
      // setOffsetX,
      isShow,
      // multiEvent,
      getHeight,
      prevWidth,
      width,
      isActive,
    };
  },
};
</script>

<style lang="scss" scoped>
$frameX: .8rem;
$frameY: 50%;
.scale{
  &-controller{
    position: relative;
    width: 100%;
    height: 100%;
  }
  &-compression{
    transition: width .3s ease-out;
  }
  &-area{
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  &-object{
    flex: 1;
    position: relative;
    width: auto;
    transition: height .3s ease-out;
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
