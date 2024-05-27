import React, { useEffect, useState } from 'react'
import Tab from '~/components/Tab'
import { FaHistory } from 'react-icons/fa'
// import OrdersDetail from './OrdersDetail'
import FilterOrders from './Filters'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { OrderActions } from '~/redux/slices'
import { GetUserOrder, UserOrder } from '~/types/order'
import { Toaster } from 'react-hot-toast'

const HistoryOrdersPage: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const statusParam = urlParams.get('status') as string
  const pageParam = urlParams.get('page') as string
  const dispatch = useAppDispatch()
  const userOrders = useAppSelector((state) => state.order.userOrders)
  const totalPage = useAppSelector((state) => state.order.totalPage)
  const totalRecord = useAppSelector((state) => state.order.totalRecord)
  const [pageIndex, setPageIndex] = useState<number>(1)

  const handlePageIndexChange = (type: string) => {
    switch (type) {
      case 'increase': {
        if (pageIndex == totalPage) setPageIndex(1)
        else setPageIndex(pageIndex + 1)
        break
      }
      case 'decrease': {
        if (pageIndex == 1) setPageIndex(totalPage)
        else setPageIndex(pageIndex - 1)
        break
      }
      default:
        break
    }
  }

  const handleStatusChange = (status: string) => {}

  return (
    <>
      <Toaster />
      <div className='max-w-screen-xl p-4 mx-auto min-h-screen relative'>
        <Tab />
        <div className='container px-12 my-4'>
          <div className='flex flex-col lg:grid lg:grid-cols-3 gap-4'>
            <FilterOrders onStatusChange={handleStatusChange} />
            <div className='col-span-2'>
              <div className='flex items-center gap-1 mb-2'>
                <div className='bg-yellow-500 rounded-md p-3'>
                  <FaHistory size={24} color='white' />
                </div>
                <h2 className='font-bold text-xl'>Purchase History</h2>
              </div>
              {userOrders.length == 0 || totalRecord === 0 ? (
                <h2>You don't have any orders!</h2>
              ) : (
                <></>
                // userOrders?.map((order: UserOrder, index) => <OrdersDetail ordersInfo={order} key={index} />)
              )}
            </div>
          </div>
          <div className='join flex justify-end'>
            <button className='join-item btn bg-blue-200' onClick={() => handlePageIndexChange('decrease')}>
              «
            </button>
            <button className='join-item btn '>Page {pageIndex}</button>
            <button className='join-item btn bg-blue-200' onClick={() => handlePageIndexChange('increase')}>
              »
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default HistoryOrdersPage
