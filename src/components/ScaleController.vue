<template>
  <div class="scale-controller my-4">
    <div class="scale-area">
      <div class="scale-compression"
            :style="{ width: width > 0 ? `${width}px` : 0 }"></div>
      <div class="scale-object" :style="{ height: `${getHeight}` }" :id="id">
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
            :style="{ width: width > 0 ? `${width}px` : 0 }"></div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { showEffect } from './commonEffect';
// import commonDomEffect from './commonDomEffect';

export default {
  name: 'ScaleController',
  props: ['aspectRatio', 'id'],
  setup(props) {
    let prevWidth = 0;
    const offsetX = ref('');
    const width = ref(0);
    const { isShow, handleShow } = showEffect();

    const getHeight = computed(() => {
      if (!props.aspectRatio) return 'auto';
      const aspectRatio = props.aspectRatio[0] / props.aspectRatio[1];
      const container = document.getElementsByClassName('blockcontent')[0].getBoundingClientRect();
      console.log(container.width);
      return `${(container.width - width.value * 2) / aspectRatio}px`;
    });

    onMounted(() => {
      let rightX = 0;
      let leftX = 0;

      const scaleObject = document.getElementById(props.id);

      const mouseMoveLeft = (e) => {
        offsetX.value = e.clientX - leftX;
        width.value = prevWidth + offsetX.value;
        if (width.value < 0) width.value = 0;
        // console.log(width.value);
      };

      const mouseMoveRight = (e) => {
        offsetX.value = rightX - e.clientX;
        console.log(offsetX.value);
        width.value = prevWidth + offsetX.value;
        if (width.value * 2 > scaleObject.clientWidth) {
          width.value = scaleObject.clientWidth / 2;
        }
        if (width.value < 0) {
          width.value = 0;
        }
        console.log(width.value);
      };

      const mouseUp = () => {
        prevWidth = width.value;
        document.removeEventListener('mousemove', mouseMoveLeft);
        document.removeEventListener('mousemove', mouseMoveRight);
      };

      const mouseDownLeft = (e) => {
        offsetX.value = 0;
        leftX = e.clientX;
        document.addEventListener('mousemove', mouseMoveLeft);
        document.addEventListener('mouseup', mouseUp);
      };

      const mouseDownRight = (e) => {
        offsetX.value = 0;
        rightX = e.clientX;
        document.addEventListener('mousemove', mouseMoveRight);
        document.addEventListener('mouseup', mouseUp);
      };

      scaleObject.addEventListener('mouseenter', () => {
        handleShow(true);
      });

      scaleObject.addEventListener('mouseleave', () => {
        handleShow(false);
      });

      scaleObject.querySelector('.scale-handle-left').addEventListener('mousedown', mouseDownLeft);
      scaleObject.querySelector('.scale-handle-right').addEventListener('mousedown', mouseDownRight);

      // workspace.addEventListener('mouseup', (e) => mouseUp(e));
      // eslint-disable-next-line max-len
      // workspace.addEventListener('mousedown', (e) => mouseDownInElement(e, handleItems[0], setOffsetX));
      // eslint-disable-next-line max-len
      // workspace.addEventListener('mousedown', (e) => mouseDownInElement(e, handleItems[1], setOffsetX));
      // workspace.addEventListener('mousemove', (e) => multiEvent(e));
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
    };
  },
};
</script>

<style lang="scss">
$frameX: .8rem;
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
    width: 100%;
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
