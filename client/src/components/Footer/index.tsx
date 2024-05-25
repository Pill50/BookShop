import React from 'react'
import { NavLink } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <footer className='bg-blue-100 rounded-lg shadow dark:bg-gray-900 m-4'>
      <div className='w-full max-w-screen-xl mx-auto p-4 md:py-8'>
        <div className='sm:flex sm:items-center sm:justify-between'>
          <a href='https://flowbite.com/' className='flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse'>
            <img src='https://flowbite.com/docs/images/logo.svg' className='h-8' alt='Flowbite Logo' />
            <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>BookShop</span>
          </a>
          <ul className='flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400'>
            <NavLink to={'/'} className='hover:underline me-4 md:me-6 text-lg text-blue-600'>
              Home
            </NavLink>
            <NavLink to={'/about'} className='hover:underline me-4 md:me-6 text-lg text-blue-600'>
              About
            </NavLink>
            <NavLink to={'/promotion'} className='hover:underline me-4 md:me-6 text-lg text-blue-600'>
              Promotion
            </NavLink>
            <NavLink to={'/'} className='hover:underline me-4 md:me-6 text-lg text-blue-600'>
              Cart
            </NavLink>
            <NavLink to={'/'} className='hover:underline me-4 md:me-6 text-lg text-blue-600'>
              Profile
            </NavLink>
          </ul>
        </div>
        <hr className='my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8' />
        <span className='block text-sm text-gray-500 sm:text-center dark:text-gray-400'>
          © 2024{' '}
          <a href='https://flowbite.com/' className='hover:underline'>
            BookShop™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  )
}

export default Footer
