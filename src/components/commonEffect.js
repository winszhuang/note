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
  commonArrEffect,
  commonLocalStorageEffect,
  commonStringEffect,
  commonCollisionEffect,
};
