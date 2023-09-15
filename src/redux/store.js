import { configureStore } from '@reduxjs/toolkit'
import { shazamApi } from './services/dataFetch'
import playerReducer from './services/PlayerSlice'

export const store = configureStore({
  reducer: {
    [shazamApi.reducerPath]: shazamApi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(shazamApi.middleware),
})