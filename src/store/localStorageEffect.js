const transToString = (value) => (typeof value === 'object' || value.isArray
  ? JSON.stringify(value) : value);

export const setDataToLS = (key, value) => {
  const strValue = transToString(value);
  // console.log(strValue);
  // console.log(strValue.length);
  localStorage.setItem(key, strValue);
};

export const getDataFromLS = (key) => JSON.parse(localStorage.getItem(key));

export const isDataInLS = (key) => {
  // console.log(getDataFromLS(key));
  if (getDataFromLS(key)) {
    return true;
  }
  return false;
};

export const deleteDataFromLS = (key) => {
  localStorage.removeItem(key);
};
