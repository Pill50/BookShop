import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FeedbackApis } from '~/apis'
import { CreateFeedback, Feedback } from '~/types/feedback'
import { Response } from '~/types/response'

interface IFeedback {
  isLoading: boolean
  feedbacks: Feedback[]
}

const initialState: IFeedback = {
  isLoading: false,
  feedbacks: [] as Feedback[]
}

const FeedbackSlice = createSlice({
  name: 'FeedbackSlice',
  initialState: initialState,
  reducers: {
    setFeedback: (state, action: PayloadAction<Feedback[]>) => {
      state.feedbacks = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(createFeedback.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createFeedback.fulfilled, (state) => {
        state.isLoading = false
      })
  }
})

export const { setFeedback } = FeedbackSlice.actions

export const createFeedback = createAsyncThunk<Response<Feedback>, CreateFeedback, { rejectValue: Response<null> }>(
  'feedback/createFeedback',
  async (body, { dispatch, rejectWithValue }) => {
    try {
      const response = await FeedbackApis.createFeedback(body)
      if (response) {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(setFeedback(response.data.data))
        }
      }
      return response.data as Response<Feedback>
    } catch (error: any) {
      return rejectWithValue(error.response.data as Response<null>)
    }
  }
)

export default FeedbackSlice
