import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PublisherApis } from '~/apis'
import { Publisher } from '~/types/publisher'
import { Response } from '~/types/response'

interface IPublisher {
  isLoading: boolean
  publishers: Publisher[]
}

const initialState: IPublisher = {
  isLoading: false,
  publishers: [] as Publisher[]
}

const PublisherSlice = createSlice({
  name: 'PublisherSlice',
  initialState: initialState,
  reducers: {
    setPublisher: (state, action: PayloadAction<Publisher[]>) => {
      state.publishers = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getAllPublishers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllPublishers.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(getAllPublishers.rejected, (state) => {
        state.isLoading = true
      })
  }
})

export const { setPublisher } = PublisherSlice.actions

export const getAllPublishers = createAsyncThunk<Response<null>, null, { rejectValue: Response<null> }>(
  'category',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await PublisherApis.getAllPublishers()
      if (response) {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(setPublisher(response.data.data))
        }
      }
      return response.data as Response<null>
    } catch (error: any) {
      return rejectWithValue(error.data as Response<null>)
    }
  }
)

export default PublisherSlice
