import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { AuthActions } from '~/redux/slices'
import ConfirmEmailThumb from '~/assets/images/confirmEmail.png'
import Ellipse1 from '~/assets/images/ellipse_1.png'
import Ellipse2 from '~/assets/images/ellipse_2.png'

const ConfirmEmail: React.FC = () => {
  const dispatch = useAppDispatch()
  const errorMessage = useAppSelector((state) => state.auth.errorMessage) ?? ''
  const successMessage = useAppSelector((state) => state.auth.successMessage) ?? ''

  const { token } = useParams()

  useEffect(() => {
    dispatch(AuthActions.confirmEmail(token as string))
  }, [token, dispatch])

  return (
    <>
      <div className='h-screen flex flex-col items-center justify-center space-x-[1rem]'>
        <img src={ConfirmEmailThumb} alt='Thumbnail Confirm Email' className='w-[80%] md:w-[400px]' />
        <img src={Ellipse1} alt='Thumbnail Confirm Email' className='absolute left-[-40px] top-0' />
        <img src={Ellipse2} alt='Thumbnail Confirm Email' className='absolute bottom-[-20px] right-[-100px]' />
        {errorMessage === '' && successMessage === '' && (
          <h3 className={`text-xl text-blue-600`}>Verification in progress...</h3>
        )}
        {errorMessage !== '' && (
          <h3 className={`text-xl text-red-600 font-bold`}>
            {errorMessage} <br />{' '}
            <span>
              <Link
                to={'/'}
                className='text-xl text-center text-white bg-blue-600 p-2 rounded-md mt-4 block hover:bg-blue-700'
              >
                Back To Login
              </Link>
            </span>
          </h3>
        )}
        {successMessage !== '' && (
          <h3 className={`text-xl text-green-600 font-bold`}>
            {successMessage}
            <br />{' '}
            <span>
              <Link
                to={'/login'}
                className='text-xl text-center text-white bg-blue-600 p-2 rounded-md mt-4 block hover:bg-blue-700'
              >
                Back To Login
              </Link>
            </span>
          </h3>
        )}
      </div>
    </>
  )
}

export default ConfirmEmail
