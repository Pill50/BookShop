import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AboutApis } from '~/apis'
import { Response } from '~/types/response'

interface IAboutPage {
  isLoading: boolean
}

const initialState: IAboutPage = {
  isLoading: false
}

const AboutSlice = createSlice({
  name: 'AboutSlice',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAboutPageContent.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAboutPageContent.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(getAboutPageContent.rejected, (state) => {
        state.isLoading = true
      })
  }
})

export const {} = AboutSlice.actions

export const getAboutPageContent = createAsyncThunk<Response<null>, null, { rejectValue: Response<null> }>(
  'publisher/getAboutPageContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AboutApis.getAboutPageContent()

      return response.data as Response<null>
    } catch (error: any) {
      return rejectWithValue(error.data as Response<null>)
    }
  }
)

export default AboutSlice
