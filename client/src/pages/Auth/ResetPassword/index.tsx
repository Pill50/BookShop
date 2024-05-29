import React, { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { RiLockPasswordLine } from 'react-icons/ri'
import { Formik, ErrorMessage, Field, Form } from 'formik'
import { ResetPassword as ResetPasswordType } from '~/types/auth'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { AuthActions } from '~/redux/slices'
import { resetPasswordValidationSchema } from '~/validations/auth'
import BackDrop from '~/assets/images/backdrop.jpg'
import Loading from '~/components/Loading'

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isLoading: boolean = useAppSelector((state) => state.auth.isLoading)

  const { token } = useParams()

  const formikRef = useRef(null)
  const initialValue: ResetPasswordType = {
    token: token as string,
    password: '',
    confirmPassword: ''
  }

  const handleOnSubmit = async (values: ResetPasswordType) => {
    const result = await dispatch(AuthActions.resetPassword(values))

    try {
      if (result.payload?.statusCode === 400) {
        toast.error(result.payload.message)
      } else if (result.meta.requestStatus === 'rejected') {
        throw new Error(result.payload?.message)
      } else {
        toast.success('Password reset successfully!')
        navigate('/login')
      }
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
            <h1 className='text-xl font-bold text-center text-green-700'>RESET PASSWORD</h1>
            <Formik
              initialValues={initialValue}
              validationSchema={resetPasswordValidationSchema}
              onSubmit={handleOnSubmit}
              innerRef={formikRef}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <div className='flex flex-col mb-3'>
                    <div className='flex gap-1 items-start'>
                      <RiLockPasswordLine size={24} />
                      <label htmlFor='password' className='font-semibold mb-1 tablet:text-xl'>
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
                      <label htmlFor='confirmPassword' className='font-semibold mb-1 tablet:text-xl'>
                        Confirm Password
                      </label>
                    </div>
                    <Field
                      id='confirmPassword'
                      name='confirmPassword'
                      type='password'
                      className={`px-2 py-3 rounded-lg border-[1px] outline-none w-full lg:w-[300px]${
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
                    CONFIRM
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPasswordPage
