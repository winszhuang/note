import { reactive, ref } from 'vue';
// import { useStore } from 'vuex';

const useAreaSelectEffect = (AllIds, isBoxACollisionB) => {
  const isAreaSelectActive = ref(false);

  const currentSelectedIds = reactive([]);

  const selector = reactive({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const position = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  };

  const setSelector = (left, top, width, height) => {
    selector.left = left;
    selector.top = top;
    selector.width = width;
    selector.height = height;
  };

  const mouseDown = (e) => {
    if (isAreaSelectActive.value === true) return;
    if (!e.target.closest('.workspace')) return;
    if (e.target.closest('.block') || e.target.hasAttribute('contenteditable')) {
      if (e.target.closest('.block-tools')) return;
      currentSelectedIds.length = 0;
      return;
    }

    // e.preventDefault();

    isAreaSelectActive.value = true;
    position.x1 = e.clientX;
    position.y1 = e.clientY;
    currentSelectedIds.length = 0;
  };

  const mouseMove = (e) => {
    if (isAreaSelectActive.value === false) return;
    e.preventDefault();
    e.stopPropagation();

    document.activeElement.blur();

    position.x2 = e.clientX;
    position.y2 = e.clientY;

    const left = Math.min(position.x1, position.x2);
    const top = Math.min(position.y1, position.y2);
    const width = Math.abs(position.x2 - position.x1);
    const height = Math.abs(position.y2 - position.y1);

    // console.log(left, top, width, height);

    setSelector(left, top, width, height);

    const selectorBox = {
      left,
      top,
      right: left + width,
      bottom: top + height,
    };

    if (!AllIds.value) return; // 處理這行
    AllIds.value.forEach((id) => {
      const blockEl = document.querySelector(`[data-block-id="${id}"]`);
      const blockBounding = blockEl.getBoundingClientRect();
      if (isBoxACollisionB(selectorBox, blockBounding)) {
        // console.log(`框到id是${id}了`);
        if (currentSelectedIds.includes(id)) return;
        currentSelectedIds.push(id);
      } else {
        if (!currentSelectedIds.includes(id)) return;
        const index = currentSelectedIds.indexOf(id);
        currentSelectedIds.splice(index, 1);
      }
    });
    // console.log(currentSelectedIds);

    // if (box.value.width !== 0 || box.value.height !== 0) {
    //   e.preventDefault(); // 避免框到有input區域會反藍色
    // }
  };

  const mouseUp = () => {
    isAreaSelectActive.value = false;
    setSelector(0, 0, 0, 0);
  };

  return {
    mouseDown,
    mouseUp,
    mouseMove,
    selector,
    currentSelectedIds,
    isAreaSelectActive,
  };
};

export default useAreaSelectEffect;
