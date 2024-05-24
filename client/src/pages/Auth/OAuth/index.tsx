import React from 'react'
import { FaFacebook } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { SiGithub } from 'react-icons/si'
import { startSignIn } from '~/configs/firebaseConfig'
import { useAppDispatch } from '~/hooks/redux'
import { AuthActions } from '~/redux/slices'

const OAuth: React.FC = () => {
  const dispatch = useAppDispatch()
  const signIn = (providerName: string) => async (): Promise<void> => {
    const user = await startSignIn(providerName)
    const data = {
      authId: user.providerData[0].uid,
      email: user.email || (user.providerData[0].email as string),
      displayName: user.providerData[0].displayName as string,
      avatar: user.providerData[0].photoURL as string,
      loginFrom: user.providerData[0].providerId
    }

    await dispatch(AuthActions.OAuth(data))
  }

  return (
    <div className='flex justify-around items-center'>
      <FcGoogle size={30} className='cursor-pointer' onClick={signIn('Google')} />
      <FaFacebook size={30} color='blue' className='cursor-pointer' onClick={signIn('Facebook')} />
      <SiGithub size={30} className='cursor-pointer' onClick={signIn('Github')} />
    </div>
  )
}

export default OAuth
