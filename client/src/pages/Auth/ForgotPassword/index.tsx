import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import BackDrop from '~/assets/images/backdrop.jpg'
import toast, { Toaster } from 'react-hot-toast'
import { Formik, ErrorMessage, Field, Form } from 'formik'
import { forgotPasswordValidationSchema } from '~/validations/auth'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { AuthActions } from '~/redux/slices'
import { MdOutlineEmail } from 'react-icons/md'
import { ForgotPassword as ForgotPasswordType } from '~/types/auth'
import Loading from '~/components/Loading'
import OAuth from '../OAuth'

const ForgotPasswordPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const isLoading: boolean = useAppSelector((state) => state.auth.isLoading)

  const formikRef = useRef(null)
  const initialValue: ForgotPasswordType = {
    email: ''
  }

  const handleOnSubmit = async (values: ForgotPasswordType) => {
    const result = await dispatch(AuthActions.forgotPassword(values))
    try {
      if (result.meta.requestStatus === 'rejected') {
        throw new Error(result.payload?.message)
      }
      toast.success(result.payload?.message as string)
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
            <h1 className='text-xl font-bold text-center text-green-700'>FORGOT PASSWORD</h1>
            <Formik
              initialValues={initialValue}
              validationSchema={forgotPasswordValidationSchema}
              onSubmit={handleOnSubmit}
              innerRef={formikRef}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <div className='flex flex-col mb-3'>
                    <div className='flex gap-1 items-start'>
                      <MdOutlineEmail size={24} />
                      <label htmlFor='email' className='font-semibold mb-1 tablet:text-xl'>
                        Email
                      </label>
                    </div>
                    <Field
                      id='email'
                      name='email'
                      type='text'
                      className={`px-2 py-3 rounded-lg border-[1px] outline-none w-full lg:w-[300px] ${
                        formik.errors.email && formik.touched.email ? 'border-red-600' : ''
                      }`}
                    />
                    <ErrorMessage name='email' component='span' className='text-[14px] text-red-600 font-medium' />
                  </div>
                  <button
                    type='submit'
                    className='focus:outline-none text-white w-full bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                  >
                    ENTER EMAIL
                  </button>
                </Form>
              )}
            </Formik>
            <p className='block mt-3 mb-2 text-center text-lg'>
              Don't have an account?{' '}
              <span className='font-medium hover:opacity-80'>
                <Link to={'/register'}>Signup</Link>
              </span>
            </p>
            <div className='inline-flex items-center justify-center w-full relative'>
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

export default ForgotPasswordPage
