import React, { useEffect } from 'react'
import BookCard from '~/components/BookCard'
import Pagination from '~/components/Pagination'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { BookActions } from '~/redux/slices'
import { Book } from '~/types/book'

const PromotionPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const bookList = useAppSelector((state) => state.book.bookList)
  const topTrendingBooks = useAppSelector((state) => state.book.topTrendingBooks)
  const totalPage = useAppSelector((state) => state.book.totalPage)
  const totalRecord = useAppSelector((state) => state.book.totalRecord)

  useEffect(() => {
    dispatch(BookActions.getTopTrendingBooks(null))
  }, [])

  const handleChangePage = () => {}

  return (
    <>
      <div className='max-w-screen-xl p-4 mx-auto'>
        <div className='flex justify-center items-center'>
          <div className='bg-green-300 w-40 text-center py-4 px-10 rounded-tl-lg rounded-bl-lg font-semibold cursor-pointer hover:bg-green-500 transition-all'>
            ALL
          </div>
          <div className='bg-green-300 w-40 text-center py-4 px-10 font-semibold cursor-pointer hover:bg-green-500 transition-all border-l-[1px] border-r-[1px]'>
            ON SALE
          </div>
          <div className='bg-green-300 w-40 text-center py-4 px-10 rounded-tr-lg rounded-br-lg font-semibold cursor-pointer hover:bg-green-500 transition-all'>
            POPULAR
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mb-3'>
          {topTrendingBooks?.length > 0 &&
            topTrendingBooks?.map((book: Book) => (
              <BookCard
                key={book.id}
                id={book.id}
                promotions={book.promotions}
                title={book.title}
                soldNumber={book.soldNumber}
                amount={book.amount}
                slug={book.slug}
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
        <Pagination totalPage={10} handleChangePage={handleChangePage} />
      </div>
    </>
  )
}

export default PromotionPage
