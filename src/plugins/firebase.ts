/* eslint-disable no-unused-vars */
import Vue from "vue";
import firebaseConfig from "../../firebaseConfig";

import firebase from "firebase/compat/app";

import "firebase/compat/auth";
import { getAnalytics, logEvent } from "firebase/analytics";

// import store from "../store";
firebase.initializeApp(firebaseConfig);

const analytics = getAnalytics();

Vue.prototype.$firebase = firebase;
Vue.prototype.$analytics = analytics;
Vue.prototype.$analyticsLog = logEvent;

// firebase.auth().onAuthStateChanged((user) => {
//   store.dispatch("auth/user/GET_USER", user);
// });

export default { analytics };
