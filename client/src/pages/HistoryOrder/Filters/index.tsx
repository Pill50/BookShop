import React, { useEffect, useState } from 'react'
import { FaFilter } from 'react-icons/fa'

interface IFilterOrder {
  onStatusChange: (status: string) => void
}

const FilterOrders: React.FC<IFilterOrder> = ({ onStatusChange }) => {
  const [filterBy, setFilterBy] = useState<string>('')

  useEffect(() => {
    onStatusChange(filterBy)
  }, [filterBy])

  return (
    <div className=''>
      <div className='flex items-center gap-1 mb-2'>
        <div className='bg-red-600 rounded-md p-3'>
          <FaFilter size={24} color='white' />
        </div>
        <h2 className='font-bold text-xl'>Filter by</h2>
      </div>
      <div className=''>
        <div
          className={`px-4 py-2 ${filterBy == '' ? 'border-l-red-600 bg-red-100 text-red-600' : 'bg-white'} shadow-md cursor-pointer rounded-md mb-4 font-medium border-l-4 hover:bg-red-100 `}
          onClick={() => setFilterBy('')}
        >
          All
        </div>
        <div
          className={`px-4 py-2 ${filterBy == 'PENDING' ? 'border-l-red-600 bg-red-100 text-red-600' : 'bg-white'} shadow-md cursor-pointer rounded-md mb-4 font-medium border-l-4 hover:bg-red-100 `}
          onClick={() => setFilterBy('PENDING')}
        >
          Pending
        </div>
        <div
          className={`px-4 py-2 ${filterBy == 'SHIPPED' ? 'border-l-red-600 bg-red-100 text-red-600' : 'bg-white'} shadow-md cursor-pointer rounded-md mb-4 font-medium border-l-4 hover:bg-red-100 `}
          onClick={() => setFilterBy('SHIPPED')}
        >
          Shipped
        </div>
        <div
          className={`px-4 py-2 ${filterBy == 'COMPLETED' ? 'border-l-red-600 bg-red-100 text-red-600' : 'bg-white'} shadow-md cursor-pointer rounded-md mb-4 font-medium border-l-4 hover:bg-red-100 `}
          onClick={() => setFilterBy('COMPLETED')}
        >
          Completed
        </div>
        <div
          className={`px-4 py-2 ${filterBy == 'CANCELED' ? 'border-l-red-600 bg-red-100 text-red-600' : 'bg-white'} shadow-md cursor-pointer rounded-md mb-4 font-medium border-l-4 hover:bg-red-100 `}
          onClick={() => setFilterBy('CANCELED')}
        >
          Cancel
        </div>
      </div>
    </div>
  )
}

export default FilterOrders
