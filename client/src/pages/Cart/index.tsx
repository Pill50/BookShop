import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '~/hooks/redux'
import { BookActions, CartActions } from '~/redux/slices'
import { BookInCart, UpdateBookInCart } from '~/types/book'
import ConfirmModal from './Modal'
import DeleteModal from './DeleteModal'
import NoResult from '~/assets/images/noResult.png'

const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [cartList, setCartList] = useState<BookInCart[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [bill, setBill] = useState<Set<string>>(new Set())

  useEffect(() => {
    const totalPrice = cartList.reduce((acc, cur) => {
      acc += (cur.price * cur.amount * (100 - cur.discount)) / 100
      return acc
    }, 0)

    setTotalPrice(totalPrice)
  }, [cartList])

  useEffect(() => {
    const getBookInCart = async () => {
      const res = await dispatch(CartActions.getBookInCart(null))
      setCartList(res.payload as BookInCart[])
    }
    getBookInCart()
  }, [dispatch])

  const handleDeleteItem = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation()
    dispatch(CartActions.deleteBookInCart(id)).then((res) => {
      setCartList(res.payload as BookInCart[])
      setBill((prevBill) => {
        const newBill = new Set(prevBill)
        newBill.delete(id)
        return newBill
      })
    })
  }

  const handleUpdateItem = (e: React.MouseEvent<HTMLButtonElement>, bookId: string, amount: number) => {
    e.preventDefault()
    e.stopPropagation()
    const data: UpdateBookInCart = {
      bookId,
      amount
    }

    dispatch(BookActions.getBookById(bookId)).then((res) => {
      const stockAmount = res.payload?.data?.amount as number

      if (amount > stockAmount) {
        toast.error(`You can buy maximum ${stockAmount} books`)
      } else {
        dispatch(CartActions.updateBookInCart(data)).then((res) => {
          setCartList(res.payload as BookInCart[])
        })
      }
    })
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const isChecked = e.target.checked
    if (isChecked) {
      setBill(new Set(cartList.map((item) => item.bookId)))
    } else {
      setBill(new Set())
    }
  }

  const handleAddItemToBill = (e: React.ChangeEvent<HTMLInputElement>, bookId: string) => {
    e.stopPropagation()
    setBill((prevBill) => {
      const newBill = new Set(prevBill)
      if (newBill.has(bookId)) {
        newBill.delete(bookId)
      } else {
        newBill.add(bookId)
      }
      return newBill
    })
  }

  return (
    <>
      <Toaster />
      <div className='max-w-screen-xl px-4 mx-auto min-h-screen relative'>
        <h1 className='text-center font-bold text-green-600 text-4xl my-3'>MY CART</h1>
        {cartList.length === 0 ? (
          <div className='absolute left-1/2 translate-x-[-50%] text-center'>
            <img src={NoResult} alt='No Result' />
            <h2 className='font-bold text-red-600 text-2xl'>No items in cart!</h2>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='p-4'>
                    <div className='flex items-center'>
                      <input
                        id='checkbox-all-search'
                        type='checkbox'
                        onChange={handleSelectAll}
                        checked={bill.size === cartList.length && cartList.length !== 0}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      />
                      <label htmlFor='checkbox-all-search' className='sr-only'>
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope='col' className='px-6 py-3 font-bold text-lg text-blue-600'>
                    Product
                  </th>
                  <th scope='col' className='px-6 py-3 font-bold text-lg text-blue-600'>
                    Unit Price
                  </th>
                  <th scope='col' className='px-6 py-3 font-bold text-lg text-blue-600'>
                    Discount
                  </th>
                  <th scope='col' className='px-6 py-3 font-bold text-lg text-blue-600'>
                    Amount
                  </th>
                  <th scope='col' className='px-6 py-3 font-bold text-lg text-blue-600'>
                    Total Price
                  </th>
                  <th scope='col' className='px-6 py-3 font-bold text-lg text-blue-600'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartList.map((item, index) => (
                  <tr key={index} className='hover:bg-blue-50 transition-all bg-white border-b'>
                    <td className='w-4 p-4'>
                      <div className='flex items-center'>
                        <input
                          type='checkbox'
                          checked={bill.has(item.bookId)}
                          onChange={(e) => handleAddItemToBill(e, item.bookId)}
                          className='item-checkbox w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div
                        className='flex items-center gap-3 hover:cursor-pointer'
                        onClick={() => navigate(`/product/${item.bookId}`)}
                      >
                        <div className='avatar'>
                          <div className='mask mask-squircle w-12 h-12'>
                            <img src={item.thumbnail} alt={item.title} />
                          </div>
                        </div>
                        <div>
                          <div className='font-bold'>{item.title}</div>
                          <div className='text-sm opacity-50'>{item.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className=''>{item.price.toFixed(2)} VNĐ</span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className=''>{item.discount}%</span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex'>
                        <button
                          className='w-10 text-md rounded-tl-md rounded-bl-md bg-gray-300 px-3 py-1 flex items-center justify-center hover:bg-gray-400'
                          onClick={(e) => handleUpdateItem(e, item.bookId, item.amount - 1)}
                        >
                          -
                        </button>
                        <button className='w-10 px-3 py-1 flex items-center justify-center border-t-[1px] border-b-[1px] border-gray-300'>
                          {item.amount}
                        </button>
                        <button
                          className='w-10 text-md rounded-tr-md rounded-br-md bg-gray-300 px-3 py-1 flex items-center justify-center hover:bg-gray-400 z-10'
                          onClick={(e) => handleUpdateItem(e, item.bookId, item.amount + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <p className='font-semibold'>
                        {((item.price * item.amount * (100 - item.discount)) / 100).toFixed(2)} VNĐ
                      </p>
                    </td>
                    <td className='px-6 py-4'>
                      <DeleteModal id={item.bookId} handleDeleteItem={handleDeleteItem} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex justify-end my-4 gap-2 items-end flex-col'>
              <h2 className='text-lg font-semibold'>
                Total price: <span className='font-semibold text-red-500 text-2xl'>{totalPrice.toFixed(2)} VNĐ</span>
              </h2>
              {bill.size > 0 && (
                <ConfirmModal
                  orderItems={Array.from(bill).map((bookId) => cartList.find((item) => item.bookId === bookId)!)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CartPage
