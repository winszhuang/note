import { reactive } from 'vue';

const commonDomEffect = () => {
  const getElementsByIdsInArr = (arr) => {
    let selectors = '';
    arr.forEach((id, key, array) => {
      selectors += `#${id}${key === array.length - 1 ? '' : ', '}`;
      console.log(selectors);
    });
    console.log(selectors);
    return document.querySelectorAll(selectors);
  };

  const getElementBySelector = (selector) => {
    let element = '';
    if (selector.charAt(0) === '.') {
      console.log('是class');
      // eslint-disable-next-line prefer-destructuring
      element = document.getElementsByClassName(selector.slice(1))[0];
    }
    if (selector.charAt(0) === '#') {
      console.log('是id');
      element = document.getElementById(selector.slice(1));
    }
    return element;
  };

  const getDataURLByClipBoardData = async (ev) => new Promise((resolve, reject) => {
    const { items } = ev.clipboardData || ev.originalEvent.clipboardData;
    // find pasted image among pasted items
    let blob = null;
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].type.indexOf('image') === 0) {
        blob = items[i].getAsFile();
      }
    }

    if (blob !== null) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(blob);
    }
  });

  const getMouseOffsetByClickElAndMove = () => {
    let isTrigger = false;
    const startPoint = {
      x: '',
      y: '',
    };

    const setStartPoint = (x, y) => {
      startPoint.x = x;
      startPoint.y = y;
    };

    const mouseOffset = reactive({
      x: '',
      y: '',
    });

    const setOffset = (x, y) => {
      mouseOffset.x = x;
      mouseOffset.y = y;
    };

    const mouseDown = (e, callback) => {
      e.preventDefault();
      setStartPoint(e.clientX, e.clientY);
      setOffset(0, 0);
      isTrigger = true;
      callback(mouseOffset);
    };

    const mouseMove = (e, callback) => {
      if (isTrigger === true) {
        e.preventDefault();
        setOffset(e.clientX - startPoint.x, e.clientY - startPoint.y);
        callback(mouseOffset);
      }
    };

    const mouseUp = (e, callback) => {
      e.preventDefault();
      isTrigger = false;
      callback(mouseOffset);
    };

    // for (let i = 0; i < elements.length; i += 1) {
    //   elements[i].addEventListener('mousedown', (e) => mouseDown(e, mouseDownThen));
    // }
    // document.addEventListener('mousemove', (e) => mouseMove(e, mouseMoveThen));
    // document.addEventListener('mouseup', (e) => mouseUp(e, mouseUpThen));

    return {
      mouseDown,
      mouseMove,
      mouseUp,
      mouseOffset,
    };
  };

  const isMouseInsideElement = (el, e) => {
    const x = e.clientX;
    const y = e.clientY;
    const boundingRect = el.getBoundingClientRect();
    if (x < boundingRect.left || x > boundingRect.left + boundingRect.width
      || y < boundingRect.top || y > boundingRect.top + boundingRect.height) return false;
    return true;
  };

  const isMouseUnderTheElement = (el, e) => {
    const x = e.clientX;
    const y = e.clientY;
    const boundingRect = el.getBoundingClientRect();
    if (x > boundingRect.left && x < boundingRect.left + boundingRect.width
      && y > boundingRect.top + boundingRect.height) return true;
    return false;
  };

  const dragDropEffect = () => {
    const domObject = () => {
      const data = {
        dom: '',
        value: '',
      };

      return {
        setDom: (dom) => {
          if (!dom) return;
          data.dom = dom;
        },

        setValue: (value) => {
          data.value = value;
        },

        getDom: () => data.dom,

        getValue: () => data.value,

        reset: () => {
          data.dom = '';
          data.value = '';
        },
      };
    };
    return { domObject };
    // const catchObject = domObject();
    // const targetObjetc = domObject();
  };

  // const

  return {
    getElementsByIdsInArr,
    getElementBySelector,
    getDataURLByClipBoardData,
    dragDropEffect,
    getMouseOffsetByClickElAndMove,
    isMouseInsideElement,
    isMouseUnderTheElement,
  };
};

export default commonDomEffect;

// class DomObject {
//   constructor(dom, data) {
//     this.dom = dom;
//     this.data = data;
//   }

//   get dom() {
//     return this.dom;
//   }

//   set dom(dom) {
//     this.dom = dom;
//   }

//   get data() {
//     return this.data;
//   }

//   set data(data) {
//     this.data = data;
//   }
// }

// const addClass = (el, className) => {
//   el.classList.add(className);
// };

// const removeClass = (el, className) => {
//   el.classList.remove(className);
// };

// const editStyle = (el, property, value, extra) => {
//   // eslint-disable-next-line no-param-reassign
//   el.style[property] = value || extra;
// };
