import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './slices/auth.slice'

const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer
  }
})

export default store

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
