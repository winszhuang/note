<template>
  <div id="area-select"></div>
</template>

<script>
import {
  computed, onMounted, watch, // onMounted, toRef,
} from 'vue';
import { useStore } from 'vuex';
import { commonCollisionEffect, commonArrEffect } from './commonEffect';
import commonDomEffect from './commonDomEffect';

const useKeyboardEffect = () => {
  const store = useStore();
  const areaSelectDelete = (ids) => {
    ids.forEach((id) => {
      const chooseBlock = computed(() => store.getters['blocks/chooseBlock'](id)).value;
      store.dispatch('blocks/deleteBlock', {
        block: chooseBlock,
      });
    });
  };

  return { areaSelectDelete };
};

const useAreaSelectEffect = (el, boxCollisionDetection) => {
  const store = useStore();
  const { areaSelectDelete } = useKeyboardEffect();
  const { arrayList } = commonArrEffect();
  const selectIdsList = arrayList();

  const dom = el;
  const moveState = {
    value: false,
  };

  const box = {
    init: {
      left: 0,
      top: 0,
    },
    value: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    },
  };

  const allIds = {
    value: [],
  };

  const setAllIds = (ids) => {
    allIds.value = ids;
  };

  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 8 && selectIdsList.getArr() !== 0) {
      areaSelectDelete(selectIdsList.getArr());
    }
  });

  const changeElementsClassByIds = (selectIds, className) => {
    allIds.value.forEach((id) => {
      const innerEl = document.getElementById(id);
      if (!innerEl) return;
      const element = innerEl.closest('.block-content');
      if (element === null) return;
      if (element.classList.contains(className)) {
        element.classList.remove(className);
      }
    });

    if (selectIds.length === 0) return;

    selectIds.forEach((id) => {
      const element = document.getElementById(id).closest('.block-content');
      element.classList.add(className);
    });
  };

  const changeElementBoundingFromBox = (boxItem) => {
    const {
      left, top, width, height,
    } = boxItem.value;
    dom.style.left = `${left || 0}px`;
    dom.style.top = `${top || 0}px`;
    dom.style.width = `${width || 0}px`;
    dom.style.height = `${height || 0}px`;
  };

  const mouseDown = (e) => {
    console.log('??????????');
    if (moveState.value === true) return;
    if (e.target.closest('.block')) return;
    if (e.target.hasAttribute('contenteditable')) return;
    // if (e.target.innerText !== undefined) return;

    selectIdsList.setArr([]); // 點一下初始
    changeElementsClassByIds(selectIdsList.getArr(), 'block-selected');

    moveState.value = true;
    dom.hidden = 0;

    box.value = {};
    box.init = {};
    box.init.left = e.clientX;
    box.init.top = e.clientY;
    changeElementBoundingFromBox(box);
  };

  const mouseUp = () => {
    // console.log('7777777777777');
    moveState.value = false;
    dom.hidden = 1;
  };

  const updateAreaSelectBlocks = (boxData) => {
    const boxDataBounding = {
      left: boxData.left,
      right: boxData.left + boxData.width,
      top: boxData.top,
      bottom: boxData.top + boxData.height,
    };
    const currentBlocks = computed(() => store.getters['blocks/currentBlocks']).value;
    currentBlocks.forEach((block) => {
      const blockEl = document.getElementById(block.id);
      const rect = blockEl.getBoundingClientRect();
      const blockElBounding = {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
      };
      if (boxCollisionDetection(blockElBounding, boxDataBounding)) {
        selectIdsList.addArrId(block.id);
      } else {
        selectIdsList.deleteArrId(block.id);
      }
      changeElementsClassByIds(selectIdsList.getArr(), 'block-selected');
    });
    // console.log(selectIdsList.getArr());
  };

  const mouseMove = (e) => {
    if (moveState.value === false) return;

    const widthMinus = e.clientX - box.init.left;
    const heightMinus = e.clientY - box.init.top;
    if (widthMinus > 0) {
      box.value.left = box.init.left;
      box.value.width = widthMinus;
    } else {
      box.value.left = e.clientX;
      box.value.width = Math.abs(widthMinus);
    }

    if (heightMinus > 0) {
      box.value.top = box.init.top;
      box.value.height = heightMinus;
    } else {
      box.value.top = e.clientY;
      box.value.height = Math.abs(heightMinus);
    }

    if (box.value.width !== 0 || box.value.height !== 0) {
      e.preventDefault(); // 避免框到有input區域會反藍色
    }

    changeElementBoundingFromBox(box);
    updateAreaSelectBlocks(box.value);
  };

  return {
    setAllIds,
    mouseDown,
    mouseUp,
    mouseMove,
    changeElementBoundingFromBox,
  };
};

export default {
  name: 'AreaSelect',
  props: ['ids', 'workArea'],
  setup(props) {
    const { boxCollisionDetection } = commonCollisionEffect();
    const { getElementBySelector } = commonDomEffect();

    onMounted(() => {
      const select = document.getElementById('area-select');
      const workArea = getElementBySelector(props.workArea);
      const {
        mouseDown,
        mouseUp,
        mouseMove,
        setAllIds,
      } = useAreaSelectEffect(select, boxCollisionDetection);

      watch(() => props.ids, () => {
        setAllIds(props.ids);
      },
      { immediate: true });

      workArea.addEventListener('mousedown', mouseDown);
      document.addEventListener('mouseup', mouseUp);
      document.addEventListener('mousemove', mouseMove);

      // onBeforeUnmount(() => {
      //   document.removeEventListener('mousedown', mouseDown);
      //   document.removeEventListener('mouseup', mouseUp);
      //   document.removeEventListener('mousemove', mouseMove);
      // });
    });
  },
};
</script>

<style lang="scss" scoped>
#area-select{
  position: fixed;
  left: 0;
  top: 0;
  // width: 100%;
  // height: 100%;
  background: rgb(71, 71, 71);
  z-index: 3;
  opacity: .2;
  border: .2rem solid rgb(26, 26, 26);
}
</style>
