import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";
import appReducer from "./slices/appSlice";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["app", "theme", "auth"],
};

const rootReducer = combineReducers({
  app: appReducer,
  theme: themeReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;
