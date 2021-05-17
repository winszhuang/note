<template>
  <div
    id="area-select"
  ></div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { commonArrEffect } from './commonEffect';

const useCollisionEffect = () => {
  const boxCollisionDetection = (a, b) => {
    if (a.right > b.left && a.left < b.right && a.top < b.bottom && a.bottom > b.top) {
      return true;
    }
    return false;
  };

  return { boxCollisionDetection };
};

const useKeyboardEffect = () => {
  const store = useStore();
  const areaSelectDelete = (ids) => {
    ids.forEach((id) => {
      const chooseBlock = computed(() => store.getters.chooseBlock(id)).value;
      store.dispatch('deleteBlock', {
        block: chooseBlock,
      });
    });
  };

  return { areaSelectDelete };
};

const useMouseEffect = (el, boxCollisionDetection) => {
  const { areaSelectDelete } = useKeyboardEffect();
  const store = useStore();
  const allCurrentBlocksIds = computed(() => store.getters.currentBlocksIds).value;
  const { arrayList } = commonArrEffect();
  const selectIdsList = arrayList();
  // const {
  //   addClass,
  //   removeClass,
  //   // getElementsByIdsInArr,
  // } = commonDomEffect();
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

  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 8 && selectIdsList.getArr() !== 0) {
      areaSelectDelete(selectIdsList.getArr());
    }
  });

  const changeElementsClassByIds = (allIds, selectIds, className) => {
    allIds.forEach((id) => {
      const element = document.getElementById(id);
      element.classList.remove(className);
    });

    if (selectIds.length === 0) return;

    selectIds.forEach((id) => {
      const element = document.getElementById(id);
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
    if (moveState.value === true) return;
    if (e.target.tagName === 'svg' || e.target.tagName === 'path' || e.target.tagName === 'INPUT') {
      console.log('碰到drag或input');
      return;
    }
    selectIdsList.setArr([]); // 點一下初始化
    changeElementsClassByIds(allCurrentBlocksIds, selectIdsList.getArr(), 'block-selected');

    moveState.value = true;
    dom.hidden = 0;

    box.value = {};
    box.init = {};
    box.init.left = e.clientX;
    box.init.top = e.clientY;
    changeElementBoundingFromBox(box);
  };

  const mouseUp = () => {
    moveState.value = false;
    dom.hidden = 1;
    // store.commit('changeBlocksByAreaSelect', {
    //   arr: selectIdsList.getArr,
    // });
  };

  const updateAreaSelectBlocks = (boxData) => {
    const boxDataBounding = {
      left: boxData.left,
      right: boxData.left + boxData.width,
      top: boxData.top,
      bottom: boxData.top + boxData.height,
    };
    const currentBlocks = computed(() => store.getters.currentBlocks).value;
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
      changeElementsClassByIds(allCurrentBlocksIds, selectIdsList.getArr(), 'block-selected');
    });
    // console.log('3333333333333333');
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
    mouseDown,
    mouseUp,
    mouseMove,
    changeElementBoundingFromBox,
  };
};

export default {
  name: 'AreaSelect',
  setup() {
    let areaSelect = '';

    onMounted(() => {
      areaSelect = document.getElementById('area-select');

      const { boxCollisionDetection } = useCollisionEffect();
      const { mouseDown, mouseUp, mouseMove } = useMouseEffect(areaSelect, boxCollisionDetection);

      document.addEventListener('mousedown', mouseDown);
      document.addEventListener('mouseup', mouseUp);
      document.addEventListener('mousemove', mouseMove);
    });
  },
};
</script>

<style lang="scss" scoped>
#area-select{
  position: absolute;
  background: rgb(71, 71, 71);
  z-index: 3;
  opacity: .2;
  border: .2rem solid rgb(26, 26, 26);
}
</style>
