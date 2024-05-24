import { Author } from './author'
import { Category } from './category'
import { Feedback } from './feedback'
import { Publisher } from './publisher'

export type Book = {
  id: string
  categories: Category[]
  author: Author
  publisher: Publisher
  feedbacks: Feedback[]
  thumbnail: string
  slug: string
  title: string
  description: string
  amount: number
  soldNumber: number
  price: number
  discount: number
}

export type FilterBook = {
  pageIndex: number
  keyword?: string
  publisherId?: string[]
  categories?: string[]
  sortByPrice?: string
  sortBySoldAmount?: string
  sortByDate?: string
}

export type FilterBookResponse = {
  books: Book[]
  totalPage: number
  totalRecord: number
}

export type BookInCart = {
  bookId: string
  description: string
  thumbnail: string
  title: string
  author: string
  amount: number
  price: number
  discount: number
  orderDate: string
}

export type UpdateBookInCart = {
  bookId: string
  amount: number
}
