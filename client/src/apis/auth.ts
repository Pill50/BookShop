import { apiCaller } from '~/configs/apiCaller'
import {
  Login as LoginType,
  OAuth as OAuthType,
  Register as RegisterType,
  ForgotPassword as ForgotPasswordType,
  ResetPassword as ResetPasswordType,
  ChangePassword as ChangePasswordType
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
  const payload = {
    query,
    variables
  }
  const response = await apiCaller('POST', path, payload)
  return response
}

const login = async (values: LoginType) => {
  const path = '/graphql'
  const query = `
      mutation($loginInput: LoginDto!) {
          login(loginInput: $loginInput) {
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
    loginInput: {
      email: values.email,
      password: values.password
    }
  }
  const payload = {
    query,
    variables
  }
  const response = await apiCaller('POST', path, payload)
  return response
}

const register = async (values: RegisterType) => {
  const path = '/graphql'
  const query = `
      mutation($registerInput: RegisterDto!) {
          register(registerInput: $registerInput)
      }
  `
  const variables = {
    registerInput: {
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      displayName: values.displayName
    }
  }
  const payload = {
    query,
    variables
  }
  const response = await apiCaller('POST', path, payload)
  return response
}

const confirmEmail = async (token: string) => {
  const path = '/graphql'
  const query = `
      mutation($tokenInput: TokenDto!) {
        confirmEmail(tokenInput: $tokenInput) {
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
    tokenInput: {
      token: token
    }
  }
  const payload = {
    query,
    variables
  }
  const response = await apiCaller('POST', path, payload)
  return response
}

const refreshToken = async (token: string) => {
  const path = 'auth/refresh'
  const data = {
    refreshToken: token
  }
  const response = await apiCaller('POST', path, data)
  return response
}

const forgotPassword = async (values: ForgotPasswordType) => {
  const path = '/graphql'
  const query = `
      mutation($forgotPasswordInput: ForgotPasswordDto!) {
        forgotPassword(forgotPasswordInput: $forgotPasswordInput)
      }
  `
  const variables = {
    forgotPasswordInput: {
      email: values.email
    }
  }
  const payload = {
    query,
    variables
  }
  const response = await apiCaller('POST', path, payload)
  return response
}

const resetPassword = async (values: ResetPasswordType) => {
  const path = '/graphql'
  const query = `
    mutation($resetPasswordInput: ResetPasswordDto!) {
      resetPassword(resetPasswordInput: $resetPasswordInput) {
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
    resetPasswordInput: {
      password: values.password,
      confirmPassword: values.confirmPassword,
      token: values.token
    }
  }
  const payload = {
    query,
    variables
  }
  const response = await apiCaller('POST', path, payload)
  return response
}

const changePassword = async (values: ChangePasswordType) => {
  const path = '/auth/change-password'
  const data: ChangePasswordType = {
    oldPassword: values.oldPassword,
    newPassword: values.newPassword,
    confirmPassword: values.confirmPassword
  }
  const response = await apiCaller('POST', path, data)
  return response
}

const getMe = async () => {
  const path = '/graphql'
  const query = `
      query {
        getMe {
            id
            avatar,
            role,
            gender,
            address, 
            displayName,
            email,
            phone
        }
      }
  `
  const payload = {
    query: query
  }
  const response = await apiCaller('POST', path, payload)
  return response
}

const logout = async () => {
  const path = '/auth/logout'
  const response = await apiCaller('POST', path)
  return response
}

export {
  OAuth,
  login,
  register,
  forgotPassword,
  confirmEmail,
  refreshToken,
  logout,
  resetPassword,
  changePassword,
  getMe
}
