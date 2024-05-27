import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { CartActions, OrderActions, ShipperActions } from '~/redux/slices'
import { BookInCart } from '~/types/book'
import { Order } from '~/types/order'
import { Shipper } from '~/types/shipper'

interface IConfirmModal {
  orderItems: BookInCart[]
}

const ConfirmModal: React.FC<IConfirmModal> = ({ orderItems }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const shipperList = useAppSelector((state) => state.shipper.shippers)
  const [open, setOpen] = useState<boolean>(false)
  const [note, setNote] = useState<string>('')
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [shipper, setShipper] = useState<Shipper>(shipperList[0] || 'Shopee Express')
  const [infoReciever, setInfoReciever] = useState({
    recieverName: '',
    recieverPhone: '',
    address: ''
  })

  useEffect(() => {
    setTotalPrice(
      orderItems.reduce((acc, cur) => {
        return acc + cur.price * cur.amount
      }, 0)
    )
  }, [orderItems])

  useEffect(() => {
    dispatch(ShipperActions.getAllShippers(null))
  }, [])

  const handleToggleModal = () => {
    setOpen(!open)
  }

  const handleCreateOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const totalBooks = orderItems.reduce((acc, cur) => {
      return acc + cur.amount
    }, 0)
    const orderData: Order = {
      amount: totalBooks,
      totalPrice: totalPrice,
      note: note,
      recieverName: infoReciever.recieverName,
      recieverPhone: infoReciever.recieverPhone,
      address: infoReciever.address,
      shipperId: shipper.id,
      orderItem: orderItems
    }

    const response = await dispatch(OrderActions.createOrder(orderData))
    if (response.payload?.statusCode === 200) {
      orderItems.forEach(async (item) => {
        await dispatch(CartActions.deleteBookInCart(item.bookId))
      })
      toast.success(response.payload.message, {
        duration: 1000
      })
      setOpen(false)
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } else {
      toast.error(response.payload?.message as string)
      setOpen(false)
    }
  }

  return (
    <>
      <Toaster />
      <button className='btn btn-neutral z-10' onClick={handleToggleModal}>
        Mua hàng
      </button>
      {open && (
        <div className='fixed z-50 right-0 left-0 top-0 bottom-0 bg-black/50 flex justify-center items-center transition-all'>
          <form className=' bg-white p-4 rounded-lg max-h-[90%] overflow-y-auto'>
            <div className=''>
              <h1 className='font-bold text-lg text-center text-blue-600 mb-2'>Thông tin đơn hàng</h1>
              <h2 className='text-blue-500 font-semibold'>Thông tin người nhận</h2>
              <div className='flex gap-2'>
                <div className='flex flex-col'>
                  <label htmlFor='recieverName' className='text-blue-500 font-semibold'>
                    Tên:
                  </label>
                  <input
                    id='recieverName'
                    type='text'
                    placeholder='Tên người nhận...'
                    value={infoReciever.recieverName}
                    onChange={(e) => setInfoReciever({ ...infoReciever, recieverName: e.target.value })}
                    className='input input-bordered input-info mb-2'
                  />
                </div>
                <div className='flex flex-col'>
                  <label htmlFor='recieverName' className='text-blue-500 font-semibold'>
                    Số điện thoại:
                  </label>
                  <input
                    id='recieverName'
                    type='text'
                    placeholder='Số điện thoại...'
                    value={infoReciever.recieverPhone}
                    onChange={(e) => setInfoReciever({ ...infoReciever, recieverPhone: e.target.value })}
                    className='input input-bordered input-info mb-2'
                  />
                </div>
              </div>
              <div className='flex flex-col'>
                <label htmlFor='recieverName' className='text-blue-500 font-semibold'>
                  Địa chỉ:
                </label>
                <input
                  id='recieverName'
                  type='text'
                  placeholder='Địa chỉ...'
                  value={infoReciever.address}
                  onChange={(e) => setInfoReciever({ ...infoReciever, address: e.target.value })}
                  className='input input-bordered input-info mb-2'
                />
              </div>
              <h2 className='text-blue-500 font-semibold'>Chi tiết sản phẩm</h2>
              {/* cart item */}
              <div className='flex flex-col gap-2 mb-2'>
                {orderItems?.map((order: BookInCart) => (
                  <div
                    className='flex justify-around gap-4 items-center bg-slate-100 rounded-lg p-2'
                    key={order.bookId}
                  >
                    <img src={order.thumbnail} alt={order.title} className='w-10 h-10 rounded-full flex-2' />
                    <div className='flex-1'>
                      <h2 className='font-bold truncate ... max-w-[250px]'>{order.title}</h2>
                      <p className='font-semibold text-sm xl:text-base'>Số lượng: {order.amount}</p>
                    </div>
                    <div className='font-semibold text-sm xl:text-base flex-2'>
                      <h2 className=''>Giảm: {order.discount}%</h2>
                      <span>Giá: </span>
                      <span className='text-red-500 font-bold'>{order.price} VNĐ</span>
                    </div>
                  </div>
                ))}
                <div className='ml-auto'>
                  <p className='font-semibold'>
                    Tổng sản phẩm: <span className='text-lg text-red-500'>{orderItems.length}</span>
                  </p>
                  <p className='font-semibold'>
                    Tổng giá tiền: <span className='text-lg text-red-500'>{totalPrice} VNĐ</span>
                  </p>
                </div>
              </div>
              {/* shipper */}
              <h2 className='text-blue-500 font-semibold'>Đơn vị vận chuyển</h2>
              <div className='dropdown'>
                <div tabIndex={0} role='button' className='btn btn-primary mb-2 min-w-[200px]'>
                  {shipper?.companyName}
                </div>
                <ul
                  tabIndex={0}
                  className='dropdown-content flex flex-col menu p-2 shadow bg-base-100 rounded-box w-52 max-h-[150px] overflow-y-auto'
                >
                  {/* {shipperList?.map((shipper: Shipper) => (
                    <li key={shipper.id} onClick={() => setShipper(shipper)}>
                      <a>{shipper.companyName}</a>
                    </li>
                  ))} */}
                </ul>
              </div>
              <h2 className='text-blue-500 font-semibold'>Chú thích</h2>
              <input
                type='text'
                placeholder='Ghi chú...'
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className='input input-bordered input-info w-full h-30 mb-2'
              />
            </div>
            <div className='flex justify-end gap-2'>
              <button className='btn ml-2' onClick={handleToggleModal}>
                Hủy
              </button>
              <button className='text-white btn btn-primary' onClick={handleCreateOrder} type='submit'>
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default ConfirmModal
