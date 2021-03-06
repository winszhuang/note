/* eslint-disable no-await-in-loop */
import { computed } from 'vue';
import store from './index';
import { db } from './firebase';

export const getUserDataByEmailFromFS = async (email) => new Promise((resolve, reject) => {
  db.collection('users')
    .where('userInfo.email', '==', email)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        resolve(null);
      } else {
        querySnapshot.forEach((doc) => {
          resolve(doc.data());
        });
      }
    })
    .catch((err) => {
      reject(err);
    });
});

export const isUserDataInFS = async (user) => {
  try {
    const result = await getUserDataByEmailFromFS(user.email);
    if (result) return true;
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const queryEmailFromFS = async (email) => new Promise((resolve, reject) => {
  db.collection('users')
    .where('email', '==', email)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        resolve(null);
      } else {
        querySnapshot.forEach((doc) => {
          resolve(doc.data());
        });
      }
    })
    .catch((err) => {
      reject(err);
    });
});

export const setUserDataToFS = async (data) => new Promise((resolve, reject) => {
  db.collection('users')
    .doc(data.userInfo.email)
    .set(data)
    .then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
});

export const updateStoreToFS = async () => {
  const pages = computed(() => store.state.pages.pages);
  const blocks = computed(() => store.state.blocks.blocks);
  const userInfo = computed(() => store.state.userInfo.userInfo);

  const info = {
    userInfo: userInfo.value,
    pages: pages.value,
    blocks: blocks.value,
  };
  await setUserDataToFS(info);
};

export const getUserDataFromFS = async (email) => {
  db.collection('users')
    .doc(email)
    .get()
    .then((doc) => doc.data())
    .catch((err) => {
      console.log(err);
      return null;
    });
};
