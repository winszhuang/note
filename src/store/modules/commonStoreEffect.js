export const findInStoreById = (collection, id) => collection.find((item) => item.id === id);

export const arrayDeleteByValue = (arr, value) => {
  console.log(value);
  const newArr = [...arr];
  // newArr.forEach((e) => {
  //   console.log(e);
  // });
  const index = newArr.indexOf(value);
  // console.log(index);
  newArr.splice(index, 1);
  return newArr;
};
