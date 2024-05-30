import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PaymentApis } from '~/apis'
import { CreatePayment, UpdatePayment } from '~/types/payment'
import { Response } from '~/types/response'

interface IPayment {
  isLoading: boolean
}

const initialState: IPayment = {
  isLoading: false
}

const PaymentSlice = createSlice({
  name: 'PaymentSlice',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getPaymentUrl.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPaymentUrl.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(getPaymentUrl.rejected, (state) => {
        state.isLoading = true
      })
  }
})

export const {} = PaymentSlice.actions

export const getPaymentUrl = createAsyncThunk<Response<null>, CreatePayment, { rejectValue: Response<null> }>(
  'order/getPaymentUrl',
  async (body, ThunkAPI) => {
    try {
      const response = await PaymentApis.getPaymentUrl(body)
      return response.data as Response<null>
    } catch (error: any) {
      return ThunkAPI.rejectWithValue(error.data as Response<null>)
    }
  }
)

export const updatePaymentStatus = createAsyncThunk<Response<null>, UpdatePayment, { rejectValue: Response<null> }>(
  'order/updatePaymentStatus',
  async (body, ThunkAPI) => {
    try {
      const response = await PaymentApis.updatePaymentStatus(body)
      return response.data as Response<null>
    } catch (error: any) {
      return ThunkAPI.rejectWithValue(error.data as Response<null>)
    }
  }
)

export default PaymentSlice
