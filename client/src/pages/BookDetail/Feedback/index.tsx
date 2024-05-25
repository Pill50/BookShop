import React from 'react'
import { MdFeedback } from 'react-icons/md'
import CustomerFeedBacks from './CustomerFeedbacks'
import { Book } from '~/types/book'

interface IFeedback {
  book: Book
}

const Feedback: React.FC<IFeedback> = ({ book }) => {
  return (
    <div className='mt-3'>
      <div className='flex gap-1 items-center rounded-lg bg-red-200 p-2 w-fit'>
        <div className='p-2 bg-red-500 rounded-lg'>
          <MdFeedback size={28} color='white' />
        </div>
        <h3 className='text-xl text-red-500 font-bold'>Customer Feedbacks</h3>
      </div>
      {book?.feedbacks?.map((feedback, index: number) => (
        <CustomerFeedBacks
          key={index}
          userName={feedback.user.displayName}
          userAvatar={feedback.user.avatar as string}
          rating={feedback.rating}
          date={feedback.createdAt.slice(0, 10)}
          content={feedback.content}
        />
      ))}
    </div>
  )
}

export default Feedback
