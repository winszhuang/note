import { ref, reactive } from 'vue';

const commonDomEffect = () => {
  const addClass = (el, className) => {
    el.classList.add(className);
  };

  const removeClass = (el, className) => {
    el.classList.remove(className);
  };

  const editStyle = (el, property, value, extra) => {
    // eslint-disable-next-line no-param-reassign
    el.style[property] = value || extra;
  };

  const getElementsByIdsInArr = (arr) => {
    let selectors = '';
    arr.forEach((id, key, array) => {
      selectors += `#${id}${key === array.length - 1 ? '' : ', '}`;
      console.log(selectors);
    });
    console.log(selectors);
    return document.querySelectorAll(selectors);
  };

  const pasteImage = (ev, id) => {
    const { items } = ev.clipboardData || ev.originalEvent.clipboardData;
    console.log(JSON.stringify(items)); // will give you the mime types
    // find pasted image among pasted items
    let blob = null;
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].type.indexOf('image') === 0) {
        blob = items[i].getAsFile();
      }
    }
    // load image if there is a pasted image
    // console.log(ev.target.previousElementSibling);
    if (blob !== null) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById(id).src = e.target.result;
        // console.log(e.target.result); // data url!
      };
      reader.readAsDataURL(blob);
    }
  };

  const showEffect = () => {
    const isShow = ref(false);

    const handleShow = (isTrueOrFalse) => {
      isShow.value = isTrueOrFalse;
    };

    const toggleShow = () => {
      isShow.value = !isShow.value;
    };

    return {
      isShow,
      handleShow,
      toggleShow,
    };
  };

  const mouseDownMoveUpEffect = () => {
    const isMouseAction = ref(false);
    const mousePosition = reactive({
      x: '',
      y: '',
    });

    const setMousePosition = (e) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    };

    const cancelDefault = (e) => {
      e.preventDefault();
    };

    const mouseDown = (e, callback) => {
      isMouseAction.value = true;
      setMousePosition(e);
      if (callback) callback(e);
    };

    const mouseDownInElement = (e, target, callback) => {
      if (!target) return;
      if (e.target !== target) return;
      mouseDown(e, callback);
    };

    const mouseMove = (e, callback) => {
      if (isMouseAction.value === false) return;
      // cancelDefault(e);
      setMousePosition(e);
      if (callback) callback(e);
    };

    const mouseUp = (e, callback) => {
      if (isMouseAction.value === false) return;
      console.log('停止');
      cancelDefault(e);
      isMouseAction.value = false;
      setMousePosition(e);
      if (callback) callback(e);
    };

    return {
      mouseDown,
      mouseMove,
      mouseDownInElement,
      mouseUp,
      mousePosition,
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

  return {
    addClass,
    removeClass,
    editStyle,
    getElementsByIdsInArr,
    pasteImage,
    showEffect,
    dragDropEffect,
    mouseDownMoveUpEffect,
    isMouseInsideElement,
  };
};

export default commonDomEffect;
