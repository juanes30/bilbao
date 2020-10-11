import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const getDepartments = createAsyncThunk(
  "citiesApp/departments/get",
  async (routeParams, { getState }) => {
    routeParams = routeParams || getState().citiesApp.departments.routeParams;
    const response = await axios.get("/api/departments", {
      params: routeParams,
    });
    const data = await response.data;

    return { data, routeParams };
  }
);

const departmentSlice = createSlice({
  name: "citiesApp/departments",
  initialState: { data: [] },
  reducers: {},
  extraReducers: {
    [getDepartments.fulfilled]: (state, action) => {
      state.data = action.payload.data;
    },
  },
});

export default departmentSlice.reducer;
