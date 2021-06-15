import firebase from 'firebase/app';
import { auth } from './firebase';

export const checkAuthState = (callback) => { // 會根據狀態自動執行
  auth.onAuthStateChanged((user) => {
    callback(user);
  });
};

export const signUp = (email, password) => {
  const promise = auth.createUserWithEmailAndPassword(email, password);
  promise.catch((e) => console.log(e.message));
};

export const signOut = () => {
  auth.signOut();
  console.log('已登出');
};

export const signIn = (email, password) => {
  const promise = auth.signInWithEmailAndPassword(email, password);
  promise.catch((e) => {
    console.log(e.message);
  });
};

// 此方法用來判斷使用哪個社群登入並且自己輸入callback處理登入後動作
export const loginBySocialThen = async (social) => {
  const brand = () => ({
    google: () => new firebase.auth.GoogleAuthProvider(),
    facebook: () => new firebase.auth.FacebookAuthProvider(),
    twitter: () => new firebase.auth.TwitterAuthProvider(),
  });

  const provider = brand()[social]();
  // console.log(provider);

  return new Promise((resolve, reject) => {
    auth.signInWithPopup(provider)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => { // error包含code, message, email, credential
        reject(err);
      });
  });
};
