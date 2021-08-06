import { ref } from 'vue';

const generateRandomString = () => Math.random().toString(36).substr(2, 14)
  + Date.now().toString(36).substr(4, 14);

// https://stackoverflow.com/questions/23601792/get-only-light-colors-randomly-using-javascript/23603772
const getRandomLightColor = () => {
  const letters = 'BCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
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

const insertIds = (oldIds, addIds, spliceFunctionArr) => {
  const ids = [...oldIds];

  Array.prototype.splice.apply(ids, spliceFunctionArr(ids));

  return ids;
};

const commonStringEffect = () => {
  const getFirstToUpper = (string) => string[0].toUpperCase() + string.slice(1);

  return { getFirstToUpper };
};

const commonCollisionEffect = () => {
  const isBoxACollisionB = (a, b) => {
    if (a.right > b.left && a.left < b.right && a.top < b.bottom && a.bottom > b.top) {
      return true;
    }
    return false;
  };

  return { isBoxACollisionB };
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

const transTimeStampToLocalTime = (timestamp) => {
  let number = timestamp;
  if (typeof timestamp === 'string') {
    number = parseInt(timestamp, 10);
  }
  return new Date(number).toLocaleString().slice(0, -3);
};

const waitSecondAndCallBack = async (second, callback) => new Promise((resolve) => {
  setTimeout(() => {
    callback();
    resolve();
  }, second * 1000);
});

export {
  commonArrEffect,
  commonStringEffect,
  commonCollisionEffect,
  showEffect,
  transTimeStampToLocalTime,
  waitSecondAndCallBack,
  generateRandomString,
  getRandomLightColor,
  insertIds,
};
