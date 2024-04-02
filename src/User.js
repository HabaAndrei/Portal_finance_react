import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useState, useEffect } from "react";
  
const {REACT_APP_FIREBASE_KEY} = process.env;

const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_KEY,
  authDomain: "dashboard-finance-c4000.firebaseapp.com",
  projectId: "dashboard-finance-c4000",
  storageBucket: "dashboard-finance-c4000.appspot.com",
  messagingSenderId: "295444875451",
  appId: "1:295444875451:web:aed3fb5bac5c4a66fb419e",
  measurementId: "G-L5TP03GSET",
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export function getUser(cb) {
  const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    unsubscribe();
    cb(user);
  });
}
