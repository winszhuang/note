import { reactive, ref } from 'vue';

const updateIDsEffectByDragDrop = (allIds, getTargetId, getCatchIds) => {
  const ids = reactive({ value: [] });
  const currentIdUnderTheMouse = ref('');

  const cancelDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBeforeDrop = (e) => {
    cancelDefault(e);
    currentIdUnderTheMouse.value = getTargetId(e);
  };

  const handleDrop = (e, callback) => {
    cancelDefault(e);

    currentIdUnderTheMouse.value = '';

    const catchIds = getCatchIds(e);
    const targetId = getTargetId(e);

    if (catchIds.includes(targetId)) return;

    const newArr = allIds.value.filter((id) => !catchIds.includes(id));
    const newIndex = newArr.indexOf(targetId);

    Array.prototype.splice.apply(newArr, [newIndex + 1, 0, ...catchIds]);
    ids.value = newArr;

    callback();
  };

  return {
    ids,
    currentIdUnderTheMouse,
    cancelDefault,
    handleDrop,
    handleBeforeDrop,
  };
};

export default updateIDsEffectByDragDrop;
