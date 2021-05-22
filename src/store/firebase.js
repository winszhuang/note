import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDonVssAookt2duygiVRQW24dFRQuKTkJU',
  authDomain: 'note-38484.firebaseapp.com',
  projectId: 'note-38484',
  storageBucket: 'note-38484.appspot.com',
  messagingSenderId: '929018557393',
  appId: '1:929018557393:web:16cc3fb617ecedc93826f0',
  measurementId: 'G-4GXGJN5W2F',
};

firebase.initializeApp(firebaseConfig);

// 獲取firestore資料庫的實例
export const db = firebase.firestore();

const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('已登入');
  } else {
    console.log('未登入');
  }
});

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
export const loginBySocialThen = (social, callback) => {
  let provider = {};
  console.log(social);
  if (social === 'google') {
    provider = new firebase.auth.GoogleAuthProvider();
  }
  if (social === 'facebook') {
    provider = new firebase.auth.FacebookAuthProvider();
  }
  if (social === 'twitter') {
    provider = new firebase.auth.TwitterAuthProvider();
  }

  auth.signInWithPopup(provider)
    .then((result) => {
      callback(result);
    })
    .catch(({
      code,
      message,
      email,
      credential,
    }) => {
      console.log(code, message, email, credential);
    });
};

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { TimeStamp, GeoPoint } = firebase.firestore;
export { TimeStamp, GeoPoint };

// if using Firebase JS SDK < 5.8.0
db.settings({ timestampsInSnapshots: true });
