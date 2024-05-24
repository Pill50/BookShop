import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MdOutlineEmail } from 'react-icons/md'
import { FaRegUser } from 'react-icons/fa6'
import { RiLockPasswordLine } from 'react-icons/ri'
import { Toaster } from 'react-hot-toast'
import { Formik, ErrorMessage, Field, Form } from 'formik'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { AuthActions } from '~/redux/slices'
import { Register as RegisterType } from '~/types/auth'
import { registerValidationSchema } from '~/validations/auth'
import BackDrop from '~/assets/images/backdrop.jpg'
import Loading from '~/components/Loading'
import OAuth from '../OAuth'

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const isLoading: boolean = useAppSelector((state) => state.auth.isLoading)

  const formikRef = useRef(null)
  const initialValue: RegisterType = {
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  }

  const handleOnSubmit = async (values: RegisterType) => {
    const result = await dispatch(AuthActions.register(values))
    try {
      if (result.meta.requestStatus === 'rejected') {
        throw new Error('Invalid request')
      }
      toast.success('Register successfully! Please check your email for verification!')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      <Toaster />
      <div className='flex justify-center items-center min-h-[calc(100vh-80px)]'>
        <div className='hidden md:block'>
          <img src={BackDrop} alt='TVP Book Store' className='md:w-[300px] lg:w-[500px]' />
        </div>
        <div className='bg-green-100 rounded-xl mx-4 shadow-md my-4'>
          <div className='p-4'>
            <h1 className='text-xl font-bold text-center text-green-700'>REGISTER</h1>
            <Formik
              initialValues={initialValue}
              validationSchema={registerValidationSchema}
              onSubmit={handleOnSubmit}
              innerRef={formikRef}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <div className='flex flex-col mb-3'>
                    <div className='flex gap-1 items-start'>
                      <MdOutlineEmail size={24} />
                      <label htmlFor='email' className='font-semibold mb-1'>
                        Email
                      </label>
                    </div>
                    <Field
                      id='email'
                      name='email'
                      type='text'
                      className={`px-2 py-3 rounded-lg border-[1px] outline-none w-full lg:w-[300px] ${
                        formik.errors.email && formik.touched.email ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name='email' component='span' className='text-[14px] text-red-600 font-medium' />
                  </div>
                  <div className='flex flex-col mb-3'>
                    <div className='flex gap-1 items-start'>
                      <FaRegUser size={24} />
                      <label htmlFor='displayName' className='font-semibold mb-1'>
                        Display Name
                      </label>
                    </div>
                    <Field
                      id='displayName'
                      name='displayName'
                      type='text'
                      className={`px-2 py-3 rounded-lg border-[1px] outline-none w-full lg:w-[300px] ${
                        formik.errors.displayName && formik.touched.displayName ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage
                      name='displayName'
                      component='span'
                      className='text-[14px] text-red-600 font-medium'
                    />
                  </div>
                  <div className='flex flex-col mb-3'>
                    <div className='flex gap-1 items-start'>
                      <RiLockPasswordLine size={24} />
                      <label htmlFor='password' className='font-semibold mb-1'>
                        Password
                      </label>
                    </div>
                    <Field
                      id='password'
                      name='password'
                      type='password'
                      className={`px-2 py-3 rounded-lg border-[1px] outline-none w-full lg:w-[300px] ${
                        formik.errors.password && formik.touched.password ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name='password' component='span' className='text-[14px] text-red-600 font-medium' />
                  </div>
                  <div className='flex flex-col mb-3'>
                    <div className='flex gap-1 items-start'>
                      <RiLockPasswordLine size={24} />
                      <label htmlFor='confirmPassword' className='font-semibold mb-1'>
                        Confirm Password
                      </label>
                    </div>
                    <Field
                      id='confirmPassword'
                      name='confirmPassword'
                      type='password'
                      className={`px-2 py-3 rounded-lg border-[1px] outline-none w-full lg:w-[300px] ${
                        formik.errors.confirmPassword && formik.touched.confirmPassword ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage
                      name='confirmPassword'
                      component='span'
                      className='text-[14px] text-red-600 font-medium'
                    />
                  </div>
                  <button
                    type='submit'
                    className='focus:outline-none text-white w-full bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                  >
                    REGISTER
                  </button>
                </Form>
              )}
            </Formik>
            <p className='block mt-3 mb-2 text-center text-lg'>
              Already have an account?{' '}
              <span className='font-medium hover:opacity-80'>
                <Link to={'/login'}>Login</Link>
              </span>
            </p>
            <div className='inline-flex items-center justify-center w-full relative z-10'>
              <hr className='w-64 h-px my-8 bg-gray-300 border-0 dark:bg-gray-700' />
              <span className='absolute px-3 font-medium text-gray-900 bg-green-100 -translate-x-1/2 left-1/2 dark:text-white dark:bg-gray-900'>
                OR
              </span>
            </div>
            <OAuth />
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage
