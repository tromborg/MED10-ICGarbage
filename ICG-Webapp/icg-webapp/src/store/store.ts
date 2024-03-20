import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./reducers/login";
import userIdReducer from "./reducers/userid";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    userId: userIdReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
