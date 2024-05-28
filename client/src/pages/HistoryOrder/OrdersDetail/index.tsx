import React from 'react'
import { FaTruck } from 'react-icons/fa6'
import { IoLocationSharp } from 'react-icons/io5'
import { FaStore } from 'react-icons/fa'
import OrderItems from '../OrderItems'
import { OrderInCart, UserOrder } from '~/types/order'

interface IOrderDetail {
  ordersInfo: UserOrder
}

const OrdersDetail: React.FC<IOrderDetail> = ({ ordersInfo }) => {
  return (
    <>
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
              className={`${ordersInfo.status === 'PENDING' ? 'bg-yellow-200' : ordersInfo.status === 'COMPLETED' ? 'bg-green-200' : ordersInfo.status === 'SHIPPED' ? 'bg-blue-200' : 'bg-gray-200'} rounded-md p-2 font-medium`}
            >
              {ordersInfo.status}
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
        <div className=''>
          <div className='flex gap-1'>
            <FaStore size={24} color='green' />
            <h3 className='font-bold'>Order's information</h3>
          </div>
          <ul>
            {ordersInfo?.orderDetail.map((order: OrderInCart) => (
              <li key={order.id}>
                <OrderItems orderItemInfo={order} isFeedback={ordersInfo.status === 'PENDING'} />
              </li>
            ))}
          </ul>
          <p className='text-right font-semibold my-2'>
            Total price: <span className='text-red-500 text-xl'>{ordersInfo.totalPrice.toFixed(2)} VNĐ</span>
          </p>
        </div>
      </div>
    </>
  )
}

export default OrdersDetail