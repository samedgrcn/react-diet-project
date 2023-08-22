import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC-FwYQYGmwzUe-SpuTHdpwby4heNR9MhU",
  authDomain: "kisiler-b0bb0.firebaseapp.com",
  databaseURL: "https://kisiler-b0bb0-default-rtdb.firebaseio.com",
  projectId: "kisiler-b0bb0",
  storageBucket: "kisiler-b0bb0.appspot.com",
  messagingSenderId: "64643279342",
  appId: "1:64643279342:web:27149e807843a85b9806ff"
};

export const adminCredentials = {
  email: "sam@gmail.com",
  password: "123456",
};


firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export default firebase;


