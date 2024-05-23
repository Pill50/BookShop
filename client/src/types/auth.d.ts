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

export type Tokens = {
  accessToken: string
  refreshToken: string
}
