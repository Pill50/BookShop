import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { OrderApis, UserApis } from '~/apis'
import { GetUserOrder, Order, UserOrder, UserOrderResponse } from '~/types/order'
import { Response } from '~/types/response'

interface IOrder {
  isLoading: boolean
  userOrders: UserOrder[]
  totalPage: number
  totalRecord: number
}

const initialState: IOrder = {
  isLoading: false,
  userOrders: [] as UserOrder[],
  totalPage: 0,
  totalRecord: 0
}

const OrderSlice = createSlice({
  name: 'OrderSlice',
  initialState: initialState,
  reducers: {
    setUserOrders(state, action) {
      state.userOrders = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = true
      })
  }
})

export const { setUserOrders } = OrderSlice.actions

export const createOrder = createAsyncThunk<Response<null>, Order, { rejectValue: Response<null> }>(
  'order/createOrder',
  async (body, ThunkAPI) => {
    try {
      const response = await OrderApis.createOrder(body)
      return response.data as Response<null>
    } catch (error: any) {
      return ThunkAPI.rejectWithValue(error.data as Response<null>)
    }
  }
)

export default OrderSlice
