import React, { useEffect, useState } from 'react'
import Tab from '~/components/Tab'
import { FaHistory } from 'react-icons/fa'
import OrdersDetail from './OrdersDetail'
import FilterOrders from './Filters'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { OrderActions } from '~/redux/slices'
import { GetUserOrder, UpdateStatusOrder } from '~/types/order'
import toast, { Toaster } from 'react-hot-toast'
import Pagination from '~/components/Pagination'
import NoResult from '~/assets/images/noResult.png'

const HistoryOrdersPage: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const statusParam = urlParams.get('status') as string
  const pageParam = urlParams.get('page') as string
  const dispatch = useAppDispatch()
  const userOrders = useAppSelector((state) => state.order.userOrders)
  const totalPage = useAppSelector((state) => state.order.totalPage)
  const totalRecord = useAppSelector((state) => state.order.totalRecord)
  const [status, setStatus] = useState<string>('')

  const fetchOrderData = () => {
    const data: GetUserOrder = {
      pageIndex: Number(pageParam) || 1,
      status: statusParam !== null ? statusParam : undefined
    }
    dispatch(OrderActions.getUserOrders(data))
  }

  useEffect(() => {
    fetchOrderData()
  }, [])

  const handleUpdateStatusOrder = async (orderId: string) => {
    const data: UpdateStatusOrder = {
      orderId: orderId,
      status: 'COMPLETED'
    }
    const response = await dispatch(OrderActions.updateStatusOrder(data))
    if (response.payload?.statusCode === 200) {
      toast.success(response.payload.message)
      fetchOrderData()
    } else {
      toast.error(response.payload?.message as string)
    }
  }

  const handlePageIndexChange = async (page: number) => {
    const data: GetUserOrder = {
      pageIndex: page,
      status: status
    }
    await dispatch(OrderActions.getUserOrders(data))
  }

  const handleFilterStatusChange = async (status: string) => {
    const data: GetUserOrder = {
      pageIndex: 1,
      status: status
    }
    setStatus(status)
    await dispatch(OrderActions.getUserOrders(data))
  }

  return (
    <>
      <Toaster />
      <div className='max-w-screen-xl p-4 mx-auto min-h-screen relative'>
        <Tab />
        <div className='container px-12 my-4'>
          <div className='flex flex-col lg:grid lg:grid-cols-3 gap-4'>
            <FilterOrders onStatusChange={handleFilterStatusChange} />
            <div className='col-span-2'>
              <div className='flex items-center gap-1 mb-2'>
                <div className='bg-yellow-500 rounded-md p-3'>
                  <FaHistory size={24} color='white' />
                </div>
                <h2 className='font-bold text-xl'>Purchase History</h2>
              </div>
              {userOrders.length == 0 || totalRecord === 0 ? (
                <div className='text-center mx-auto flex justify-center flex-col items-center'>
                  <img src={NoResult} alt='No Result' />
                  <h2 className='font-bold text-red-600 text-2xl'>OOP!! You don't have any order!</h2>
                </div>
              ) : (
                userOrders.map((order) => {
                  return (
                    <OrdersDetail ordersInfo={order} key={order.id} handleUpdateStatusOrder={handleUpdateStatusOrder} />
                  )
                })
              )}
            </div>
          </div>
          {totalPage > 1 && (
            <div className='join flex justify-end'>
              <Pagination totalPage={totalPage} handleChangePage={handlePageIndexChange} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default HistoryOrdersPage
