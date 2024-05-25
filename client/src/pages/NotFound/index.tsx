import React from 'react'
import NotFound from '~/assets/images/notfound.png'
import Ellipse1 from '~/assets/images/ellipse_1.png'
import Ellipse2 from '~/assets/images/ellipse_2.png'
import { NavLink } from 'react-router-dom'

const NotFoundPage: React.FC = () => {
  return (
    <>
      <img src={Ellipse1} alt='.' className='absolute left-0 top-20' />
      <img src={Ellipse2} alt='.' className='absolute right-0 bottom-0' />
      <div className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-center'>
        <img src={NotFound} alt='NOT FOUND' className='w-[500px] object-cover bg-transparent' />
        <h1 className='font-bold text-xl'>Something went wrong</h1>
        <p className='my-2'>Sorry, We can’t find the page you’re looking for.</p>
        <NavLink
          to={'/'}
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
        >
          BACK TO HOME
        </NavLink>
      </div>
    </>
  )
}

export default NotFoundPage
