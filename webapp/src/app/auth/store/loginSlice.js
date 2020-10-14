import { createSlice } from "@reduxjs/toolkit";
import { showMessage } from "app/store/fuse/messageSlice";
import firebaseService from "app/services/firebaseService";

import { USERS } from "app/services/firebaseService/collections";

export const submitLoginWithFireBase = ({ email, password }) => async (
  dispatch
) => {
  if (!firebaseService.auth) {
    console.warn(
      "Firebase Service didn't initialize, check your configuration"
    );

    return () => false;
  }

  return firebaseService.auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      return dispatch(loginSuccess());
    })
    .catch((error) => {
      const usernameErrorCodes = [
        "auth/email-already-in-use",
        "auth/invalid-email",
        "auth/operation-not-allowed",
        "auth/user-not-found",
        "auth/user-disabled",
      ];
      const passwordErrorCodes = ["auth/weak-password", "auth/wrong-password"];

      const response = {
        username: usernameErrorCodes.includes(error.code)
          ? error.message
          : null,
        password: passwordErrorCodes.includes(error.code)
          ? error.message
          : null,
      };

      if (error.code === "auth/invalid-api-key") {
        dispatch(showMessage({ message: error.message }));
      }

      return dispatch(loginError(response));
    });
};

export const createAccountWithFireBase = ({ email, password, id }) => async (
  dispatch
) => {
  return firebaseService.auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      updateCreateAccountStatus(id)
        .then(() => {
          return dispatch(loginSuccess());
        })
        .catch((error) => {
          dispatch(showMessage({ message: error.message }));
        });
    })
    .catch((error) => {
      const usernameErrorCodes = [
        "auth/email-already-in-use",
        "auth/invalid-email",
        "auth/operation-not-allowed",
        "auth/user-not-found",
        "auth/user-disabled",
      ];
      const passwordErrorCodes = ["auth/weak-password", "auth/wrong-password"];

      const response = {
        username: usernameErrorCodes.includes(error.code)
          ? error.message
          : null,
        password: passwordErrorCodes.includes(error.code)
          ? error.message
          : null,
      };

      if (error.code === "auth/invalid-api-key") {
        dispatch(showMessage({ message: error.message }));
      }

      return dispatch(loginError(response));
    });
};

export const isNewAccount = ({ email, password }) => async (dispatch) => {
  const querySnapshot = await firebaseService.dbfirestore
    .collection(USERS)
    .where("createAccount", "==", true)
    .where("email", "==", email)
    .get();

  const isNewAccount = querySnapshot.docs.length > 0;
  if (isNewAccount) {
    const id = querySnapshot.docs[0].id;
    dispatch(isNewAccountSuccess(id));
  } else {
    dispatch(isNewAccountError());
    dispatch(submitLoginWithFireBase({ email, password }));
  }
};

const updateCreateAccountStatus = async (id) => {
  await firebaseService.dbfirestore
    .collection(USERS)
    .doc(id)
    .set({ createAccount: false }, { merge: true });
};

const initialState = {
  success: false,
  isNewAccount: false,
  id: "",
  error: {
    username: null,
    password: null,
  },
};

const loginSlice = createSlice({
  name: "auth/login",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.success = true;
      state.isNewAccount = false;
    },
    loginError: (state, action) => {
      state.success = false;
      state.isNewAccount = false;
      state.error = action.payload;
    },
    isNewAccountSuccess: (state, action) => {
      state.success = false;
      state.isNewAccount = true;
      state.id = action.payload;
    },
    isNewAccountError: (state, action) => {
      state.success = false;
      state.isNewAccount = false;
    },
  },
  extraReducers: {},
});

export const {
  loginSuccess,
  loginError,
  isNewAccountSuccess,
  isNewAccountError,
} = loginSlice.actions;

export default loginSlice.reducer;
