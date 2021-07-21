import { computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { generateRandomString } from './commonEffect';

const changeIdPositionEffect = (allIds) => {
  // const store = useStore();
  const ids = reactive([...allIds.value]);

  const cancelDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBeforeDrop = (e) => {
    cancelDefault(e);

    const catchId = e.dataTransfer.getData('text/plain');
    const targetId = e.target.id;

    // if (catchId === targetId) return;


  }
}

export default changeIdPositionEffect;
