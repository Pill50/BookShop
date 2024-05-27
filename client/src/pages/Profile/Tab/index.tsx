import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const Tab: React.FC = () => {
  const location = useLocation()
  const [pathName, setPathName] = useState<string>('/')

  useEffect(() => {
    setPathName(location.pathname)
  }, [location])

  return (
    <>
      <div className='flex justify-center items-center'>
        <div
          className={`${pathName === '/profile' ? 'text-white bg-green-500' : 'bg-green-300'} w-1/3 md:w-48 text-center py-3 md:py-4 rounded-tl-lg rounded-bl-lg font-semibold cursor-pointer hover:bg-green-500 transition-all`}
        >
          PROFILE
        </div>
        <div
          className={`${pathName === 'SALE' ? 'text-white bg-green-500' : 'bg-green-300'} w-1/3 md:w-48 text-center py-3 md:py-4 font-semibold cursor-pointer hover:bg-green-500 transition-all border-l-[1px] border-r-[1px]`}
        >
          MY ORDERS
        </div>
        <div
          className={`${pathName === 'POPULAR' ? 'text-white bg-green-500' : 'bg-green-300'} w-1/3 md:w-48 text-center py-3 md:py-4 rounded-tr-lg rounded-br-lg font-semibold cursor-pointer hover:bg-green-500 transition-all`}
        >
          CHANGE PASSWORD
        </div>
      </div>
    </>
  )
}

export default Tab
