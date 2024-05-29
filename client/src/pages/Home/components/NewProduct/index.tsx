import React, { useEffect } from 'react'
import { FaRegNewspaper } from 'react-icons/fa6'
import { FaChevronRight } from 'react-icons/fa'
import BookCard from '~/components/BookCard'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { BookActions } from '~/redux/slices'
import { Book } from '~/types/book'
import { useNavigate } from 'react-router-dom'

const NewProduct: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const topNewestBooks = useAppSelector((state) => state.book.newestBooks)

  useEffect(() => {
    dispatch(BookActions.getTopNewest(null))
  }, [dispatch])

  return (
    <>
      <div className='mt-10'>
        <div className='flex gap-1 items-center rounded-tr-lg rounded-tl-lg bg-blue-200 p-2'>
          <div className='p-2 bg-blue-500 rounded-lg'>
            <FaRegNewspaper size={28} color='white' />
          </div>
          <h3 className='text-xl text-blue-500 font-bold'>New Product</h3>
          <button
            type='button'
            className='ml-auto flex items-center justify-between text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 shrink-0'
            onClick={() => navigate(`/search?sortByDate=desc`)}
          >
            View More
            <FaChevronRight className='mt-1 ml-1' />
          </button>
        </div>
        <div className='grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          {topNewestBooks.length > 0 &&
            topNewestBooks.map((book: Book) => (
              <BookCard
                key={book.id}
                id={book.id}
                slug={book.slug}
                title={book.title}
                soldNumber={book.soldNumber}
                amount={book.amount}
                author={book.author?.name || 'No Author'}
                description={book.description}
                curPrice={book.price}
                oldPrice={Math.round(book.price / (1 - book.discount / 100))}
                discount={book.discount}
                categories={book.categories}
                thumbnail={book.thumbnail}
              />
            ))}
        </div>
      </div>
    </>
  )
}

export default NewProduct
