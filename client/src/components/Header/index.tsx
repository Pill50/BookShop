import { Dropdown, Avatar } from 'flowbite-react'
import React, { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { AuthActions } from '~/redux/slices'
import { IoIosSearch } from 'react-icons/io'
import { IoIosMenu } from 'react-icons/io'

const Header: React.FC = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    const result = await dispatch(AuthActions.logout(null))
    try {
      if (result.meta.requestStatus === 'rejected') {
        throw new Error(result.payload?.message)
      }
      navigate('/login')
    } catch (error: any) {
      navigate('/')
    }
  }

  console.log(user)

  return (
    <nav className='bg-white border-gray-200 dark:bg-gray-900'>
      <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
        <a href='https://flowbite.com/' className='flex items-center space-x-3 rtl:space-x-reverse'>
          <img src='https://flowbite.com/docs/images/logo.svg' className='h-8' alt='Flowbite Logo' />
          <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>BookShop</span>
        </a>
        <div className='flex md:order-2'>
          <button
            type='button'
            data-collapse-toggle='navbar-search'
            aria-controls='navbar-search'
            aria-expanded={isMenuOpen ? 'true' : 'false'}
            className='md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2 me-1'
            onClick={toggleMenu}
          >
            <IoIosSearch className='w-6 h-6' />
          </button>
          <div className='relative hidden md:flex gap-2'>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
              <IoIosSearch className='w-4 h-4' />
            </div>
            <input
              type='text'
              id='search-navbar'
              className='block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Search...'
            />
            <Dropdown
              label={<Avatar alt='User settings' img={user.avatar} className='bg-blue-100 object-cover rounded-lg' />}
              arrowIcon={false}
              inline
            >
              <Dropdown.Header>
                <span className='block text-sm'>{user.displayName}</span>
                <span className='block truncate text-sm font-medium'>{user.email}</span>
              </Dropdown.Header>
              <Dropdown.Item className='hover:bg-blue-100 hover:text-blue-500'>
                <NavLink to={'/profile'}>Profile</NavLink>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className='text-red-500 hover:bg-red-100'>
                Sign out
              </Dropdown.Item>
            </Dropdown>
          </div>
          <button
            data-collapse-toggle='navbar-search'
            type='button'
            className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
            aria-controls='navbar-search'
            aria-expanded={isMenuOpen ? 'true' : 'false'}
            onClick={toggleMenu}
          >
            <span className='sr-only'>Open main menu</span>
            <IoIosMenu className='w-6 h-6' />
          </button>
        </div>
        <div
          className={`items-center justify-between ${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`}
          id='navbar-search'
        >
          <div className='relative mt-3 md:hidden'>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
              <IoIosSearch className='w-4 h-4' />
            </div>
            <input
              type='text'
              id='search-navbar'
              className='block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Search...'
            />
          </div>
          <ul className='flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700'>
            <li>
              <NavLink
                to='/'
                className={`${pathname === '/' ? 'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500' : 'text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'} block py-2 px-3 `}
                aria-current='page'
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/about'
                className={`${pathname.startsWith('/about') ? 'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500' : 'text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'} block py-2 px-3 `}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/promotion'
                className={`${pathname.startsWith('/promotion') ? 'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500' : 'text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'} block py-2 px-3 `}
              >
                Promotion
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/cart'
                className={`${pathname.startsWith('/cart') ? 'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500' : 'text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'} block py-2 px-3 `}
              >
                Cart
              </NavLink>
            </li>
            <li className='block md:hidden'>
              <NavLink
                to='/profile'
                className={`${pathname.startsWith('/profile') ? 'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500' : 'text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'} block py-2 px-3 `}
              >
                Profile
              </NavLink>
            </li>
            <li className='block md:hidden hover:border-transparent'>
              <div
                className='block text-red-600 rounded py-2 px-3 hover:bg-red-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-red-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-red-700 cursor-pointer'
                onClick={handleLogout}
              >
                Logout
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
