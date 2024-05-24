// import React, { useEffect } from 'react'
// import { IoMdTrendingUp } from 'react-icons/io'
// import BookCard from '~/components/BookCard'
// import { useAppDispatch, useAppSelector } from '~/hooks/redux'
// import { BookActions } from '~/redux/slices'
// import { Book } from '~/types/book'

// const TrendingProduct: React.FC = () => {
//     const dispatch = useAppDispatch()
//     const topTrendingBooks = useAppSelector((state) => state.book.topTrendingBooks)

//     useEffect(() => {
//         dispatch(BookActions.getTopTrendingBooks(null))
//     }, [dispatch])

//     return (
//         <>
//             <div className='bg-red-50'>
//                 <div className='flex gap-1 items-center rounded-tr-lg rounded-tl-lg bg-red-200 p-2'>
//                     <div className='p-2 bg-red-500 rounded-lg'>
//                         <IoMdTrendingUp size={28} color='white' />
//                     </div>
//                     <h3 className='text-xl text-red-500 font-bold'>Product Trending</h3>
//                 </div>
//                 <div className='grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
//                     {topTrendingBooks.length > 0 &&
//                         topTrendingBooks.map((book: Book) => (
//                             <BookCard
//                                 key={book.id}
//                                 id={book.id}
//                                 title={book.title}
//                                 amount={book.amount}
//                                 slug={book.slug}
//                                 author={book.author.name}
//                                 description={book.description}
//                                 curPrice={book.price}
//                                 oldPrice={Math.round(book.price / (1 - book.discount / 100))}
//                                 discount={book.discount}
//                                 categories={book.categories}
//                                 thumbnail={book.thumbnail}
//                             />
//                         ))}
//                 </div>
//             </div>
//         </>
//     )
// }

// export default TrendingProduct
