import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import Loading from '~/components/Loading'
import DetailBookInfo from './BookInfor'
import Feedback from './Feedback'
import RelatedBook from './RelatedBook'
import { useParams } from 'react-router-dom'
import { BookActions } from '~/redux/slices'

const BookDetailPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { slug } = useParams()
  const book = useAppSelector((state) => state.book.book)
  const bookList = useAppSelector((state) => state.book.bookList)

  useEffect(() => {
    dispatch(BookActions.getBookBySlug(slug as string))
  }, [dispatch, slug])

  useEffect(() => {
    const categories = book?.categories?.map((category) => category.id).join(',')
    dispatch(BookActions.getRelatedBooks(categories))
  }, [dispatch, book])

  const isLoading = useAppSelector((state) => state.book.isLoading)

  return (
    <>
      {isLoading && <Loading />}
      <div className='container mx-auto my-4 px-12'>
        <DetailBookInfo book={book} />
        <Feedback book={book} />
        <RelatedBook bookList={bookList} />
      </div>
    </>
  )
}

export default BookDetailPage
