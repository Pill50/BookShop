import React, { useEffect, useState } from 'react'

interface IPagination {
  totalPage: number
  handleChangePage(page: number): void
}
const Pagination: React.FC<IPagination> = ({ totalPage, handleChangePage }) => {
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    handleChangePage(page)
  }, [page])

  return (
    <div className='flex justify-center'>
      <button
        className='w-20 text-md rounded-tl-md rounded-bl-md bg-gray-300 px-3 py-1 flex items-center justify-center hover:bg-gray-400'
        onClick={() => {
          if (page === 1) setPage(1)
          else setPage(page - 1)
        }}
      >
        Previous
      </button>
      <button className='px-3 py-1 flex items-center justify-center border-t-[1px] border-b-[1px] border-gray-300'>
        {page}
      </button>
      <button
        className='w-20 text-md rounded-tr-md rounded-br-md bg-gray-300 px-3 py-1 flex items-center justify-center hover:bg-gray-400'
        onClick={() => {
          if (page === totalPage) setPage(totalPage)
          else setPage(page + 1)
        }}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
