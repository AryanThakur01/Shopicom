import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "@/lib/redux/rootReducer";

export const reduxStore = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    // Can concat additional middlewares later
    return getDefaultMiddleware();
  },
});

export type ReduxState = ReturnType<typeof reduxStore.getState>;
export type ReduxDispatch = typeof reduxStore.dispatch;
