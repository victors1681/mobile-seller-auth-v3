import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';
import * as firebase from 'firebase/app';
import firebaseConfig from './firebasekey';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const functions = firebase.app().functions('us-central1');

if (process.env.NODE_ENV === 'development') {
  //   db.settings({
  //     host: 'localhost:8081',
  //     ssl: false
  //   });
  functions.useFunctionsEmulator('http://localhost:9999');

  console.log('FIREBASE MODE: ', process.env.NODE_ENV);
}

export { db, firebase, functions };
