import React, { useEffect, useState } from 'react'
import FilterProducts from './Filters'
import { FaRegLightbulb } from 'react-icons/fa'
import BookCard from '~/components/BookCard'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { BookActions } from '~/redux/slices'
import { Book, FilterBook } from '~/types/book'
import NoResult from '~/assets/images/noResult.png'

const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const urlParams = new URLSearchParams(window.location.search)
  const keyword = urlParams.get('keyword') as string
  const ratingParam = urlParams.get('rating') as string
  const categoriesParam = urlParams.get('categories') as string
  const publisherIdParam = urlParams.get('publisherId') as string
  const pageParam = urlParams.get('page') as string
  const sortByPriceParam = urlParams.get('sortByPrice') as string
  const sortBySoldAmountParam = urlParams.get('sortByAmount') as string
  const sortByDateParam = urlParams.get('sortByDate') as string

  const bookList = useAppSelector((state) => state.book.bookList)
  const totalPage = useAppSelector((state) => state.book.totalPage)
  const totalRecord = useAppSelector((state) => state.book.totalRecord)

  const [pageIndex, setPageIndex] = useState<number>(1)
  const [dataFilter, setDataFilter] = useState<FilterBook>({
    keyword: keyword || undefined,
    pageIndex: Number(pageParam) || 1,
    categories: categoriesParam !== undefined ? [categoriesParam] : undefined,
    publisherId: publisherIdParam !== undefined ? [publisherIdParam] : undefined,
    sortByDate: sortByDateParam || undefined,
    sortByPrice: sortByPriceParam || undefined,
    sortBySoldAmount: sortBySoldAmountParam || undefined,
    rating: Number(ratingParam) || undefined
  })

  useEffect(() => {
    dispatch(BookActions.filterBooks(dataFilter))
  }, [dispatch, dataFilter])

  const handleFiterChange = (categoriesId: string[], publisherId: string[], rating?: number) => {
    setDataFilter({
      ...dataFilter,
      categories: categoriesId,
      publisherId: publisherId,
      pageIndex: pageIndex,
      rating: rating
    })
  }

  const handlePageIndexChange = (type: string) => {
    switch (type) {
      case 'increase': {
        if (pageIndex == totalPage) setPageIndex(1)
        else setPageIndex(pageIndex + 1)
        break
      }
      case 'decrease': {
        if (pageIndex == 1) setPageIndex(totalPage)
        else setPageIndex(pageIndex - 1)
        break
      }
      default:
        break
    }
  }

  return (
    <>
      <div className='max-w-screen-xl p-4 mx-auto'>
        <div className='flex flex-col md:flex-row'>
          <FilterProducts
            onFilterChange={handleFiterChange}
            initCategory={categoriesParam}
            initPublisher={publisherIdParam}
          />
          <div className='flex-1 md:ml-2 mt-4 md:mt-0'>
            <div className='flex gap-2'>
              <FaRegLightbulb size={24} />
              <p>
                Search results for keywords <span className='text-red-500 font-semibold'> {keyword} </span>
              </p>
            </div>
            <div className='bg-orange-100 rounded-lg my-2 py-3'>
              <div className='inline-flex items-center gap-2 p-2 shrink-0 w-full flex-col justify-center md:w-fit md:flex-row flex-wrap'>
                <p className='font-bold text-xl'>Sort by</p>
                <button
                  className='w-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800btn btn-primary md:w-36'
                  onClick={() => setDataFilter({ ...dataFilter, sortBySoldAmount: 'desc' })}
                >
                  Best Selling
                </button>
                <div className='w-1/2 md:w-36 mx-auto'>
                  <select
                    id='countries'
                    className='bg-gray-50 border border-blue-700 text-gray-900 font-semibold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option selected>Publish Date</option>
                    <option value='US' onClick={() => setDataFilter({ ...dataFilter, sortByDate: 'asc' })}>
                      Newest
                    </option>
                    <option value='CA' onClick={() => setDataFilter({ ...dataFilter, sortByDate: 'desc' })}>
                      Latest
                    </option>
                  </select>
                </div>
                <div className='w-1/2 md:w-36 mx-auto'>
                  <select
                    id='countries'
                    className='bg-gray-50 border border-blue-700 text-gray-900 font-semibold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option selected>Price</option>
                    <option value='US' onClick={() => setDataFilter({ ...dataFilter, sortByPrice: 'asc' })}>
                      Ascending
                    </option>
                    <option value='CA' onClick={() => setDataFilter({ ...dataFilter, sortByPrice: 'desc' })}>
                      Descending
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 p-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 relative'>
              {totalRecord === 0 ? (
                <>
                  <div className='absolute left-1/2 translate-x-[-50%] text-center'>
                    <img src={NoResult} alt='No Result' />
                    <h2 className='font-bold text-red-600 text-2xl'>OOP!! No book found!</h2>
                  </div>
                </>
              ) : (
                bookList.map((book: Book) => (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    rating={book.rating}
                    author={book.author?.name || 'No Author'}
                    soldNumber={book.soldNumber}
                    title={book.title}
                    slug={book.slug}
                    amount={book.amount}
                    description={book.description}
                    curPrice={book.price}
                    oldPrice={Math.round(book.price / (1 - book.discount / 100))}
                    discount={book.discount}
                    categories={book.categories}
                    thumbnail={book.thumbnail}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <button
            className='w-20 text-md rounded-tl-md rounded-bl-md bg-gray-300 px-3 py-1 flex items-center justify-center hover:bg-gray-400'
            onClick={() => handlePageIndexChange('decrease')}
          >
            Previous
          </button>
          <div className=' px-3 py-1 flex items-center justify-center border-t-[1px] border-b-[1px] border-gray-300'>
            {pageIndex}
          </div>
          <button className='w-20 text-md rounded-tr-md rounded-br-md bg-gray-300 px-3 py-1 flex items-center justify-center hover:bg-gray-400'>
            Next
          </button>
        </div>
      </div>
    </>
  )
}

export default SearchPage
