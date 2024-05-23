import { User, User as UserType } from '~/types/user'
import { Tokens as TokensType } from '~/types/auth'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { AuthApis } from '~/apis'
import { Login as LoginType, OAuth as OAuthType } from '~/types/auth'

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
      .addCase(OAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(OAuth.fulfilled, (state, action: PayloadAction<TokensType>) => {
        Cookies.set('accessToken', action.payload.accessToken as string)
        Cookies.set('refreshToken', action.payload.refreshToken as string)
        // Cookies.set('userRole', action.payload.user.role as string)
        state.isLogin = true
        state.isLoading = false
      })
      .addCase(OAuth.rejected, (state) => {
        state.isLoading = false
      })
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

export const OAuth = createAsyncThunk<TokensType, OAuthType, { rejectValue: Response<null> }>(
  'auth/oauth',
  async (body, { dispatch, rejectWithValue }) => {
    try {
      const response = await AuthApis.OAuth(body)
      if (response) {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(setUser(response.data.data.oauth.user))
        }
      }
      console.log(response.data)
      return response.data.data.oauth as TokensType
    } catch (error: any) {
      return rejectWithValue(error.data as Response<null>)
    }
  }
)
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

export const getMe = createAsyncThunk<Response<User>, null, { rejectValue: Response<null> }>(
  'book/getMe',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await AuthApis.getMe()
      if (response) {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(setUser(response.data.data))
        } else {
          Cookies.remove('accessToken')
          Cookies.remove('refreshToken')
          Cookies.remove('userRole')
          window.location.href = '/login'
        }
      }
      return response.data as Response<User>
    } catch (error: any) {
      return rejectWithValue(error.data as Response<null>)
    }
  }
)

export default AuthSlice
