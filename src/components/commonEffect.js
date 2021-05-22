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

  const pasteImage = (ev) => {
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
    console.log(ev.target.previousElementSibling);
    if (blob !== null) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // console.log(e.target.result); // data url!
        // eslint-disable-next-line no-param-reassign
        ev.target.nextElementSibling.src = e.target.result;
      };
      reader.readAsDataURL(blob);
    }
  };

  return {
    addClass,
    removeClass,
    editStyle,
    getElementsByIdsInArr,
    pasteImage,
  };
};

const commonArrEffect = () => {
  const arrayList = () => {
    const arr = {
      value: [],
    };

    return {
      addArrId: (id) => {
        if (arr.value.includes(id)) return;
        arr.value.push(id);
      },

      deleteArrId: (id) => {
        if (!arr.value.includes(id)) return;
        const index = arr.value.indexOf(id);
        arr.value.splice(index, 1);
      },

      getArr: () => arr.value,

      setArr: (newArr) => {
        arr.value = newArr;
      },

      isIncludeId: (id) => arr.value.includes(id),
    };
  };

  return {
    arrayList,
  };
};

const commonStringEffect = () => {
  const getFirstToUpper = (string) => string[0].toUpperCase() + string.slice(1);
  return { getFirstToUpper };
};

const commonLocalStorageEffect = () => {
  const setDataToLS = (key, value) => {
    let stringValue = '';
    if (typeof value === 'object' || value.isArray) {
      stringValue = JSON.stringify(value);
    }
    localStorage.setItem(key, stringValue);
  };

  const getDataFromLS = (key) => JSON.parse(localStorage.getItem(key));

  return { setDataToLS, getDataFromLS };
};

const commonCollisionEffect = () => {
  const boxCollisionDetection = (a, b) => {
    if (a.right > b.left && a.left < b.right && a.top < b.bottom && a.bottom > b.top) {
      return true;
    }
    return false;
  };

  return { boxCollisionDetection };
};

export {
  commonDomEffect,
  commonArrEffect,
  commonLocalStorageEffect,
  commonStringEffect,
  commonCollisionEffect,
};
