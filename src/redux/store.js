import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userData";
import notificationReducer from "./notification";
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
  key: 'root',
  version: 1,
  storage
};
const reducer = combineReducers({
  user: userReducer,
  notification:notificationReducer
})

const persistedReducer = persistReducer(persistConfig,reducer)

export const store = configureStore({
  reducer: persistedReducer
})
