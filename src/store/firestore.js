/* eslint-disable no-await-in-loop */
import { toRefs } from 'vue';
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
      console.log(err);
      reject(err);
    });
  // db.collection('users')
  //   .doc(email)
  //   .get()
  //   .then((doc) => {
  //     resolve(doc.data());
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     reject(err);
  //   });
});

export const queryEmailFromFS = async (email) => new Promise((resolve, reject) => {
  console.log(email);
  db.collection('users')
    .where('email', '==', email)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        resolve(null);
      } else {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          resolve(doc.data());
        });
      }
    })
    .catch((err) => {
      console.log(err);
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
  const {
    pages,
    blocks,
    groups,
    userInfo,
  } = toRefs(store.state);
  console.log(userInfo.value);
  console.log(pages.value);
  const info = {
    userInfo: userInfo.value,
    pages: pages.value,
    blocks: blocks.value,
    groups: groups.value,
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

// export const getDataByCollectionFromFS = async (collection) => new Promise((resolve, reject) => {
//   db.collection(collection)
//     .get()
//     .then((querySnapshot) => {
//       resolve(querySnapshot);
//     })
//     .catch((err) => {
//       reject(err);
//     });
// });

// const getPageByIdFromFS = async (id) => {
//   db.collection('pages')
//     .doc(id)
//     .get()
//     .then((doc) => doc.data())
//     .catch((err) => {
//       console.log(err);
//       return null;
//     });
// };

// const getBlocksOfPageByIdFromFS = async (id) => {
//   db.collection('pages')
//     .doc(id)
//     .get()
//     .then((doc) => {
//       page = doc.data();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// const deletePageByIdInFS = async (id) => {
//   db.collection('pages')
//     .doc(id)
//     .delete()
//     .then(() => {
//       console.log('成功刪除page');
//     });
// };

// const deleteBlocksByPageIdInFS = async (id) => {
//   let page = {};
//   db.collection('pages')
//     .doc(id)
//     .get()
//     .then((doc) => {
//       page = doc.data();
//     })
//     .catch((err) => {
//       console.log(err);
//     });

//   const blocksIds = page.blocks;
//   const batch = db.batch();
//   blocksIds.forEach((blockId) => {
//     const ref = db.collection('blocks').doc(blockId);
//     batch.delete(ref);
//   });
// };

// export const getUserPagesIdsFromFS = async () => {
//   db.collection('users')
//     .where('email', '==', userInfo.value.email)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         console.log(doc.data());
//         return doc.data().pages;
//       });
//     })
//     .catch((err) => {
//       console.log('取pagesIds失敗');
//       return err;
//     });
// };

// const getExcludeAndInclude = (arrA, arrB) => {
//   const exclude = [];
//   const include = [];
//   for (let i = 0; i < arrA.length; i += 1) {
//     let isSame = false;
//     for (let j = 0; j < arrB.length; j += 1) {
//       if (arrA[i] === arrB[j]) {
//         isSame = true;
//         include.push(arrA[i]);
//         break;
//       }
//     }
//     if (!isSame) {
//       exclude.push(arrA[i]);
//     }
//   }
//   return {
//     exclude,
//     include,
//   };
// };

// const allPagesIds = computed(() => store.getters.allPagesIds);
// const allBlocksIds = computed(() => store.getters.allBlocksIds);

// const userPagesIdsFromFS = await getUserPagesIdsFromFS();
// const excludeAndInclude = getExcludeAndInclude(userPagesIdsFromFS, allPagesIds);
// const excludePagesIds = excludeAndInclude.exclude;
// const includePagesIds = excludeAndInclude.include;
// if (excludePagesIds.length !== 0) { // 處理有被刪除page的情況，也把FS的對應page以及內部block刪除
//   for (let i = 0; i < excludePagesIds.length; i += 1) {
//     await deletePageByIdInFS(excludePagesIds[i]);
//     await deleteBlocksByPageIdInFS(excludePagesIds[i]);
//   }
// }

// includePagesIds.forEach((pageId) => {

// })
