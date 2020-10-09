import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import config from "./firebaseServiceConfig";

class FirebaseService {
  init(success) {
    if (Object.entries(config).length === 0 && config.constructor === Object) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Missing Firebase Configuration at src/app/services/firebaseService/firebaseServiceConfig.js"
        );
      }
      success(false);
      return;
    }

    if (firebase.apps.length) {
      return;
    }
    firebase.initializeApp(config);
    this.db = firebase.database();
    this.auth = firebase.auth();
    this.dbfirestore = firebase.firestore();
    this.almacen = firebase.storage();
    this.storage = firebase.storage().ref();
    this.storageEvents = firebase.storage;
    this.thefirestore = firebase.firestore;
    success(true);
  }

  getUserData = (userId) => {
    if (!firebase.apps.length) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.dbfirestore
        .collection("users")
        .where("data.email", "==", userId)
        .onSnapshot(function (querySnapshot) {
          var user;
          querySnapshot.forEach(function (doc) {
            user = doc.data();
          });
          resolve(user);
        });
    });
  };

  updateUserData = (user) => {
    if (!firebase.apps.length) {
      return false;
    }
    return this.dbfirestore
      .collection("users")
      .doc(user.uid)
      .set(user, { merge: true });
  };

  onAuthStateChanged = (callback) => {
    if (!this.auth) {
      return;
    }
    this.auth.onAuthStateChanged(callback);
  };

  signOut = () => {
    if (!this.auth) {
      return;
    }
    this.auth.signOut();
  };
}

const instance = new FirebaseService();

export default instance;
