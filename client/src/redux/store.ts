import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './slices/auth.slice'
import CategorySlice from './slices/category.slice'
import BookSlice from './slices/book.slice'
import PublisherSlice from './slices/publisher.slice'
import ShipperSlice from './slices/shipper.slice'
import PromotionSlice from './slices/promotion.slice'
import OrderSlice from './slices/order.slice'

const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    category: CategorySlice.reducer,
    book: BookSlice.reducer,
    publisher: PublisherSlice.reducer,
    shipper: ShipperSlice.reducer,
    order: OrderSlice.reducer,
    promotion: PromotionSlice.reducer
  }
})

export default store

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
