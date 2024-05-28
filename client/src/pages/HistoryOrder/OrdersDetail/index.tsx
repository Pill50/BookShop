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
            <h3 className='font-bold'>Thông tin vận chuyển</h3>
          </div>
          <p className='list-item ml-4'>
            Đơn vị vận chuyển: <span className='italic'>{ordersInfo.shipper?.companyName}</span>
          </p>
          <div className='flex gap-2 items-center'>
            <p className='list-item ml-4'>Tình trạng:</p>
            <div className={`badge badge-accent text-white bg-${ordersInfo.status} p-2 font-medium`}>
              {ordersInfo.status}
            </div>
          </div>
        </div>
        <div className='my-2'>
          <div className='flex gap-1'>
            <IoLocationSharp size={24} color='green' />
            <h3 className='font-bold'>Thông tin người nhận</h3>
          </div>
          <p className='list-item ml-4 italic'>{ordersInfo.recieverName}</p>
          <p className='list-item ml-4 italic'>{ordersInfo.recieverPhone}</p>
          <p className='list-item ml-4 italic'>{ordersInfo.address}</p>
        </div>
        <div className=''>
          <div className='flex gap-1'>
            <FaStore size={24} color='green' />
            <h3 className='font-bold'>Thông tin đơn hàng</h3>
          </div>
          <ul>
            {ordersInfo?.orderDetail.map((order: OrderInCart) => (
              <li key={order.id}>
                <OrderItems orderItemInfo={order} />
              </li>
            ))}
          </ul>
          <p className='text-right font-bold my-2'>
            Tổng tiền: <span>{ordersInfo.totalPrice} VNĐ</span>
          </p>
        </div>
      </div>
    </>
  )
}

export default OrdersDetail
