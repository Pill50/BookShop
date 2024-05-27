import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import Loading from '~/components/Loading'
import Tab from '~/components/Tab'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { ChangePassword as ChangepPasswordType } from '~/types/auth'
import { changePasswordValidationSchema } from '~/validations/auth'
import { AuthActions } from '~/redux/slices'

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isLoading: boolean = useAppSelector((state) => state.auth.isLoading)

  const formikRef = useRef(null)

  const initialValue: ChangepPasswordType = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  const handleOnSubmit = async (values: ChangepPasswordType) => {
    const result = await dispatch(AuthActions.changePassword(values))
    try {
      if (result.meta.requestStatus === 'rejected') {
        throw new Error(result.payload?.message)
      }
      toast.success(result.payload?.message as string)
      navigate('/profile')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      <Toaster />
      <div className='max-w-screen-xl p-4 mx-auto'>
        <Tab />
        <div className='flex justify-center m-2'>
          <Formik
            initialValues={initialValue}
            validationSchema={changePasswordValidationSchema}
            onSubmit={handleOnSubmit}
            innerRef={formikRef}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit} className='rounded-lg p-4 shadow-md'>
                <div className='flex flex-col mb-3'>
                  <label htmlFor='oldPassword' className='text-sm mb-1 font-bold'>
                    Current Password
                  </label>
                  <Field
                    type='password'
                    name='oldPassword'
                    className={`px-2 py-4 rounded-lg border-[1px] outline-none w-[300px] ${
                      formik.errors.oldPassword && formik.touched.oldPassword && 'border-error'
                    } `}
                  />
                  <ErrorMessage name='oldPassword' component='span' className='text-[14px] text-error font-medium' />
                </div>
                <div className='flex flex-col mb-3'>
                  <label htmlFor='newPassword' className='text-sm mb-1 font-bold'>
                    New Password
                  </label>
                  <Field
                    type='password'
                    name='newPassword'
                    className={`px-2 py-4 rounded-lg border-[1px] outline-none w-full md:max-w-sm ${
                      formik.errors.newPassword && formik.touched.newPassword && 'border-error'
                    }`}
                  />
                  <ErrorMessage name='newPassword' component='span' className='text-[14px] text-error font-medium' />
                </div>
                <div className='flex flex-col mb-3'>
                  <label htmlFor='confirmPassword' className='text-sm mb-1 font-bold'>
                    Confirm Password
                  </label>
                  <Field
                    type='password'
                    name='confirmPassword'
                    className={`px-2 py-4 rounded-lg border-[1px] outline-none w-full md:max-w-sm ${
                      formik.errors.confirmPassword && formik.touched.confirmPassword && 'border-error'
                    }`}
                  />
                  <ErrorMessage
                    name='confirmPassword'
                    component='span'
                    className='text-[14px] text-error font-medium'
                  />
                </div>
                <div className='flex justify-end'>
                  <button type='submit' name='save_button' className='text-white btn btn-primary text-lg'>
                    Save
                  </button>
                  <Link to={'/'}>
                    <button type='submit' className='btn text-lg ml-2'>
                      Cancel
                    </button>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  )
}

export default ChangePasswordPage
