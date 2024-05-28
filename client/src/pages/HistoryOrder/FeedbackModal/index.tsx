import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { FaStar } from 'react-icons/fa'
import { FaRegStar } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { FeedbackActions } from '~/redux/slices'
import { CreateFeedback } from '~/types/feedback'
interface IFeedbackModal {
  bookId: string
}

const FeedbackModal: React.FC<IFeedbackModal> = ({ bookId }) => {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState<boolean>(false)
  const [rating, setRating] = useState<number>()
  const [content, setContent] = useState<string>('')

  const createFeedback = async () => {
    if (rating === undefined) {
      toast.error('Rating is required')
    } else {
      const data: CreateFeedback = {
        content: content,
        rating: rating as number,
        userId: user.id,
        bookId: bookId
      }
      await dispatch(FeedbackActions.createFeedback(data))
        .then((res) => {
          toast.success(res.payload?.message as string)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
  }

  return (
    <>
      <Toaster />
      <button
        className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 z-10'
        onClick={() => setOpen(true)}
      >
        Feedback
      </button>
      {open && (
        <div className='fixed z-[1500] right-0 left-0 top-0 bottom-0 bg-black/50 flex justify-center items-center transition-all'>
          <div className='bg-white p-10 rounded-lg flex flex-col gap-2'>
            <h2 className='text-xl text-blue-500'>Give your feeback about our book</h2>
            <div className=''>
              <p className='bg-orange-100 text-orange-500 p-2 rounded-md font-semibold'>Rating</p>
              <ul className='mt-2'>
                <li className='flex mb-2'>
                  <input
                    type='radio'
                    name='rating'
                    onChange={() => setRating(5)}
                    className='mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <FaStar className='text-yellow-300' />
                  <FaStar className='text-yellow-300' />
                  <FaStar className='text-yellow-300' />
                  <FaStar className='text-yellow-300' />
                  <FaStar className='text-yellow-300' />
                </li>
                <li className='flex mb-2'>
                  <input
                    type='radio'
                    name='rating'
                    onChange={() => setRating(4)}
                    className='mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <FaStar className='text-yellow-300' />
                  <FaStar className='text-yellow-300' />
                  <FaStar className='text-yellow-300' />
                  <FaStar className='text-yellow-300' />
                  <FaRegStar className='text-yellow-300' />
                </li>
                <li className='flex mb-2'>
                  <input
                    type='radio'
                    name='rating'
                    onChange={() => setRating(3)}
                    className='mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <FaStar className='text-yellow-300' />
                  <FaStar className='text-yellow-300' />
                  <FaStar className='text-yellow-300' />
                  <FaRegStar className='text-yellow-300' />
                  <FaRegStar className='text-yellow-300' />
                </li>
                <li className='flex mb-2'>
                  <input
                    type='radio'
                    name='rating'
                    onChange={() => setRating(2)}
                    className='mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <FaStar className='text-yellow-300' />
                  <FaStar className='text-yellow-300' />
                  <FaRegStar className='text-yellow-300' />
                  <FaRegStar className='text-yellow-300' />
                  <FaRegStar className='text-yellow-300' />
                </li>
                <li className='flex mb-2'>
                  <input
                    type='radio'
                    name='rating'
                    onChange={() => setRating(1)}
                    className='mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <FaStar className='text-yellow-300' />
                  <FaRegStar className='text-yellow-300' />
                  <FaRegStar className='text-yellow-300' />
                  <FaRegStar className='text-yellow-300' />
                  <FaRegStar className='text-yellow-300' />
                </li>
              </ul>
            </div>
            <div className=''>
              <p className='bg-orange-100 text-orange-500 p-2 rounded-md font-semibold'>Content</p>
              <input
                type='text'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='Give your feedback here'
                className='px-2 py-3 rounded-lg border-[1px] outline-none my-2 text-gray-500 w-full font-normal'
              />
            </div>
            <div className='flex gap-2 justify-center'>
              <button
                type='button'
                className='text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center'
                onClick={(e) => {
                  setOpen(false)
                  createFeedback()
                }}
              >
                Submit
              </button>
              <button
                type='button'
                className='text-white bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center'
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FeedbackModal
