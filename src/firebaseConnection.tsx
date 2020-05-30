import 'firebase/firestore';
import 'firebase/auth';
import * as firebase from 'firebase/app';
import firebaseConfig from './firebasekey';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { db, firebase };
