import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { AuthApis } from '~/apis'
import { Response } from '~/types/response'
import {
  Login as LoginType,
  OAuth as OAuthType,
  Register as RegisterType,
  ForgotPassword as ForgotPasswordType,
  ResetPassword as ResetPasswordType,
  ChangePassword as ChangePasswordType,
  Tokens as TokensType
} from '~/types/auth'
import { User, User as UserType } from '~/types/user'

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
        Cookies.set('userRole', action.payload.user.role as string)
        state.isLogin = true
        state.isLoading = false
      })
      .addCase(OAuth.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<TokensType>) => {
        Cookies.set('accessToken', action.payload.accessToken as string)
        Cookies.set('refreshToken', action.payload.refreshToken as string)
        state.isLogin = true
        state.isLoading = false
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(confirmEmail.pending, (state) => {
        state.errorMessage = ''
        state.successMessage = ''
        state.isLoading = true
      })
      .addCase(confirmEmail.fulfilled, (state, action) => {
        if (action.payload?.statusCode === 400) {
          state.errorMessage = action.payload.message
        } else {
          state.successMessage = 'Confirm Email Successfully'
        }
        state.isLoading = false
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.errorMessage = action.payload?.message as string
        state.isLoading = false
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(changePassword.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(getMe.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMe.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('userRole')
        state.isLogin = false
        state.isLoading = false
      })
      .addCase(logout.rejected, (state) => {
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
      return response.data.data.oauth as TokensType
    } catch (error: any) {
      return rejectWithValue(error.data as Response<null>)
    }
  }
)
export const login = createAsyncThunk<TokensType, LoginType, { rejectValue: Response<null> }>(
  'auth/login',
  async (body, { dispatch, rejectWithValue }) => {
    try {
      const response = await AuthApis.login(body)
      if (response) {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(setUser(response.data.data.login.user))
        }
      }
      return response.data.data.login as TokensType
    } catch (error: any) {
      return rejectWithValue(error.data as Response<null>)
    }
  }
)

export const register = createAsyncThunk<Response<null>, RegisterType, { rejectValue: Response<null> }>(
  'auth/register',
  async (body, ThunkAPI) => {
    try {
      const response = await AuthApis.register(body)
      return response.data as Response<null>
    } catch (error: any) {
      return ThunkAPI.rejectWithValue(error.data as Response<null>)
    }
  }
)

export const confirmEmail = createAsyncThunk<Response<null | any>, string, { rejectValue: Response<null> }>(
  'auth/confirm',
  async (body, ThunkAPI) => {
    try {
      const response = await AuthApis.confirmEmail(body)
      if (response.data.errors) {
        const dataError = {
          statusCode: 400,
          message: response.data.errors[0].message
        }
        return dataError
      }
      return response.data.data.confirmEmail as Response<null>
    } catch (error: any) {
      return ThunkAPI.rejectWithValue(error.data as Response<null>)
    }
  }
)

export const forgotPassword = createAsyncThunk<Response<null>, ForgotPasswordType, { rejectValue: Response<null> }>(
  'auth/forgot-password',
  async (body, ThunkAPI) => {
    try {
      const response = await AuthApis.forgotPassword(body)
      return response.data.data.forgotPassword as Response<null>
    } catch (error: any) {
      return ThunkAPI.rejectWithValue(error.data as Response<null>)
    }
  }
)

export const resetPassword = createAsyncThunk<Response<User>, ResetPasswordType, { rejectValue: Response<null> }>(
  'auth/reset-password',
  async (body, ThunkAPI) => {
    try {
      const response = await AuthApis.resetPassword(body)
      return response.data.data.resetPassword as Response<User>
    } catch (error: any) {
      return ThunkAPI.rejectWithValue(error.data as Response<null>)
    }
  }
)

export const changePassword = createAsyncThunk<Response<null>, ChangePasswordType, { rejectValue: Response<null> }>(
  'auth/change-password',
  async (body, ThunkAPI) => {
    try {
      const response = await AuthApis.changePassword(body)
      return response.data as Response<null>
    } catch (error: any) {
      return ThunkAPI.rejectWithValue(error.data as Response<null>)
    }
  }
)

export const logout = createAsyncThunk<Response<null>, null, { rejectValue: Response<null> }>(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await AuthApis.logout()
      if (response.status >= 200 && response.status <= 299) {
        dispatch(
          setUser({
            id: '',
            avatar: '',
            email: '',
            displayName: '',
            role: '',
            gender: '',
            phone: '',
            address: ''
          })
        )
      }
      return response.data.data.logout as Response<null>
    } catch (error: any) {
      return rejectWithValue(error.data as Response<null>)
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
          dispatch(setUser(response.data.data.getMe))
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
