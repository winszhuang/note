import { reactive, ref } from 'vue';

const updateIDsEffectByDragDrop = (allIds, getIdByCustomMethod) => {
  // const store = useStore();
  const ids = reactive({ value: [] });
  const currentIdUnderTheMouse = ref('');
  // let el = '';

  const cancelDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBeforeDrop = (e) => {
    cancelDefault(e);
    const catchId = e.dataTransfer.getData('text/plain');
    console.log(catchId);

    const currentId = getIdByCustomMethod(e);
    if (currentId === catchId) return;
    currentIdUnderTheMouse.value = currentId;
    // if (e.target !== el) {
    //   console.log(currentIdUnderTheMouse.value);
    // }
    // el = e.target;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    currentIdUnderTheMouse.value = '';

    const catchId = e.dataTransfer.getData('text/plain');
    const targetId = getIdByCustomMethod(e);

    if (catchId === targetId) return;

    const newArr = allIds.value.filter((id) => id !== catchId);

    const newIndex = newArr.indexOf(targetId);
    newArr.splice(newIndex + 1, 0, catchId);

    ids.value = newArr;
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
