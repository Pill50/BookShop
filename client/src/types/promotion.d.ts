import { Book } from './book'

export type Promotion = {
  type: string
  book: Book
  startDate: string
  endDate: string
}

export type FilterPromotion = {
  pageIndex: number
  type?: string
}

export type FilterPromotionResponse = {
  promotions: Promotion[]
  totalPage: number
  totalRecord: number
}
