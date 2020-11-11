import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import firebaseService from "app/services/firebaseService/firebaseService";

import {
  RESTAURANTS,
  CITIES,
  REGIONAL,
  USERS,
} from "app/services/firebaseService/collections";

export const getRestaurants = createAsyncThunk(
  "restaurantsApp/restaurants/get",
  async (routeParams, { getState }) => {
    routeParams =
      routeParams || getState().restaurantsApp.restaurants.routeParams;
    const querySnapshot = await firebaseService.dbfirestore
      .collection(RESTAURANTS)
      .get();
    let restaurants = [];
    querySnapshot.forEach((documentSnapshot) => {
      const restaurantsData = documentSnapshot.data();
      restaurants.push({
        ...restaurantsData,
        id: documentSnapshot.id,
      });
    });
    restaurants = await Promise.all(
      restaurants.map(async (restaurant) => {
        const cityName = await getCity(restaurant.cityId);
        const regionalName = await getRegional(restaurant.regionalId);
        const userName = await getUser(restaurant.userId);
        return {
          ...restaurant,
          city: cityName,
          regional: regionalName,
          user: userName,
        };
      })
    );
    return { data: restaurants, routeParams };
  }
);

const getCity = async (cityId) => {
  const docCity = await firebaseService.dbfirestore
    .collection(CITIES)
    .doc(cityId)
    .get();
  return docCity.data().name;
};

const getRegional = async (regionalId) => {
  const docRegional = await firebaseService.dbfirestore
    .collection(REGIONAL)
    .doc(regionalId)
    .get();
  return docRegional.data().name;
};

const getUser = async (userId) => {
  const querySnapshot = await firebaseService.dbfirestore
    .collection(USERS)
    .where("uidAuth", "==", userId)
    .get();
  if (querySnapshot.docs.length > 0) {
    const data = querySnapshot.docs[0].data();
    return `${data.name} ${data.lastName}`;
  }
  return "";
};

export const removeRestaurant = createAsyncThunk(
  "restaurantsApp/restaurants/remove",
  async (id, { dispatch, getState }) => {
    await firebaseService.dbfirestore.collection(RESTAURANTS).doc(id).delete();
    dispatch(getRestaurants());
  }
);

export const removeMultiple = createAsyncThunk(
  "restaurantsApp/restaurants/removeMultiple",
  async (usersIds, { dispatch, getState }) => {
    for (const id of usersIds) {
      await removeRestaurant(id, { dispatch, getState });
    }

    dispatch(getRestaurants());
  }
);

const restaurantsAdapter = createEntityAdapter({});

export const {
  selectAll: selectRestaurants,
  selectById: selectRestaurantsById,
} = restaurantsAdapter.getSelectors(
  (state) => state.restaurantsApp.restaurants
);

const restaurantsSlice = createSlice({
  name: "restaurantsApp/restaurants",
  initialState: restaurantsAdapter.getInitialState({
    searchText: "",
    routeParams: {},
  }),
  reducers: {
    setRestaurantsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getRestaurants.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      restaurantsAdapter.setAll(state, data);
      state.routeParams = routeParams;
      state.searchText = "";
    },
  },
});

export const { setRestaurantsSearchText } = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
