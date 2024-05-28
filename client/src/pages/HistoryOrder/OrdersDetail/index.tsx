import React from 'react'
import { FaTruck } from 'react-icons/fa'
import { IoLocationSharp } from 'react-icons/io5'
import { FaStore } from 'react-icons/fa'
import OrderItems from '../OrderItems'
import { OrderInCart, UserOrder } from '~/types/order'
interface IOrderDetail {
  ordersInfo: UserOrder
  handleUpdateStatusOrder: (orderId: string) => void
}

const OrdersDetail: React.FC<IOrderDetail> = ({ ordersInfo, handleUpdateStatusOrder }) => {
  const orderStatus = ordersInfo.status
  return (
    <div className='shadow-lg p-2 rounded-md mt-2 mb-4'>
      <div className='my-2'>
        <div className='flex gap-1'>
          <FaTruck size={24} color='green' />
          <h3 className='font-bold'>Shipping information</h3>
        </div>
        <p className='list-item ml-4'>
          Shipping unit: <span className='italic'>{ordersInfo.shipper?.companyName}</span>
        </p>
        <div className='flex gap-2 items-center'>
          <p className='list-item ml-4'>Order status:</p>
          <div
            className={`${orderStatus === 'PENDING' ? 'bg-yellow-200' : orderStatus === 'COMPLETED' ? 'bg-green-200' : orderStatus === 'SHIPPED' ? 'bg-blue-200' : 'bg-gray-200'} rounded-md p-2 font-medium`}
          >
            {orderStatus}
          </div>
        </div>
      </div>
      <div className='my-2'>
        <div className='flex gap-1'>
          <IoLocationSharp size={24} color='green' />
          <h3 className='font-bold'>Receiver's information</h3>
        </div>
        <p className='list-item ml-4 italic'>{ordersInfo.receiverName}</p>
        <p className='list-item ml-4 italic'>{ordersInfo.receiverPhone}</p>
        <p className='list-item ml-4 italic'>{ordersInfo.address}</p>
      </div>
      <div>
        <div className='flex gap-1'>
          <FaStore size={24} color='green' />
          <h3 className='font-bold'>Order's information</h3>
        </div>
        <ul>
          {ordersInfo.orderDetail.map((order: OrderInCart) => {
            return (
              <li key={order.id}>
                <OrderItems orderItemInfo={order} isFeedback={orderStatus === 'COMPLETED'} />
              </li>
            )
          })}
        </ul>
        <div className='flex flex-col justify-end items-end gap-2 font-semibold my-2'>
          <p>
            Total price: <span className='text-red-500 text-xl'>{ordersInfo.totalPrice.toFixed(2)} VNĐ</span>
          </p>
          {orderStatus === 'SHIPPED' && (
            <button
              className='focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 z-10'
              onClick={() => handleUpdateStatusOrder(ordersInfo.id)}
            >
              Received Order
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrdersDetail
