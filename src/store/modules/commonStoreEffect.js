export const findInStoreById = (collection, id) => collection.find((item) => item.id === id);

export const arrayDeleteByValue = (arr, value) => {
  const newArr = [...arr];
  const index = newArr.indexOf(value);
  newArr.splice(index, 1);
  return newArr;
};
