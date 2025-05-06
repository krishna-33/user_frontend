import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { api } from './apiSlice';
import authReducer from './authSlice';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  
  [api.reducerPath]: api.reducer,
  [authReducer.name]: authReducer.reducer,
  })

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      // Ignore paths and actions used internally by RTK Query
      ignoredActions: [
        'persist/PERSIST',
        'persist/REHYDRATE',
      ],
      ignoredPaths: ['register'], // this suppresses your specific warning
    },
  }).concat(api.middleware),

});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
