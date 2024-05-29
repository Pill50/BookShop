import React, { useEffect, useState } from 'react'
import BookCard from '~/components/BookCard'
import Pagination from '~/components/Pagination'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { PromotionActions } from '~/redux/slices'
import NoResult from '~/assets/images/noResult.png'
import { FilterPromotion, Promotion } from '~/types/promotion'

const PromotionPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const promotionList = useAppSelector((state) => state.promotion.promotionList)
  const totalPage = useAppSelector((state) => state.promotion.totalPage)
  const totalRecord = useAppSelector((state) => state.promotion.totalRecord)

  console.log(promotionList)

  const urlParams = new URLSearchParams(window.location.search)
  const pageParam = urlParams.get('page') as string
  const typeParam = urlParams.get('type') as string

  const [dataFilter, setDataFilter] = useState<FilterPromotion>({
    pageIndex: Number(pageParam) || 1,
    type: typeParam || ''
  })

  useEffect(() => {
    dispatch(PromotionActions.filterPromotions(dataFilter))
  }, [dataFilter])

  const handleChangePage = (page: number) => {
    setDataFilter({ ...dataFilter, pageIndex: page })
  }

  return (
    <>
      <div className='max-w-screen-xl p-4 mx-auto'>
        <div className='flex justify-center items-center'>
          <div
            className={`${typeParam === null ? 'text-white bg-green-500' : 'bg-green-300'} w-1/3 md:w-40 text-center py-3 md:py-4 md:px-10 rounded-tl-lg rounded-bl-lg font-semibold cursor-pointer hover:bg-green-500 transition-all`}
            onClick={() => setDataFilter({ ...dataFilter, type: undefined })}
          >
            ALL
          </div>
          <div
            className={`${typeParam === 'SALE' ? 'text-white bg-green-500' : 'bg-green-300'} w-1/3 md:w-40 text-center py-3 md:py-4 md:px-10 font-semibold cursor-pointer hover:bg-green-500 transition-all border-l-[1px] border-r-[1px]`}
            onClick={() => setDataFilter({ ...dataFilter, type: 'SALE' })}
          >
            ON SALE
          </div>
          <div
            className={`${typeParam === 'POPULAR' ? 'text-white bg-green-500' : 'bg-green-300'} w-1/3 md:w-40 text-center py-3 md:py-4 md:px-10 rounded-tr-lg rounded-br-lg font-semibold cursor-pointer hover:bg-green-500 transition-all`}
            onClick={() => setDataFilter({ ...dataFilter, type: 'POPULAR' })}
          >
            POPULAR
          </div>
        </div>
        {totalRecord === 0 ? (
          <>
            <div className='text-center mx-auto flex justify-center flex-col items-center'>
              <img src={NoResult} alt='No Result' />
              <h2 className='font-bold text-red-600 text-2xl'>OOP!! No promotions found!</h2>
            </div>
          </>
        ) : (
          <>
            <div className='grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mb-3'>
              {promotionList?.length > 0 &&
                promotionList?.map((promotion: Promotion, index: number) => (
                  <BookCard
                    key={index}
                    id={promotion.book.id}
                    promotions={promotion as Promotion}
                    title={promotion.book.title}
                    soldNumber={promotion.book.soldNumber}
                    amount={promotion.book.amount}
                    slug={promotion.book.slug}
                    author={promotion.book.author?.name || 'No Author'}
                    description={promotion.book.description}
                    curPrice={promotion.book.price}
                    oldPrice={Math.round(promotion.book.price / (1 - promotion.book.discount / 100))}
                    discount={promotion.book.discount}
                    categories={promotion.book.categories}
                    thumbnail={promotion.book.thumbnail}
                  />
                ))}
            </div>
            <Pagination totalPage={totalPage} handleChangePage={handleChangePage} />
          </>
        )}
      </div>
    </>
  )
}

export default PromotionPage
