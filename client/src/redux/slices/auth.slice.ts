import { User, User as UserType } from '~/types/user'
import { Tokens as TokensType } from '~/types/auth'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { AuthApis } from '~/apis'
import { Login as LoginType } from '~/types/auth'

import { Response } from '~/types/response'

interface IAuth {
  isLoading: boolean
  isLogin: boolean
  errorMessage: string
  successMessage: string
  user: User
}

const initialState: IAuth = {
  isLoading: false,
  isLogin: false,
  errorMessage: '',
  successMessage: '',
  user: {} as User
}

const AuthSlice = createSlice({
  name: 'AuthSlice',
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user.id = action.payload.id
      state.user.email = action.payload.email
      state.user.displayName = action.payload.displayName
      state.user.role = action.payload.role as string
      state.user.avatar = action.payload.avatar as string
      state.user.gender = action.payload.gender as string
      state.user.phone = action.payload.phone as string
      state.user.address = action.payload.address as string
      state.isLogin = true
    }
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        Cookies.set('accessToken', action.payload.data?.accessToken as string)
        Cookies.set('refreshToken', action.payload.data?.refreshToken as string)
        state.isLogin = true
        state.isLoading = false
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const { setUser } = AuthSlice.actions

export const login = createAsyncThunk<Response<TokensType>, LoginType, { rejectValue: Response<null> }>(
  'auth/login',
  async (body, ThunkAPI) => {
    try {
      const response = await AuthApis.login(body)
      return response.data as Response<TokensType>
    } catch (error: any) {
      return ThunkAPI.rejectWithValue(error.data as Response<null>)
    }
  }
)

export default AuthSlice
