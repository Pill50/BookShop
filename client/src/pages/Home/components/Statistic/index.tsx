import React from 'react'

const StatisticPage: React.FC = () => {
  return (
    <div className='mt-6 w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
      <h2 className='font-bold text-yellow-500 text-center text-4xl'>STATISTIC</h2>
      <dl className='grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-3 dark:text-white sm:p-8'>
        <div className='flex flex-col items-center justify-center'>
          <dt className='mb-2 text-3xl font-extrabold'>
            {'{'}
            {'{'}statistics.users{'}'}
            {'}'}
          </dt>
          <dd className='text-gray-500 dark:text-gray-400'>Customers</dd>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <dt className='mb-2 text-3xl font-extrabold'>
            {'{'}
            {'{'}statistics.books{'}'}
            {'}'}+
          </dt>
          <dd className='text-gray-500 dark:text-gray-400'>Books</dd>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <dt className='mb-2 text-3xl font-extrabold'>
            {'{'}
            {'{'}statistics.categories{'}'}
            {'}'}+
          </dt>
          <dd className='text-gray-500 dark:text-gray-400'>Categories</dd>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <dt className='mb-2 text-3xl font-extrabold'>
            {'{'}
            {'{'}statistics.feedbacks{'}'}
            {'}'}+
          </dt>
          <dd className='text-gray-500 dark:text-gray-400'>Feedbacks</dd>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <dt className='mb-2 text-3xl font-extrabold'>
            {'{'}
            {'{'}statistics.shippers{'}'}
            {'}'}+
          </dt>
          <dd className='text-gray-500 dark:text-gray-400'>Shippers</dd>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <dt className='mb-2 text-3xl font-extrabold'>
            {'{'}
            {'{'}statistics.promotions{'}'}
            {'}'}+
          </dt>
          <dd className='text-gray-500 dark:text-gray-400'>Promotions</dd>
        </div>
      </dl>
    </div>
  )
}

export default StatisticPage
