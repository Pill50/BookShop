import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '~/hooks/redux'
// import { CartActions } from '~/redux/slices'
import { BookInCart } from '~/types/book'
import { Category } from '~/types/category'

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
  categories: Category[]
  thumbnail: string
}

const BookCard: React.FC<IBookCart> = (props: IBookCart) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleAddToCart = (id: string) => {
    const data: BookInCart = {
      bookId: id,
      thumbnail: props.thumbnail,
      description: props.description,
      title: props.title,
      author: props.author,
      amount: 1,
      discount: props.discount,
      price: props.curPrice,
      orderDate: new Date(Date.now()).toISOString()
    }
    // dispatch(CartActions.addBookToCart(data))
  }

  return (
    <div
      className='card bg-base-100 shadow-lg hover:cursor-pointer hover:shadow-2xl transition-all bg-white rounded-2xl'
      onClick={() => navigate(`/book/${props.slug}`)}
    >
      <figure className='px-2 pt-2 md:px-4 md:pt-4'>
        <img src={props.thumbnail} alt={props.title} className='rounded-xl h-[200px] object-cover' />
      </figure>
      <div className='card-body px-4 py-2 gap-1'>
        <div className='flex gap-1 flex-wrap'>
          {props?.categories?.length > 0 &&
            props.categories.map((category: any, index) => (
              <div className='badge bg-red-200 rounded-md text-red-700 font-bold p-3' key={index}>
                {category}
              </div>
            ))}
        </div>
        <h2 className='font-bold truncate ... text-lg xl:text-xl'>{props.title}</h2>
        <p className='italic truncate ... text-sm xl:text-base'>{props.description}</p>
        <p className='font-semibold text-sm xl:text-base'>Stock Amount: {props.amount}</p>
        <div className='font-semibold flex gap-2 items-center text-sm xl:text-base'>
          <span>Price: </span>
          <span className='text-red-500 font-bold'>{props.curPrice} VNĐ</span>
          <div className='badge bg-red-200 rounded-md text-red-700 font-bold p-3'>{props.discount}%</div>
        </div>

        <p className='text-gray-400 line-through text-sm xl:text-base'>Old price: {props.oldPrice} VNĐ</p>

        <div className='w-full'>
          <button
            className='btn btn-success text-white bg-green-700 w-full xl:text-base'
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
  )
}

export default BookCard
