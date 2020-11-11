import { combineReducers } from "@reduxjs/toolkit";
import barStaff from "./barStaffSlice";

const reducer = combineReducers({
  barStaff,
});

export default reducer;
