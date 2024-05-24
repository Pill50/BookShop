import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { UserApis } from '~/apis'
import { Response } from '~/types/response'
import { setUser } from './auth.slice'

interface IUser {
  isLoading: boolean
}

const initialState: IUser = {
  isLoading: false
}

const UserSlice = createSlice({
  name: 'UserSlice',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProfile.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(getProfile.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const getProfile = createAsyncThunk<Response<null>, null, { rejectValue: Response<null> }>(
  'user/profile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await UserApis.getProfile()
      if (response) {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(setUser(response.data.data))
        }
      }
      return response.data as Response<null>
    } catch (error: any) {
      return rejectWithValue(error.data as Response<null>)
    }
  }
)

export default UserSlice
