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

// 匯出firestore資料庫的實例
export const db = firebase.firestore();
// 匯出firebase的auth的實例
export const auth = firebase.auth();

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { TimeStamp, GeoPoint } = firebase.firestore;
export { TimeStamp, GeoPoint };

// if using Firebase JS SDK < 5.8.0
db.settings({ timestampsInSnapshots: true });
