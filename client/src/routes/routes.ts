import React from 'react'

export const Login = React.lazy(() => import('../pages/Auth/Login'))
export const Register = React.lazy(() => import('../pages/Auth/Register'))
export const ForgotPassword = React.lazy(() => import('../pages/Auth/ForgotPassword'))
export const ResetPassword = React.lazy(() => import('../pages/Auth/ResetPassword'))
export const ChangePassword = React.lazy(() => import('../pages/Auth/ChangePassword'))
export const ConfirmEmail = React.lazy(() => import('../pages/Auth/ConfirmEmail'))
export const Home = React.lazy(() => import('../pages/Home'))
export const NotFound = React.lazy(() => import('../pages/NotFound'))
