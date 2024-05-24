import React from 'react'

export const Login = React.lazy(() => import('../pages/Auth/Login'))
export const Register = React.lazy(() => import('../pages/Auth/Register'))
export const ForgotPassword = React.lazy(() => import('../pages/Auth/ForgotPassword'))
export const ResetPassword = React.lazy(() => import('../pages/Auth/ResetPassword'))
export const ChangePassword = React.lazy(() => import('../pages/Auth/ChangePassword'))
export const ConfirmEmail = React.lazy(() => import('../pages/Auth/ConfirmEmail'))
export const Home = React.lazy(() => import('../pages/Home'))
export const About = React.lazy(() => import('../pages/About'))
export const Cart = React.lazy(() => import('../pages/Cart'))
export const Promotion = React.lazy(() => import('../pages/Promotion'))
export const Profile = React.lazy(() => import('../pages/Profile'))
export const NotFound = React.lazy(() => import('../pages/NotFound'))
