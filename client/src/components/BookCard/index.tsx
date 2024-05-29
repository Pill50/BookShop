import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '~/hooks/redux'
import { BookInCart } from '~/types/book'
import { Category } from '~/types/category'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { CartActions } from '~/redux/slices'
import { Promotion } from '~/types/promotion'
import toast, { Toaster } from 'react-hot-toast'

interface IBookCart {
  id: string
  title: string
  slug: string
  description: string
  author: string
  curPrice: number
  oldPrice: number
  amount: number
  discount: number
  rating?: number
  promotions?: Promotion
  soldNumber: number
  categories: Category[]
  thumbnail: string
}

const BookCard: React.FC<IBookCart> = (props: IBookCart) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleAddToCart = (id: string) => {
    const data: BookInCart = {
      id: id,
      thumbnail: props.thumbnail,
      description: props.description,
      title: props.title,
      author: props.author,
      amount: 1,
      discount: props.discount,
      price: props.curPrice,
      orderDate: new Date(Date.now()).toISOString()
    }
    dispatch(CartActions.addBookToCart(data))
    toast.success('Add book successfully')
  }

  const renderRatingStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className='text-yellow-500' />)
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className='text-yellow-500' />)
      } else {
        stars.push(<FaRegStar key={i} className='text-yellow-500' />)
      }
    }
    return stars
  }

  return (
    <>
      <Toaster />
      <div
        className='bg-base-100 shadow-lg hover:cursor-pointer hover:shadow-2xl transition-all bg-white rounded-2xl flex flex-col relative'
        onClick={() => navigate(`/book/${props.slug}`)}
      >
        {props.promotions && (
          <div className='absolute bg-red-200 px-2 rounded-lg left-[-10px] top-[-5px]'>
            <p className='font-bold text-red-700'>{props.promotions.type}</p>
            <p className='text-sm font-semibold'>End at: {props.promotions.endDate.slice(0, 10)}</p>
          </div>
        )}
        <figure className='px-2 pt-2 md:px-4 md:pt-4'>
          <img src={props.thumbnail} alt={props.title} className='rounded-xl h-[200px] object-cover w-full' />
        </figure>
        <div className='flex flex-col justify-end px-4 py-2 gap-1 flex-1'>
          <div className='flex gap-1 flex-wrap'>
            {props?.categories?.length > 0 &&
              props.categories.map((category: any, index) => (
                <div
                  className='bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-indigo-900 dark:text-indigo-300'
                  key={index}
                >
                  {category}
                </div>
              ))}
          </div>
          <h2 className='font-bold truncate ... text-lg xl:text-xl'>{props.title}</h2>
          <p className='italic truncate ... text-sm xl:text-base'>{props.description}</p>
          <p className='font-semibold truncate ... text-sm xl:text-base'>Author: {props.author}</p>
          <p className='font-semibold truncate ... text-sm xl:text-base'>Sold: {props.soldNumber}</p>
          <p className='text-sm xl:text-base'>Stock Amount: {props.amount}</p>
          <div className='flex gap-2 items-center text-sm xl:text-base'>
            <span>Price: </span>
            <span className='text-red-500 font-bold'>{props.curPrice} VNĐ</span>
            <div className='bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-pink-900 dark:text-pink-300'>
              {props.discount}%
            </div>
          </div>

          <p className='text-gray-400 line-through text-sm xl:text-base'>Old price: {props.oldPrice} VNĐ</p>
          {props?.rating && (
            <div className='flex items-center'>
              <span className='text-gray-600'>{props.rating.toFixed(1)} </span>
              <div className='flex ml-1'>{renderRatingStars(props.rating)}</div>
            </div>
          )}
          <div className='flex-1 flex justify-end items-end'>
            <button
              className='w-full focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
              onClick={(event) => {
                event.stopPropagation()
                handleAddToCart(props.id)
              }}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default BookCard
