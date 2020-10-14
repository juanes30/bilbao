import { combineReducers } from "@reduxjs/toolkit";
import cities from "./citiesSlice";
import departments from "./departmentSlice";

const reducer = combineReducers({
  cities,
  departments,
});

export default reducer;
