import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';
import * as firebase from 'firebase/app';
import firebaseConfig from './firebasekey';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const functions = firebase.app().functions('us-east1');
functions.useFunctionsEmulator('http://localhost:9999');
export { db, firebase, functions };
