import { User } from './user'

export type OAuth = {
  authId: string
  email: string
  displayName: string
  avatar: string
  loginFrom: string
}

export type Login = {
  email: string
  password: string
}

export type Register = {
  email: string
  password: string
  confirmPassword: string
  displayName: string
}

export type ForgotPassword = {
  email: string
}

export type ResetPassword = {
  token: string
  password: string
  confirmPassword: string
}

export type ChangePassword = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export type Tokens = {
  accessToken: string
  refreshToken: string
  user: User
}
