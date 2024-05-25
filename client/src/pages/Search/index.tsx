import React, { useEffect, useState } from 'react'
import FilterProducts from './Filters'
import { FaRegLightbulb } from 'react-icons/fa'
import BookCard from '~/components/BookCard'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { BookActions } from '~/redux/slices'
import { Book, FilterBook } from '~/types/book'

const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const urlParams = new URLSearchParams(window.location.search)
  const keyword = urlParams.get('keyword') as string
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
    sortBySoldAmount: sortBySoldAmountParam || undefined
  })

  useEffect(() => {
    dispatch(BookActions.filterBooks(dataFilter))
  }, [dispatch, dataFilter])

  const handleFiterChange = (categoriesId: string[], publisherId: string[]) => {
    setDataFilter({
      ...dataFilter,
      categories: categoriesId,
      publisherId: publisherId,
      pageIndex: pageIndex
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
      <div className='container mx-auto px-12 py-4'>
        <div className='flex'>
          <FilterProducts
            onFilterChange={handleFiterChange}
            initCategory={categoriesParam}
            initPublisher={publisherIdParam}
          />
          <div className='flex-1 ml-2'>
            <div className='flex gap-2'>
              <FaRegLightbulb size={24} />
              <p>
                Kết quả tìm kiếm cho từ khóa <span className='text-red-500 font-semibold'> {keyword} </span>
              </p>
            </div>
            <div className='bg-gray-200 rounded-lg my-2'>
              <div className='inline-flex items-center gap-2 p-2 shrink-0'>
                <p>Sắp xếp theo</p>
                <button
                  className='btn btn-primary w-36'
                  onClick={() => setDataFilter({ ...dataFilter, sortBySoldAmount: 'desc' })}
                >
                  Bán chạy
                </button>
                <div className='dropdown dropdown-end'>
                  <div tabIndex={0} role='button' className='btn btn-primary m-1  w-36'>
                    Ngày ra mắt
                  </div>
                  <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
                    <li onClick={() => setDataFilter({ ...dataFilter, sortByDate: 'asc' })}>
                      <a>Mới nhất</a>
                    </li>
                    <li onClick={() => setDataFilter({ ...dataFilter, sortByDate: 'desc' })}>
                      <a>Cũ nhất</a>
                    </li>
                  </ul>
                </div>
                <div className='dropdown dropdown-end'>
                  <div tabIndex={0} role='button' className='btn btn-primary m-1  w-36'>
                    Giá
                  </div>
                  <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
                    <li onClick={() => setDataFilter({ ...dataFilter, sortByPrice: 'asc' })}>
                      <a>Tăng dần</a>
                    </li>
                    <li onClick={() => setDataFilter({ ...dataFilter, sortByPrice: 'desc' })}>
                      <a>Giảm dần</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 p-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {totalRecord === 0 ? (
                <>
                  <h2 className='font-bold'>No books found!!</h2>
                </>
              ) : (
                bookList.map((book: Book) => (
                  <BookCard
                    key={book.id}
                    id={book.id}
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
        <div className='join flex justify-end'>
          <button className='join-item btn bg-blue-200' onClick={() => handlePageIndexChange('decrease')}>
            «
          </button>
          <button className='join-item btn'>Page {pageIndex}</button>
          <button className='join-item btn bg-blue-200' onClick={() => handlePageIndexChange('increase')}>
            »
          </button>
        </div>
      </div>
    </>
  )
}

export default SearchPage
