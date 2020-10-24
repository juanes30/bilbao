import { combineReducers } from "@reduxjs/toolkit";
import restaurants from "./restaurantsSlice";

const reducer = combineReducers({
  restaurants,
});

export default reducer;
