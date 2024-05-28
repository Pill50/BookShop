import React from 'react'
import { OrderInCart, UpdateStatusOrder } from '~/types/order'
import FeedbackModal from '../FeedbackModal'
import { useAppDispatch } from '~/hooks/redux'
import { OrderActions } from '~/redux/slices'
import toast, { Toaster } from 'react-hot-toast'

interface IOrderItems {
  orderItemInfo: OrderInCart
  isFeedback: boolean
  isShipped: boolean
}

const OrderItems: React.FC<IOrderItems> = ({ orderItemInfo, isFeedback, isShipped }) => {
  console.log(status)
  const dispatch = useAppDispatch()

  const handleUpdateStatusOrder = () => {
    const data: UpdateStatusOrder = {
      orderId: orderItemInfo.id,
      status: 'COMPLETED'
    }
    dispatch(OrderActions.updateStatusOrder(data))
      .then((res) => toast.success(res.payload?.message as string))
      .catch((err) => toast.error(err.message))
  }

  console.log(isShipped)
  return (
    <>
      <Toaster />
      <div className='border-2 rounded-lg p-2 shadow-lg border-blue-50 my-2 bg-blue-50'>
        <div className='flex flex-col sm:flex-row gap-3 w-full'>
          <figure className='w-40'>
            <img
              src={orderItemInfo.book.thumbnail}
              alt={orderItemInfo.book.title}
              className='rounded-lg object-cover'
            />
          </figure>
          <div className='flex-1 flex flex-col'>
            <div className='flex justify-between items-center'>
              <div className=''>
                <h2 className='card-title font-semibold text-lg'>{orderItemInfo.book.title}</h2>
                <p className='italic text-gray-500'>{orderItemInfo.book.description}</p>
              </div>
              <div className='flex flex-col items-end'>
                <p className='italic'>{orderItemInfo.orderDate.slice(0, 10)}</p>
                <div className='bg-green-500 px-2 rounded-lg text-white'>-{orderItemInfo.discount}%</div>
              </div>
            </div>
            <div className='flex justify-between'>
              <p className='font-bold text-red-500'>x{orderItemInfo.amount}</p>
              <p className='font-bold 0 text-red-500'>
                <span className='text-gray-400 line-through italic'>
                  {Math.round(orderItemInfo.price / (1 - orderItemInfo.discount / 100)).toFixed(2)}
                </span>
                <span> - {orderItemInfo.price.toFixed(2)} VNĐ</span>
              </p>
            </div>
            <div className='block bg-gray-200 h-[1px] my-1'></div>
            <div
              className={`${isFeedback || isShipped ? 'flex justify-between items-end' : 'text-right'}  mt-auto font-semibold`}
            >
              <div className='flex gap-2'>
                {isFeedback && <FeedbackModal bookId={orderItemInfo.book.id} />}
                {isShipped && (
                  <button
                    className='focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 z-10'
                    onClick={handleUpdateStatusOrder}
                  >
                    Received Order
                  </button>
                )}
              </div>
              <div className=''>
                Total item's price:{' '}
                <span className='text-red-500 font-bold italic'>{orderItemInfo.totalPrice} VNĐ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderItems
