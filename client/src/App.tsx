import { Route, Routes } from 'react-router-dom'
import {
  About,
  BookDetail,
  Cart,
  ChangePassword,
  ConfirmEmail,
  ForgotPassword,
  HistoryOrder,
  Home,
  Login,
  NotFound,
  Payment,
  Profile,
  Promotion,
  Register,
  ResetPassword,
  Search
} from './routes/routes'
import ProtectedRoute from './routes/ProtectedRoute'
import React from 'react'
import Loading from './components/Loading'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

function App() {
  return (
    <>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path={'/login'} element={<Login />}></Route>
            <Route path={'/register'} element={<Register />}></Route>
            <Route path={'/forgot-password'} element={<ForgotPassword />}></Route>
            <Route path={'/reset-password/:token'} element={<ResetPassword />}></Route>
            <Route path={'/register/confirm/:token'} element={<ConfirmEmail />}></Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path={'/'} element={<Home />}></Route>
              <Route path={'/about'} element={<About />}></Route>
              <Route path={'/promotion'} element={<Promotion />}></Route>
              <Route path={'/search'} element={<Search />}></Route>
              <Route path={'/book/:slug'} element={<BookDetail />}></Route>
              <Route path={'/profile'}>
                <Route index element={<Profile />}></Route>
                <Route path='change-password' element={<ChangePassword />}></Route>
                <Route path='orders' element={<HistoryOrder />}></Route>
              </Route>
              <Route path={'/cart'} element={<Cart />}></Route>
              <Route path={'/payment'} element={<Payment />}></Route>
            </Route>
          </Route>
          <Route path={'*'} element={<NotFound />}></Route>
        </Routes>
      </React.Suspense>
    </>
  )
}

export default App
