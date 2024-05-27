import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '~/hooks/redux'
import { BookActions } from '~/redux/slices'
import { BookInCart, UpdateBookInCart } from '~/types/book'
import ConfirmModal from './Modal'

const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [cartList, setCartList] = useState<BookInCart[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [bill, setBill] = useState<BookInCart[]>([])

  useEffect(() => {
    const totalPrice = cartList.reduce((acc, cur) => {
      acc += cur.price * cur.amount
      return acc
    }, 0)

    setTotalPrice(totalPrice)
  }, [cartList])

  // useEffect(() => {
  //   const getBookInCart = async () => {
  //     const res = await dispatch(CartActions.getBookInCart(null))
  //     setCartList(res.payload as BookInCart[])
  //   }
  //   getBookInCart()
  // }, [])

  const handleDeleteItem = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation()
    // dispatch(CartActions.deleteBookInCart(id)).then((res) => {
    //   setCartList(res.payload as BookInCart[])
    // })
  }

  const handleUpdateItem = (e: React.MouseEvent<HTMLButtonElement>, bookId: string, amount: number) => {
    e.stopPropagation()
    const data: UpdateBookInCart = {
      bookId,
      amount
    }

    dispatch(BookActions.getBookById(bookId)).then((res) => {
      const stockAmount = res.payload?.data?.amount as number

      if (amount > stockAmount) {
        toast.error(`Bạn chỉ có thể mua tối đa ${stockAmount} sản phẩm`)
      } else {
        // dispatch(CartActions.updateBookInCart(data)).then((res) => {
        //   setCartList(res.payload as BookInCart[])
        // })
      }
    })
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const isChecked = e.target.checked
    if (isChecked) {
      setBill([...cartList])
    } else {
      setBill([])
      const checkboxes = document.querySelectorAll('input[type="checkbox"].item-checkbox')
      checkboxes.forEach((checkbox: any) => {
        checkbox.checked = false
      })
    }
  }

  const handleAddItemToBill = (e: React.MouseEvent<HTMLInputElement, MouseEvent>, item: BookInCart) => {
    e.stopPropagation()
    if (bill.includes(item)) {
      const newBill = bill.filter((cartItem) => cartItem.bookId !== item.bookId)
      setBill(newBill)
    } else {
      setBill([...bill, item])
    }
  }

  return (
    <>
      <Toaster />
      <div className='max-w-screen-xl px-4 mx-auto min-h-screen'>
        <h1 className='text-center font-bold text-green-600 text-4xl'>MY CART</h1>
        {cartList.length === 0 ? (
          <h1>No Items In Cart</h1>
        ) : (
          <div className='overflow-x-auto'>
            <table className='table table-zebra shadow-md'>
              <thead>
                <tr>
                  <th>
                    <label>
                      <input
                        type='checkbox'
                        className='checkbox'
                        onChange={handleSelectAll}
                        checked={bill.length === cartList.length && cartList.length !== 0}
                      />
                    </label>
                  </th>
                  <th className='font-bold text-lg text-blue-600'>Product</th>
                  <th className='font-bold text-lg text-blue-600'>Unit Price</th>
                  <th className='font-bold text-lg text-blue-600'>Amount</th>
                  <th className='font-bold text-lg text-blue-600'>Total Price</th>
                  <th className='font-bold text-lg text-blue-600'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartList.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => navigate('/product/1')}
                    className='hover:cursor-pointer hover:bg-blue-50 transition-all'
                  >
                    <th>
                      <label>
                        <input
                          type='checkbox'
                          className='checkbox'
                          checked={bill.includes(item)}
                          onChange={() => console.log(item)}
                          onClick={(e) => handleAddItemToBill(e, item)}
                        />
                      </label>
                    </th>
                    <td>
                      <div className='flex items-center gap-3'>
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
                    <td>
                      <span className=''>{item.price}</span>
                    </td>
                    <td>
                      <div className='join'>
                        <button
                          className='join-item btn'
                          onClick={(e) => handleUpdateItem(e, item.bookId, item.amount - 1)}
                        >
                          -
                        </button>
                        <button className='join-item btn'>{item.amount}</button>
                        <button
                          className='join-item btn'
                          onClick={(e) => handleUpdateItem(e, item.bookId, item.amount + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <p className=''>{item.price * item.amount}</p>
                    </td>
                    <td>
                      <button className='btn btn-neutral z-10' onClick={(e) => handleDeleteItem(e, item.bookId)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex justify-end my-4 gap-2 items-center'>
              <h2 className='text-lg'>
                Total price: <span className='font-semibold text-red-500'>{totalPrice} VNĐ</span>
              </h2>
              <ConfirmModal orderItems={bill} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CartPage
