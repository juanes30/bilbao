import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import firebaseService from "app/services/firebaseService/firebaseService";

import {
  RESTAURANTS,
  REGIONAL,
  BAR_STAFF,
} from "app/services/firebaseService/collections";

export const getBarStaff = createAsyncThunk(
  "barStaffApp/barStaff/get",
  async (routeParams, { getState }) => {
    routeParams =
      routeParams || getState().barStaffApp.barStaff.routeParams;
    const querySnapshot = await firebaseService.dbfirestore
      .collection(BAR_STAFF)
      .get();
    let barStaff = [];
    querySnapshot.forEach((documentSnapshot) => {
      const restaurantsData = documentSnapshot.data();
      barStaff.push({
        ...restaurantsData,
        id: documentSnapshot.id,
      });
    });
    barStaff = await Promise.all(
      barStaff.map(async (restaurant) => {
        const regionalName = await getRegional(restaurant.regionalId);
        return { ...restaurant, regional: regionalName };
      })
    );
    return { data: barStaff, routeParams };
  }
);

const getRegional = async (regionalId) => {
  const docRegional = await firebaseService.dbfirestore
    .collection(REGIONAL)
    .doc(regionalId)
    .get();
  return docRegional.data().name;
};

export const removeBarStaff = createAsyncThunk(
  "barStaffApp/barStaff/remove",
  async (id, { dispatch, getState }) => {
    await firebaseService.dbfirestore.collection(BAR_STAFF).doc(id).delete();
    dispatch(getBarStaff());
  }
);

export const removeMultiple = createAsyncThunk(
  "barStaffApp/barStaff/removeMultiple",
  async (usersIds, { dispatch, getState }) => {
    for (const id of usersIds) {
      await removeBarStaff(id, { dispatch, getState });
    }
    dispatch(getBarStaff());
  }
);

const barStaffAdapter = createEntityAdapter({});

export const {
  selectAll: selectBarStaff,
  selectById: selectBarStaffById,
} = barStaffAdapter.getSelectors((state) => state.barStaffApp.barStaff);

const barStaffSlice = createSlice({
  name: "barStaffApp/barStaff",
  initialState: barStaffAdapter.getInitialState({
    searchText: "",
    routeParams: {},
  }),
  reducers: {
    setBarStaffSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getBarStaff.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      barStaffAdapter.setAll(state, data);
      state.routeParams = routeParams;
      state.searchText = "";
    },
  },
});

export const { setBarStaffSearchText } = barStaffSlice.actions;

export default barStaffSlice.reducer;
