import React from 'react'
import Carousel from './Carousel'

const Banner: React.FC = () => {
  return (
    <div className='grid grid-rows-4 grid-flow-col gap-2 mt-2'>
      <div className='row-span-4 col-span-8'>
        <Carousel />
      </div>
      <div className='hidden row-span-2 col-span-4 md:block'>
        <img
          src='https://cdn0.fahasa.com/media/wysiwyg/Thang-04-2024/392x156_vnpay_t4.jpg'
          alt='Banner'
          className='h-full rounded-lg'
        />
      </div>
      <div className='hidden row-span-2 col-span-4 md:block'>
        <img
          src='https://cdn0.fahasa.com/media/wysiwyg/Thang-04-2024/392x156_shopeepay_t4.jpg'
          alt='Banner'
          className='h-full rounded-lg'
        />
      </div>
    </div>
  )
}

export default Banner
