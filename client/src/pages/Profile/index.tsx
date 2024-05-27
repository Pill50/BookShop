import React, { useEffect } from 'react'
import { ErrorMessage, Field, Formik, Form } from 'formik'
// import Tab from '~/components/Tab'
import { updateProfileValidationSchema } from '~/validations/user'
import DefaultAvatar from '~/assets/images/logo.png'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { logout } from '~/redux/slices/auth.slice'
import toast, { Toaster } from 'react-hot-toast'
import Loading from '~/components/Loading'
import { User } from '~/types/user'
import { UserActions } from '~/redux/slices'
import ModalChangeAvatar from './ModalChangeAvatar'

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isLoading: boolean = useAppSelector((state) => state.auth.isLoading)
  const user: User = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    dispatch(UserActions.getProfile(null))
  }, [dispatch])

  const initialValue = {
    id: user.id || '',
    avatar: user.avatar || '',
    displayName: user.displayName || '',
    email: user.email || '',
    phone: user.phone || '',
    gender: user.gender,
    address: user.address || ''
  }

  const handleUpdateProfile = async (values: any) => {
    // const result = await dispatch(UserActions.updateInformation(values))
    // try {
    //   if (result.meta.requestStatus === 'rejected') {
    //     throw new Error(result.payload?.message)
    //   }
    //   toast.success(result.payload?.message as string)
    //   await dispatch(UserActions.getProfile(null))
    // } catch (error: any) {
    //   toast.error(error.message)
    // }
  }

  const handleLogout = async () => {
    const result = await dispatch(logout(null))
    try {
      if (result.meta.requestStatus === 'rejected') {
        throw new Error(result.payload?.message)
      }
      toast.success(result.payload?.message as string)
      navigate('/login')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      <Toaster />
      <div className='container mx-auto'>
        {/* <Tab /> */}
        <div className='p-4 m-2 flex flex-col justify-center items-center'>
          <ModalChangeAvatar urlAvatar={DefaultAvatar} user={user} />
        </div>
        <div className='flex justify-center m-2'>
          <Formik
            initialValues={initialValue}
            validationSchema={updateProfileValidationSchema}
            onSubmit={handleUpdateProfile}
            enableReinitialize={true}
          >
            {(formik) => (
              <Form className='flex items-center justify-center flex-col m-2 rounded-lg' onSubmit={formik.handleSubmit}>
                <div className='m-4 mt-2 rounded-xl shadow-lg p-4'>
                  <div className='flex flex-col gap-2 md:flex-row'>
                    <div className='flex flex-col mb-3 flex-1'>
                      <label htmlFor='displayName' className='text-sm mb-1 font-bold'>
                        Display Name
                      </label>
                      <Field
                        name='displayName'
                        type='text'
                        className={`px-2 py-4 rounded-lg border-[1px] outline-none w-60 md:max-w-sm ${
                          formik.errors.displayName && formik.touched.displayName ? 'border-error' : ''
                        }`}
                      />
                      <ErrorMessage
                        name='displayName'
                        component='span'
                        className='text-[14px] text-error font-medium'
                      />
                    </div>
                    <div className='flex flex-col mb-3 flex-1'>
                      <label htmlFor='email' className='text-sm mb-1 font-bold'>
                        Email
                      </label>
                      <Field
                        name='email'
                        disabled={true}
                        type='text'
                        className={`px-2 py-4 rounded-lg border-[1px] outline-none w-60 md:max-w-sm ${
                          formik.errors.email && formik.touched.email ? 'border-error' : ''
                        }`}
                      />
                      <ErrorMessage name='email' component='span' className='text-[14px] text-error font-medium' />
                    </div>
                  </div>
                  <div className='flex flex-col gap-2 md:flex-row'>
                    <div className='flex flex-col mb-3 flex-1'>
                      <label htmlFor='address' className='text-sm mb-1 font-bold'>
                        Address
                      </label>
                      <Field
                        name='address'
                        type='text'
                        className={`px-2 py-4 rounded-lg border-[1px] outline-none w-60 md:max-w-sm ${
                          formik.errors.address && formik.touched.address ? 'border-error' : ''
                        }`}
                      />
                      <ErrorMessage name='address' component='span' className='text-[14px] text-error font-medium' />
                    </div>
                    <div className='flex flex-col mb-3 flex-1'>
                      <label htmlFor='phone' className='text-sm mb-1 font-bold'>
                        Phone Number
                      </label>
                      <Field
                        name='phone'
                        type='text'
                        className={`px-2 py-4 rounded-lg border-[1px] outline-none w-60 md:max-w-sm ${
                          formik.errors.phone && formik.touched.phone ? 'border-error' : ''
                        }`}
                      />
                      <ErrorMessage name='phone' component='span' className='text-[14px] text-error font-medium' />
                    </div>
                  </div>
                  <div className='flex flex-col gap-2 md:flex-row'>
                    <div className='flex flex-col mb-3 flex-1'>
                      <label htmlFor='gender' className='text-sm mb-1 font-bold flex-1'>
                        Gender
                      </label>
                      <div className='md:flex md:justify-around flex-1'>
                        <div className='form-control max-w-sm'>
                          <label className='label cursor-pointer'>
                            <span className='label-text mr-2'>Male</span>
                            <input
                              type='radio'
                              name='gender'
                              className='radio checked:bg-blue-500'
                              checked={formik.values.gender === 'MALE'}
                              value={'MALE'}
                              onChange={formik.handleChange}
                            />
                          </label>
                        </div>
                        <div className='form-control max-w-sm'>
                          <label className='label cursor-pointer'>
                            <span className='label-text mr-2'>Female</span>
                            <input
                              type='radio'
                              name='gender'
                              className='radio checked:bg-blue-500'
                              checked={formik.values.gender === 'FEMALE'}
                              value={'FEMALE'}
                              onChange={formik.handleChange}
                            />
                          </label>
                        </div>
                        <div className='form-control max-w-sm'>
                          <label className='label cursor-pointer'>
                            <span className='label-text mr-2'>Another</span>
                            <input
                              type='radio'
                              name='gender'
                              className='radio checked:bg-blue-500'
                              checked={formik.values.gender === 'ANOTHER'}
                              value={'ANOTHER'}
                              onChange={formik.handleChange}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end gap-2'>
                    <button className='btn ml-2 btn-error text-lg' onClick={handleLogout} type='button'>
                      Logout
                    </button>
                    <button className='text-white btn btn-primary text-lg' type='submit'>
                      Save
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
