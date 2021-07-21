import { reactive } from 'vue';
// import { useStore } from 'vuex';

const useAreaSelectEffect = (AllIds, isBoxACollisionB) => {
  let isActive = false;

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
    if (isActive === true) return;
    if (!e.target.closest('.workspace')) return;
    if (e.target.closest('.block') || e.target.hasAttribute('contenteditable')) {
      if (e.target.closest('.block-tools')) return;
      currentSelectedIds.length = 0;
      return;
    }

    e.preventDefault();
    // console.log('9999999999999999999999999999999999999');

    isActive = true;
    position.x1 = e.clientX;
    position.y1 = e.clientY;
    currentSelectedIds.length = 0;
  };

  const mouseMove = (e) => {
    if (isActive === false) return;

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

    AllIds.value.forEach((id) => {
      const blockEl = document.getElementById(id);
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
    isActive = false;
    setSelector(0, 0, 0, 0);
  };

  return {
    mouseDown,
    mouseUp,
    mouseMove,
    selector,
    currentSelectedIds,
  };
};

export default useAreaSelectEffect;
