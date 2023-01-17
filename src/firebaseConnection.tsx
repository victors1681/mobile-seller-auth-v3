import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';
import * as firebase from 'firebase/app';
import firebaseConfig from './firebasekey';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const functions = firebase.app().functions('us-east1');

if (process.env.NODE_ENV === 'development') {
  console.log('EMULATOR RUNNING 🚀🚀 🚀 🚀  ');
  //I'm having problems setting up the evn.
  // db.settings({
  //   host: 'localhost:8081',
  //   ssl: false
  // });
  //Usar emmulador
  // functions.useFunctionsEmulator('http://192.168.1.210:9999');

  console.error('FIREBASE MODE: ', process.env.NODE_ENV, ' Functions: http://192.168.1.210:9999');
}

export { db, firebase, functions };
