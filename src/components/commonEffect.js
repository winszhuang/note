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

  return {
    addClass,
    removeClass,
    editStyle,
    getElementsByIdsInArr,
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

      getArr: () => {
        console.log(arr.value);
        return arr.value;
      },

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

export { commonDomEffect, commonArrEffect };
