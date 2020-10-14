const prodConfig = {
  apiKey: "AIzaSyDuskE1rdFp_NLnAFoMvHbXGeXzNDxzSV8",
  authDomain: "dislicores-share-of-menu.firebaseapp.com",
  databaseURL: "https://dislicores-share-of-menu.firebaseio.com",
  projectId: "dislicores-share-of-menu",
  storageBucket: "dislicores-share-of-menu.appspot.com",
  messagingSenderId: "750657341173",
  appId: "1:750657341173:web:fb665155d9375eaca7e7bc",
  measurementId: "G-SW4BFTW0X3",
};

const devConfig = {
  apiKey: "AIzaSyDuskE1rdFp_NLnAFoMvHbXGeXzNDxzSV8",
  authDomain: "dislicores-share-of-menu.firebaseapp.com",
  databaseURL: "https://dislicores-share-of-menu.firebaseio.com",
  projectId: "dislicores-share-of-menu",
  storageBucket: "dislicores-share-of-menu.appspot.com",
  messagingSenderId: "750657341173",
  appId: "1:750657341173:web:fb665155d9375eaca7e7bc",
  measurementId: "G-SW4BFTW0X3",
};

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

export default config;
