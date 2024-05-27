import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowDown } from 'react-icons/io'
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
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [infoReciever, setInfoReciever] = useState({
    recieverName: '',
    recieverPhone: '',
    address: ''
  })

  useEffect(() => {
    setTotalPrice(
      orderItems.reduce((acc, cur) => {
        return (acc += (cur.price * cur.amount * (100 - cur.discount)) / 100)
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
      <button
        className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 z-10'
        onClick={handleToggleModal}
      >
        Order Now
      </button>
      {open && (
        <div className='fixed z-[1500] right-0 left-0 top-0 bottom-0 bg-black/50 flex justify-center items-center transition-all'>
          <form className=' bg-white p-4 rounded-lg max-h-[90%] overflow-y-auto w-full mx-2 md:w-fit'>
            <div className=''>
              <h1 className='font-bold text-xl text-center text-blue-600 mb-2'>Order's Information</h1>
              <h2 className='text-blue-600 font-semibold bg-blue-50 rounded-md w-1/2 p-2'>Receiver's information</h2>
              <div className='flex flex-col md:flex-row md:gap-2'>
                <div className='flex flex-col flex-1'>
                  <label htmlFor='recieverName' className='text-gray-600 font-semibold'>
                    Name:
                  </label>
                  <input
                    id='recieverName'
                    type='text'
                    placeholder="Enter reciever's name"
                    value={infoReciever.recieverName}
                    onChange={(e) => setInfoReciever({ ...infoReciever, recieverName: e.target.value })}
                    className='mb-2 rounded-lg'
                  />
                </div>
                <div className='flex flex-col flex-1'>
                  <label htmlFor='phone' className='text-gray-600 font-semibold'>
                    Phone:
                  </label>
                  <input
                    id='phone'
                    type='text'
                    placeholder='Enter phone number'
                    value={infoReciever.recieverPhone}
                    onChange={(e) => setInfoReciever({ ...infoReciever, recieverPhone: e.target.value })}
                    className='mb-2 rounded-lg'
                  />
                </div>
              </div>
              <div className='flex flex-col'>
                <label htmlFor='address' className='text-gray-600 font-semibold'>
                  Address:
                </label>
                <input
                  id='address'
                  type='text'
                  placeholder="Enter receiver's address"
                  value={infoReciever.address}
                  onChange={(e) => setInfoReciever({ ...infoReciever, address: e.target.value })}
                  className='mb-2 rounded-lg'
                />
              </div>
              <h2 className='text-blue-600 font-semibold bg-blue-50 rounded-md w-1/2 p-2 mb-2'>Order Items</h2>
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
                      <p className='italic text-sm xl:text-base'>Quantity: {order.amount}</p>
                    </div>
                    <div className='text-sm xl:text-base flex-2'>
                      <h2 className=''>Discount: {order.discount}%</h2>
                      <span>Price: </span>
                      <span className='text-red-500 font-bold'>
                        {((order.price * order.amount * (100 - order.discount)) / 100).toFixed(2)} VNĐ
                      </span>
                    </div>
                  </div>
                ))}
                <div className='ml-auto'>
                  <p className='font-semibold'>
                    Total Items: <span className='text-lg text-red-500'>{orderItems.length}</span>
                  </p>
                  <p className='font-semibold'>
                    Total Price: <span className='text-xl text-red-500'>{totalPrice.toFixed(2)} VNĐ</span>
                  </p>
                </div>
              </div>
              {/* shipper */}
              <h2 className='text-blue-600 font-semibold bg-blue-50 rounded-md w-1/2 p-2'>Shipper</h2>
              <div className='mb-3'>
                <div
                  tabIndex={0}
                  role='button'
                  className='btn btn-primary mb-2 min-w-[200px] bg-blue-600 p-2 rounded-md my-2 flex justify-between items-center text-white'
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {shipper?.companyName}
                  <IoIosArrowDown size={20} color='white' />
                </div>
                {dropdownOpen && (
                  <ul
                    tabIndex={0}
                    className='flex flex-col shadow bg-base-100 rounded-box w-full max-h-[150px] overflow-y-auto'
                  >
                    {shipperList?.map((shipper: Shipper) => (
                      <li
                        key={shipper.id}
                        onClick={() => {
                          setShipper(shipper)
                          setDropdownOpen(false)
                        }}
                        className='hover:bg-blue-100 p-1 rounded-md cursor-pointer w-full'
                      >
                        <a className='w-full block'>{shipper.companyName}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Note */}
              <h2 className='text-blue-600 font-semibold bg-blue-50 rounded-md w-1/2 p-2'>Note</h2>
              <input
                type='text'
                placeholder='Something...'
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className='rounded-md w-full h-30 my-2'
              />
            </div>
            <div className='flex justify-end gap-2'>
              <button
                className='focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-900'
                onClick={handleToggleModal}
              >
                Cancel
              </button>
              <button
                className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900'
                onClick={handleCreateOrder}
                type='submit'
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default ConfirmModal
