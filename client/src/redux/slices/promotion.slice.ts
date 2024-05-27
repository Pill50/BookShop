import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PromotionApis } from '~/apis'
import { FilterPromotion, FilterPromotionResponse, Promotion } from '~/types/promotion'
import { Response } from '~/types/response'

interface IPromotion {
  isLoading: boolean
  promotionList: Promotion[]
  totalPage: number
  totalRecord: number
}

const initialState: IPromotion = {
  isLoading: false,
  promotionList: [] as Promotion[],
  totalPage: 0,
  totalRecord: 0
}

const PromotionSlice = createSlice({
  name: 'PromotionSlice',
  initialState: initialState,
  reducers: {
    setPromotionList: (state, action: PayloadAction<Promotion[]>) => {
      state.promotionList = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(filterPromotions.fulfilled, (state, action) => {
        state.isLoading = false
        state.totalPage = action.payload.data?.totalPage as number
        state.totalRecord = action.payload.data?.totalRecord as number
      })
      .addCase(filterPromotions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(filterPromotions.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const { setPromotionList } = PromotionSlice.actions

export const filterPromotions = createAsyncThunk<
  Response<FilterPromotionResponse>,
  FilterPromotion,
  { rejectValue: Response<null> }
>('promotion/filter', async (body, { dispatch, rejectWithValue }) => {
  try {
    const response = await PromotionApis.filterPromotions(body)
    if (response) {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(setPromotionList(response.data.data.promotions))
      }
    }
    return response.data as Response<FilterPromotionResponse>
  } catch (error: any) {
    return rejectWithValue(error.data as Response<null>)
  }
})

export default PromotionSlice
