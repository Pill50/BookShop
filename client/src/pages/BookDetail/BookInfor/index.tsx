import React, { useState } from 'react'
import { Book, BookInCart } from '~/types/book'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { Promotion } from '~/types/promotion'
import { CartActions } from '~/redux/slices'
import { useAppDispatch } from '~/hooks/redux'
import toast, { Toaster } from 'react-hot-toast'

interface IDetailBookInfo {
  book: Book
}

const DetailBookInfo: React.FC<IDetailBookInfo> = ({ book }) => {
  const dispatch = useAppDispatch()
  const [amount, setAmount] = useState<number>(1)

  const averageRating = book?.feedbacks?.length
    ? book.feedbacks.reduce((acc, cur) => acc + cur.rating, 0) / book.feedbacks.length
    : 0
  const fullStars = Math.floor(averageRating)
  const hasHalfStar = averageRating % 1 !== 0
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const handleAddToCart = (id: string) => {
    const data: BookInCart = {
      id: id,
      thumbnail: book.thumbnail,
      description: book.description,
      title: book.title,
      author: book.author.name,
      amount: 1,
      discount: book.discount,
      price: book.price,
      orderDate: new Date(Date.now()).toISOString()
    }
    dispatch(CartActions.addBookToCart(data))
    toast.success('Add book successfully')
  }

  const originalPrice = book.discount ? Math.round(book.price / (1 - book.discount / 100)) : book.price

  return (
    <>
      <Toaster />
      <div className='flex flex-col md:justify-center gap-4 lg:flex-row bg-gray-100 rounded-xl p-4'>
        <div className='w-full sm:w-1/2 mx-auto lg:mx-0 lg:w-[400px] my-auto flex flex-col gap-2'>
          <figure className='w-full h-full'>
            <img src={book.thumbnail} alt={book.title} className='rounded-lg object-cover w-full' />
          </figure>
          <div className='flex justify-between'>
            {book.subImgList?.map((item) => (
              <img src={item.url} alt={item.id} className='rounded-lg object-cover w-[32%]' key={item.id} />
            ))}
          </div>
        </div>
        <div className='flex flex-col gap-2 justify-center'>
          <h2 className='font-bold text-2xl text-blue-600 truncate'>{book.title}</h2>
          <p className='italic truncate'>{book.description}</p>
          <div className='bg-orange-100 rounded-lg p-3 w-full'>
            <div className='text-center flex gap-3 flex-wrap'>
              <div className='text-gray-600 flex items-center gap-1'>
                <span className='text-xl underline text-gray-800'>{averageRating.toFixed(1)} </span>
                <div className='flex'>
                  {Array.from({ length: fullStars }).map((_, index) => (
                    <FaStar key={index} className='text-red-600' />
                  ))}
                  {hasHalfStar && <FaStarHalfAlt className='text-red-600' />}
                  {Array.from({ length: emptyStars }).map((_, index) => (
                    <FaRegStar key={index} className='text-red-600' />
                  ))}
                </div>
              </div>
              <span>|</span>
              <p className='text-gray-600'>
                <span className='text-xl underline text-gray-800'>{book?.feedbacks?.length}</span> Feedbacks
              </p>
              <span>|</span>
              <p className='text-gray-600'>
                <span className='text-xl underline text-gray-800'>{book.soldNumber}</span> Sold
              </p>
            </div>
          </div>
          <div className='w-fit flex flex-wrap gap-2'>
            {book.categories?.length > 0 &&
              book.categories.map((category: any, index) => (
                <div
                  className='bg-purple-200 text-purple-800 text-xs font-medium px-2.5 py-1 rounded dark:bg-purple-900 dark:text-purple-300'
                  key={index}
                >
                  {category.title}
                </div>
              ))}
          </div>
          <p className='font-semibold'>
            Author: <span className='font-normal'>{book.author?.name}</span>
          </p>
          <p className='font-semibold'>
            Publisher: <span className='font-normal'>{book.publisher?.name}</span>
          </p>
          <p className='font-semibold'>
            Stock Amount: <span className='font-normal'>{book.amount}</span>
          </p>
          <div className='bg-blue-100 rounded-lg p-3 flex items-center justify-between'>
            <div className='font-semibold'>
              <span className='line-through text-gray-600'>{originalPrice}</span> -
              <span className='text-2xl text-red-500 font-bold'>{book.price} </span> VNĐ
            </div>
            <div className='w-fit bg-purple-300 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300'>
              -{book.discount}%
            </div>
          </div>
          <div className='flex'>
            <button
              className='join-item text-xl bg-gray-300 px-3 py-1 flex items-center justify-center hover:bg-gray-400'
              onClick={() => {
                if (amount === 1) setAmount(1)
                else setAmount(amount - 1)
              }}
            >
              -
            </button>
            <button className='join-item px-3 py-1 flex items-center justify-center border-t-[1px] border-b-[1px] border-gray-300'>
              {amount}
            </button>
            <button
              className='join-item text-xl bg-gray-300 px-3 py-1 flex items-center justify-center hover:bg-gray-400'
              onClick={() => {
                if (amount === book.amount) setAmount(book.amount)
                else setAmount(amount + 1)
              }}
            >
              +
            </button>
          </div>
          <div className=''>
            <button
              className='min-w-40 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
              onClick={(event) => {
                event.stopPropagation()
                handleAddToCart(book.id)
              }}
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <div className='flex flex-col h-fit gap-2'>
          {book.promotions?.length > 0 &&
            book.promotions.map((promotion: Promotion, index: number) => (
              <div className='bg-green-200 p-2 rounded-lg text-sm text-gray-600' key={index}>
                <p>
                  Type: <span className='font-bold text-lg text-green-600'>{promotion.type}</span>
                </p>
                <p>
                  Start date: <span className='font-semibold'>{promotion.startDate.slice(0, 10)}</span>
                </p>
                <p>
                  End date: <span className='font-semibold'>{promotion.endDate.slice(0, 10)}</span>
                </p>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default DetailBookInfo
