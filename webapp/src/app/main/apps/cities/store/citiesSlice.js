import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import firebaseService from "app/services/firebaseService/firebaseService";

import { CITIES } from "app/services/firebaseService/collections";

export const getCities = createAsyncThunk(
  "citiesApp/cities/get",
  async (routeParams, { getState }) => {
    routeParams = routeParams || getState().citiesApp.cities.routeParams;
    const querySnapshot = await firebaseService.dbfirestore
      .collection(CITIES)
      .get();
    let cities = [];
    querySnapshot.forEach((documentSnapshot) =>
      cities.push({ ...documentSnapshot.data(), id: documentSnapshot.id })
    );
    return { data: cities, routeParams };
  }
);

export const saveCity = createAsyncThunk(
  "citiesApp/cities/save",
  async (city, { dispatch, getState }) => {
    const id = city.id;
    delete city.id;
    if (id) {
      await updateCity(city, id);
    } else {
      await createCity(city);
    }
    dispatch(getCities());
  }
);

export const removeCity = createAsyncThunk(
  "citiesApp/cities/remove",
  async (cityId, { dispatch, getState }) => {
    await firebaseService.dbfirestore.collection(CITIES).doc(cityId).delete();
    dispatch(getCities());
  }
);

export const removeMultiple = createAsyncThunk(
  "citiesApp/cities/removeMultiple",
  async (citiesIds, { dispatch, getState }) => {
    for (const id of citiesIds) {
      await removeCity(id, { dispatch, getState });
    }

    dispatch(getCities());
  }
);

const createCity = async (city) => {
  await firebaseService.dbfirestore.collection(CITIES).add(city);
};

const updateCity = async (city, id) => {
  await firebaseService.dbfirestore
    .collection(CITIES)
    .doc(id)
    .set({ ...city }, { merge: true });
};

const citiesAdapter = createEntityAdapter({});

export const {
  selectAll: selectCities,
  selectById: selectCitiesById,
} = citiesAdapter.getSelectors((state) => state.citiesApp.cities);

const citiesSlice = createSlice({
  name: "citiesApp/cities",
  initialState: citiesAdapter.getInitialState({
    searchText: "",
    routeParams: {},
    cityDialog: {
      type: "new",
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setCitiesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    openNewCityDialog: (state, action) => {
      state.cityDialog = {
        type: "new",
        props: {
          open: true,
        },
        data: null,
      };
    },
    closeNewCityDialog: (state, action) => {
      state.cityDialog = {
        type: "new",
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditCityDialog: (state, action) => {
      state.cityDialog = {
        type: "edit",
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditCityDialog: (state, action) => {
      state.cityDialog = {
        type: "edit",
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getCities.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      citiesAdapter.setAll(state, data);
      state.routeParams = routeParams;
      state.searchText = "";
    },
  },
});

export const {
  setCitiesSearchText,
  openNewCityDialog,
  closeNewCityDialog,
  openEditCityDialog,
  closeEditCityDialog,
} = citiesSlice.actions;

export default citiesSlice.reducer;
