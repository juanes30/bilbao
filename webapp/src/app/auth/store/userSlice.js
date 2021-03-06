import { createSlice } from "@reduxjs/toolkit";
import firebase from "firebase";
import history from "@history";
import _ from "@lodash";
import {
  setInitialSettings,
  setDefaultSettings,
} from "app/store/fuse/settingsSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import firebaseService from "app/services/firebaseService";

export const setUserDataFirebase = (user, authUser) => async (dispatch) => {
  if (
    user &&
    user.data &&
    user.data.settings &&
    user.data.settings.theme &&
    user.data.settings.layout &&
    user.data.settings.layout.style
  ) {
    // Set user data but do not update
    return dispatch(setUserData(user));
  }

  // Create missing user settings
  return dispatch(createUserSettingsFirebase(user, authUser));
};

export const createUserSettingsFirebase = (user, authUser) => async (
  dispatch,
  getState
) => {
  const guestUser = getState().auth.user;
  const fuseDefaultSettings = getState().fuse.settings.defaults;
  const { currentUser } = firebase.auth();

  /**
   * Merge with current Settings
   */
  const userMerge = _.merge({}, guestUser, {
    uid: user.id,
    uidAuth: authUser.uid,
    from: "firebase",
    role: ["admin"],
    data: {
      displayName: authUser.displayName,
      email: authUser.email,
      settings: { ...fuseDefaultSettings },
    },
  });
  currentUser.updateProfile(userMerge.data);

  dispatch(updateUserData(userMerge));

  return dispatch(setUserData(userMerge));
};

export const setUserData = (user) => async (dispatch, getState) => {
  /*
        You can redirect the logged-in user to a specific route depending on his role
         */

  history.location.state = {
    redirectUrl: user.redirectUrl, // for example 'apps/academy'
  };

  /*
    Set User Settings
     */
  dispatch(setDefaultSettings(user.data.settings));

  dispatch(setUser(user));
};

export const updateUserSettings = (settings) => async (dispatch, getState) => {
  const oldUser = getState().auth.user;
  const user = _.merge({}, oldUser, { data: { settings } });

  dispatch(updateUserData(user));

  return dispatch(setUserData(user));
};

export const updateUserShortcuts = (shortcuts) => async (
  dispatch,
  getState
) => {
  const { user } = getState().auth;
  const newUser = {
    ...user,
    data: {
      ...user.data,
      shortcuts,
    },
  };

  dispatch(updateUserData(user));

  return dispatch(setUserData(newUser));
};

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState().auth;

  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  }

  history.push({
    pathname: "/",
  });

  firebaseService.signOut();

  dispatch(setInitialSettings());

  dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  if (!user.role || user.role.length === 0) {
    // is guest
    return;
  }

  firebaseService
    .updateUserData(user)
    .then(() => {})
    .catch((error) => {
      dispatch(showMessage({ message: error.message }));
    });
};

const initialState = {
  role: [], // guest
  data: {
    displayName: "John Doe",
    photoURL: "assets/images/avatars/profile.png",
    email: "johndoe@withinpixels.com",
    shortcuts: ["calendar", "mail", "contacts", "todo"],
  },
};

const userSlice = createSlice({
  name: "auth/user",
  initialState,
  reducers: {
    setUser: (state, action) => action.payload,
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {},
});

export const { setUser, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
