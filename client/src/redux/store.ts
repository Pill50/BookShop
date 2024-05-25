import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './slices/auth.slice'
import CategorySlice from './slices/category.slice'
import BookSlice from './slices/book.slice'
import PublisherSlice from './slices/publisher.slice'

const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    category: CategorySlice.reducer,
    book: BookSlice.reducer,
    publisher: PublisherSlice.reducer
  }
})

export default store

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
