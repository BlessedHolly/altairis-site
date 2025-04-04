import { configureStore } from "@reduxjs/toolkit";
import apiAccountSlice from "./apiAccountSlice";

const store = configureStore({
  reducer: {
    [apiAccountSlice.reducerPath]: apiAccountSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiAccountSlice.middleware),
});

export default store;
