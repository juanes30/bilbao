import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import firebaseService from "app/services/firebaseService/firebaseService";

import { REGIONAL } from "app/services/firebaseService/collections";

export const getRegional = createAsyncThunk(
  "regionalApp/regional/get",
  async (routeParams, { getState }) => {
    routeParams = routeParams || getState().usersApp.users.routeParams;
    const querySnapshot = await firebaseService.dbfirestore
      .collection(REGIONAL)
      .get();
    let regional = [];
    querySnapshot.forEach((documentSnapshot) =>
      regional.push({ ...documentSnapshot.data(), id: documentSnapshot.id })
    );
    return { data: regional, routeParams };
  }
);

export const saveRegional = createAsyncThunk(
  "regionalApp/regional/save",
  async (regional, { dispatch, getState }) => {
    const id = regional.id;
    delete regional.id;
    if (id) {
      await updateRegional(regional, id);
    } else {
      await createRegional(regional);
    }
    dispatch(getRegional());
  }
);

export const removeRegional = createAsyncThunk(
  "regionalApp/regional/remove",
  async (regionalId, { dispatch, getState }) => {
    await firebaseService.dbfirestore
      .collection(REGIONAL)
      .doc(regionalId)
      .delete();
    dispatch(getRegional());
  }
);

export const removeMultiple = createAsyncThunk(
  "regionalApp/regional/removeMultiple",
  async (regionalIds, { dispatch, getState }) => {
    for (const id of regionalIds) {
      await removeRegional(id, { dispatch, getState });
    }

    dispatch(getRegional());
  }
);

const createRegional = async (regional) => {
  await firebaseService.dbfirestore.collection(REGIONAL).add(regional);
};

const updateRegional = async (regional, regionalId) => {
  await firebaseService.dbfirestore
    .collection(REGIONAL)
    .doc(regionalId)
    .set({ ...regional }, { merge: true });
};

const regionalAdapter = createEntityAdapter({});

export const {
  selectAll: selectRegional,
  selectById: selectRegionalById,
} = regionalAdapter.getSelectors((state) => state.regionalApp.regional);

const regionalSlice = createSlice({
  name: "regionalApp/regional",
  initialState: regionalAdapter.getInitialState({
    searchText: "",
    routeParams: {},
    regionalDialog: {
      type: "new",
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setRegionalSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    openNewRegionalDialog: (state, action) => {
      state.regionalDialog = {
        type: "new",
        props: {
          open: true,
        },
        data: null,
      };
    },
    closeNewRegionalDialog: (state, action) => {
      state.regionalDialog = {
        type: "new",
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditRegionalDialog: (state, action) => {
      state.regionalDialog = {
        type: "edit",
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditRegionalDialog: (state, action) => {
      state.regionalDialog = {
        type: "edit",
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getRegional.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      regionalAdapter.setAll(state, data);
      state.routeParams = routeParams;
      state.searchText = "";
    },
  },
});

export const {
  setRegionalSearchText,
  openNewRegionalDialog,
  closeNewRegionalDialog,
  openEditRegionalDialog,
  closeEditRegionalDialog,
} = regionalSlice.actions;

export default regionalSlice.reducer;
