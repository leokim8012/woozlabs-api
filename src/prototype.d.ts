/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
import Vue from "vue";
import firebase from "firebase/compat/app";
import firebaseAuth from "firebase/auth";
import firebaseAnalytics from "firebase/analytics";

declare module "vue/types/vue" {
  interface Vue {
    $firebase: typeof firebase;
    $firebaseAuth: typeof firebaseAuth;
    $firebaseAnalytics: typeof firebaseAnalytics;
  }
}
