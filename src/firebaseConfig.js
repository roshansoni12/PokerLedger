import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyAH9evcrIZKuQ-hG2ZM87ikGDqkpEKA8go",
  authDomain: "pokerledger-e1180.firebaseapp.com",
  projectId: "pokerledger-e1180",
  storageBucket: "pokerledger-e1180.appspot.com",
  messagingSenderId: "916623055282",
  appId: "1:916623055282:web:1bf3e2c2754f826fe46cab",
  measurementId: "G-149YC72PFR",
  databaseURL: "https://pokerledger-e1180-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

export default database;