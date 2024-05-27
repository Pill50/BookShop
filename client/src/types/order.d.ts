import { BookInCart } from './book'
import { Shipper } from './shipper'

export type Order = {
  amount: number
  totalPrice: number
  shipperId: string
  note: string
  recieverName: string
  recieverPhone: string
  address: string
  orderItem: BookInCart[]
}

export type UserOrderResponse = {
  order: Order
  totalPage: number
  totalRecord: number
}

export type GetUserOrder = {
  pageIndex: number
  status?: string
}

export type OrderInCart = {
  id: string
  amount: number
  discount: number
  orderDate: string
  price: number
  totalPrice: number
  book: BookInCart
}

export type UserOrder = {
  amount: number
  totalPrice: number
  shipper?: Shipper
  note: string
  status: string
  recieverName: string
  recieverPhone: string
  address: string
  orderDate: string
  orderDetail: OrderInCart[]
}
