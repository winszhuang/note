import { ref } from 'vue';

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

const commonCollisionEffect = () => {
  const boxCollisionDetection = (a, b) => {
    if (a.right > b.left && a.left < b.right && a.top < b.bottom && a.bottom > b.top) {
      return true;
    }
    return false;
  };

  return { boxCollisionDetection };
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

// const sizeChangeEffect = (minSize, maxSize) => {
//   const size = ref(0);
//   const prevSize = ref(0);

//   const getSizeInRange = (offset) => {
//     size.value = prevSize.value + offset;
//     if (size.value > maxSize) size.value = maxSize;
//     if (size.value < minSize) size.value = minSize;
//     return size.value;
//   };

//   const setSize = (value) => {
//     size.value = value;
//   };

//   const get

//   const setPrevSize = (value) => {
//     prevSize.value = value;
//   }

//   const setSizeToPrevSize = () => {
//     prevSize.value = size.value;
//   };

// }

export {
  commonArrEffect,
  commonStringEffect,
  commonCollisionEffect,
  showEffect,
  transTimeStampToLocalTime,
  waitSecondAndCallBack,
};
