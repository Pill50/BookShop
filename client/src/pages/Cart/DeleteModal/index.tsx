import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { IoWarningOutline } from 'react-icons/io5'

interface IDeleteModal {
  id: string
  handleDeleteItem(e: any, id: string): void
}

const DeleteModal: React.FC<IDeleteModal> = ({ id, handleDeleteItem }) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Toaster />
      <button
        className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 z-10'
        onClick={() => setOpen(true)}
      >
        Delete
      </button>
      {open && (
        <div className='fixed z-[1500] right-0 left-0 top-0 bottom-0 bg-black/50 flex justify-center items-center transition-all'>
          <div className='bg-white p-10 rounded-lg flex items-center flex-col gap-3'>
            <IoWarningOutline size={60} className='text-yellow-400' />
            <h2 className='text-lg'>Are you sure you want to delete this item?</h2>
            <div className='flex gap-2'>
              <button
                type='button'
                className='text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center'
                onClick={(e) => {
                  setOpen(false)
                  handleDeleteItem(e, id)
                }}
              >
                Yes, I'm sure
              </button>
              <button
                type='button'
                className='text-white bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center'
                onClick={() => setOpen(false)}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DeleteModal
