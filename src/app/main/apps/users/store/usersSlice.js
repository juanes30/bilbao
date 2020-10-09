import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import firebaseService from "app/services/firebaseService/firebaseService";

import { USERS } from "app/services/firebaseService/collections";

export const getUsers = createAsyncThunk(
  "usersApp/users/get",
  async (routeParams, { getState }) => {
    routeParams = routeParams || getState().usersApp.users.routeParams;
    const querySnapshot = await firebaseService.dbfirestore
      .collection(USERS)
      .get();
    let users = [];
    querySnapshot.forEach((documentSnapshot) =>
      users.push({ ...documentSnapshot.data(), id: documentSnapshot.id })
    );
    return { data: users, routeParams };
  }
);

export const saveUser = createAsyncThunk(
  "usersApp/users/save",
  async (user, { dispatch, getState }) => {
    const id = user.id;
    delete user.id;
    if (id) {
      await updateUser(user, id);
    } else {
      await createUser(user);
    }
    dispatch(getUsers());
  }
);

export const removeUser = createAsyncThunk(
  "usersApp/users/remove",
  async (userId, { dispatch, getState }) => {
    await firebaseService.dbfirestore.collection(USERS).doc(userId).delete();
    dispatch(getUsers());
  }
);

export const removeMultiple = createAsyncThunk(
  "usersApp/users/removeMultiple",
  async (usersIds, { dispatch, getState }) => {
    for (const id of usersIds) {
      await removeUser(id, { dispatch, getState });
    }

    dispatch(getUsers());
  }
);

const createUser = async (user) => {
  await firebaseService.dbfirestore.collection(USERS).add(user);
};

const updateUser = async (user, userId) => {
  await firebaseService.dbfirestore
    .collection(USERS)
    .doc(userId)
    .set({ ...user }, { merge: true });
};

const usersAdapter = createEntityAdapter({});

export const {
  selectAll: selectUsers,
  selectById: selectUsersById,
} = usersAdapter.getSelectors((state) => state.usersApp.users);

const usersSlice = createSlice({
  name: "usersApp/users",
  initialState: usersAdapter.getInitialState({
    searchText: "",
    routeParams: {},
    userDialog: {
      type: "new",
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setUsersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    openNewUserDialog: (state, action) => {
      state.userDialog = {
        type: "new",
        props: {
          open: true,
        },
        data: null,
      };
    },
    closeNewUserDialog: (state, action) => {
      state.userDialog = {
        type: "new",
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditUserDialog: (state, action) => {
      state.userDialog = {
        type: "edit",
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditUserDialog: (state, action) => {
      state.userDialog = {
        type: "edit",
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getUsers.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      usersAdapter.setAll(state, data);
      state.routeParams = routeParams;
      state.searchText = "";
    },
  },
});

export const {
  setUsersSearchText,
  openNewUserDialog,
  closeNewUserDialog,
  openEditUserDialog,
  closeEditUserDialog,
} = usersSlice.actions;

export default usersSlice.reducer;
