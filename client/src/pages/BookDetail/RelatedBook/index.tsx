import React from 'react'
import { FaBook } from 'react-icons/fa'
import BookCard from '~/components/BookCard'
import { Book } from '~/types/book'

interface IRelatedBook {
  bookList: Book[]
}

const RelatedProduct: React.FC<IRelatedBook> = ({ bookList }) => {
  return (
    <div className='my-4'>
      <div className='flex gap-1 items-center rounded-lg bg-yellow-200 p-2 w-fit'>
        <div className='p-2 bg-yellow-500 rounded-lg'>
          <FaBook size={28} color='white' />
        </div>
        <h3 className='text-xl text-yellow-600 font-bold'>Product Related</h3>
      </div>
      <div className='grid grid-cols-1 gap-4 my-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {bookList?.length > 0 &&
          bookList?.map((book: Book) => (
            <BookCard
              key={book.id}
              id={book.id}
              author={book.author?.name || 'No Author'}
              soldNumber={book.soldNumber}
              slug={book.slug}
              title={book.title}
              amount={book.amount}
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
  )
}

export default RelatedProduct
