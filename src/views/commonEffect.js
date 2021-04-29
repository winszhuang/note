// 讓首字母大寫
const commonEffect = () => {
  const getFirstToUpper = (string) => string[0].toUpperCase() + string.slice(1);

  return { getFirstToUpper };
};

export default commonEffect;
