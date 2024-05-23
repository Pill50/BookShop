import { apiCaller } from '~/configs/apiCaller'
import {
  Login as LoginType,
  OAuth as OAuthType,
  Register as RegisterType,
  ForgotPassword as ForgotPasswordType,
  ResetPassword as ResetPasswordType
} from '~/types/auth'

const OAuth = async (values: OAuthType) => {
  const path = '/graphql'
  const query = `
      mutation($oauthInput: OAuthDto!) {
          oauth(oauthInput: $oauthInput) {
              accessToken
              refreshToken
              user {
                  id
                  displayName
                  address
                  phone
                  role
                  avatar
                  gender
              }
          }
      }
  `
  const variables = {
    oauthInput: {
      authId: values.authId,
      email: values.email,
      displayName: values.displayName,
      avatar: values.avatar,
      loginFrom: values.loginFrom
    }
  }
  const data = {
    query,
    variables
  }
  const response = await apiCaller('POST', path, data)
  console.log(response)
  return response
}

const login = async (values: LoginType) => {
  const path = '/auth/login'
  const data: LoginType = {
    email: values.email,
    password: values.password
  }
  const response = await apiCaller('POST', path, data)
  return response
}

const register = async (values: RegisterType) => {
  const path = '/auth/register'
  const data: RegisterType = {
    email: values.email,
    password: values.password,
    confirmPassword: values.confirmPassword,
    displayName: values.displayName
  }
  const response = await apiCaller('POST', path, data)
  return response
}

const forgotPassword = async (values: ForgotPasswordType) => {
  const path = '/auth/forgot-password'
  const data: ForgotPasswordType = {
    email: values.email
  }
  const response = await apiCaller('POST', path, data)
  return response
}

const resetPassword = async (values: ResetPasswordType) => {
  const path = '/auth/reset-password'
  const data: ResetPasswordType = {
    password: values.password,
    confirmPassword: values.confirmPassword,
    token: values.token
  }
  const response = await apiCaller('POST', path, data)
  return response
}

const getMe = async () => {
  const path = '/auth/me'
  const response = await apiCaller('GET', path)
  return response
}

export { OAuth, login, register, forgotPassword, resetPassword, getMe }
