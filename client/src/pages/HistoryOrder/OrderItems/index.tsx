import React from 'react'
import { OrderInCart } from '~/types/order'

interface IOrderItems {
    orderItemInfo: OrderInCart
}

const OrderItems: React.FC<IOrderItems> = ({ orderItemInfo }) => {
    return (
        <>
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
                                <h2 className='card-title'>{orderItemInfo.book.title}</h2>
                                <p className='italic'>{orderItemInfo.book.description}</p>
                            </div>
                            <div className='flex flex-col items-end'>
                                <p className='italic'>{orderItemInfo.orderDate.slice(0, 10)}</p>
                                <div className='badge bg-red-500 py-2 px-4 rounded-lg text-white'>
                                    -{orderItemInfo.discount}%
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <p className='font-bold text-red-500'>x{orderItemInfo.amount}</p>
                            <p className='font-bold 0 text-red-500'>
                                <span className='text-gray-400 line-through italic'>
                                    {Math.round(orderItemInfo.price / (1 - orderItemInfo.discount / 100))}
                                </span>
                                <span> - {orderItemInfo.price} VNĐ</span>
                            </p>
                        </div>
                        <div className='divider my-1'></div>
                        <p className='text-right mt-auto font-bold'>
                            Tổng tiền:{' '}
                            <span className='text-red-500 font-bold italic'>{orderItemInfo.totalPrice} VNĐ</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderItems
