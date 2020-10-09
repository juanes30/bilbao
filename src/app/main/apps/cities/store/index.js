import { combineReducers } from "@reduxjs/toolkit";
import cities from "./citiesSlice";

const reducer = combineReducers({
  cities,
});

export default reducer;
