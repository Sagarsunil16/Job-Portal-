import { configureStore } from '@reduxjs/toolkit';
import employerReducer from './slices/employerSlice';

export const store = configureStore({
  reducer: {
    employer: employerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
