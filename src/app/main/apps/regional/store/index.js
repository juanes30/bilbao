import { combineReducers } from "@reduxjs/toolkit";
import regional from "./regionalSlice";

const reducer = combineReducers({
  regional,
});

export default reducer;
