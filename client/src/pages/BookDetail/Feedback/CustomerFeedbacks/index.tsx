import React from 'react'
import { FaStar } from 'react-icons/fa'
import { FaRegStar } from 'react-icons/fa'
interface IFeedbackContent {
  userName: string
  userAvatar: string
  rating: number
  date: string
  content: string
}

const CustomerFeedBacks: React.FC<IFeedbackContent> = ({ userName, userAvatar, date, content, rating }) => {
  const fullStars = Math.floor(rating)
  const emptyStars = 5 - fullStars

  return (
    <div className='flex gap-2 my-2 border-[1px] p-2 rounded-lg'>
      <div className=''>
        <figure>
          <img src={userAvatar} alt={userName} className='w-12 h-12 object-cover rounded-full' />
        </figure>
      </div>
      <div className='flex flex-col gap-1'>
        <p className='font-bold'>{userName}</p>
        <div className='text-gray-600 flex items-center gap-1'>
          <div className='flex'>
            {Array.from({ length: fullStars }).map((_, index) => (
              <FaStar key={index} className='text-red-600' />
            ))}
            {Array.from({ length: emptyStars }).map((_, index) => (
              <FaRegStar key={index} className='text-red-600' />
            ))}
          </div>
        </div>
        <p className='italic text-sm'>{date}</p>
        <p>{content}</p>
      </div>
    </div>
  )
}

export default CustomerFeedBacks
