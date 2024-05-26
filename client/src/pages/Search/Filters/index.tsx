import React, { useEffect, useState } from 'react'
import { BiSolidCategory } from 'react-icons/bi'
import { FaFilter } from 'react-icons/fa'
import { FaUserEdit } from 'react-icons/fa'
import { FaStar } from 'react-icons/fa'
import { FaRegStar } from 'react-icons/fa'
import { MdHowToVote } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { CategoryActions, PublisherActions } from '~/redux/slices'
import { Category } from '~/types/category'
import { Publisher } from '~/types/publisher'

interface IFilterBook {
  initCategory: string
  initPublisher: string
  onFilterChange: (categoryId: string[], publisherId: string[], rating?: number) => void
}

const FilterProducts: React.FC<IFilterBook> = ({ onFilterChange, initCategory, initPublisher }) => {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.category.categories)
  const publishers = useAppSelector((state) => state.publisher.publishers)
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [publisherFilter, setPublisherFilter] = useState<string[]>([])
  const [rating, setRating] = useState<number>()

  useEffect(() => {
    dispatch(CategoryActions.getAllCategories(null))
    dispatch(PublisherActions.getAllPublishers(null))
  }, [dispatch])

  useEffect(() => {
    if (initCategory !== null) {
      if (initCategory.includes(',')) setCategoryFilter(initCategory.split(','))
      else if (initCategory != '') {
        setCategoryFilter([initCategory])
      }
    }
    if (initPublisher !== null) {
      if (initPublisher.includes(',')) setPublisherFilter(initPublisher.split(','))
      else if (initPublisher != '') {
        setPublisherFilter([initPublisher])
      }
    }
  }, [])

  useEffect(() => {
    onFilterChange(categoryFilter, publisherFilter, rating)
  }, [categoryFilter, publisherFilter, rating])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value
    setCategoryFilter((prevCategoryFilter) => {
      if (prevCategoryFilter.includes(id)) {
        return prevCategoryFilter.filter((categoryId) => categoryId !== id)
      } else {
        return [...prevCategoryFilter, id]
      }
    })
  }

  const handlePublisherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value
    setPublisherFilter((prevPublisherFilter) => {
      if (prevPublisherFilter.includes(id)) {
        return prevPublisherFilter.filter((publisherId) => publisherId !== id)
      } else {
        return [...prevPublisherFilter, id]
      }
    })
  }

  const handleClearFilter = () => {
    setCategoryFilter([])
    setPublisherFilter([])
  }

  return (
    <div className='w-64 bg-green-100 rounded-lg p-3'>
      <div className='flex items-center gap-1 mb-2'>
        <div className='bg-red-600 rounded-md p-3'>
          <FaFilter size={24} color='white' />
        </div>
        <h2 className='font-bold text-xl'>Filter by</h2>
      </div>
      <div className='flex flex-col gap-3 my-3'>
        <div className=''>
          <div className='flex gap-1 bg-green-200 rounded-md p-2 items-center border-r-4 border-green-600'>
            <BiSolidCategory size={24} className='text-green-600' />
            <h2 className='font-bold text-lg text-green-600'>Category</h2>
          </div>
          <ul>
            {categories?.length > 0 &&
              categories.map((category: Category) => (
                <li key={category.id}>
                  <label className='justify-start items-center flex'>
                    <input
                      type='checkbox'
                      value={category.id}
                      checked={initCategory?.includes(category.id) || categoryFilter?.includes(category.id)}
                      className='mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-blue-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      onChange={handleCategoryChange}
                    />
                    <span className='label-text'>{category.title}</span>
                  </label>
                </li>
              ))}
          </ul>
        </div>
        <div className=''>
          <div className='flex gap-1 bg-green-200 rounded-md p-2 items-center border-r-4 border-green-600'>
            <FaUserEdit size={24} className='text-green-600' />
            <h2 className='font-bold text-lg text-green-600'>Publishers</h2>
          </div>
          <ul>
            {publishers?.length > 0 &&
              publishers.map((publisher: Publisher) => (
                <li key={publisher.id}>
                  <label className='justify-start items-center flex'>
                    <input
                      type='checkbox'
                      value={publisher.id}
                      checked={initPublisher?.includes(publisher.id) || publisherFilter?.includes(publisher.id)}
                      className='mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-blue-500 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      onChange={handlePublisherChange}
                    />
                    <span className='label-text'>{publisher.name}</span>
                  </label>
                </li>
              ))}
          </ul>
        </div>
        <div className=''>
          <div className='flex gap-1 bg-green-200 rounded-md p-2 items-center border-r-4 border-green-600'>
            <MdHowToVote size={24} className='text-green-600' />
            <h2 className='font-bold text-lg text-green-600'>Rating</h2>
          </div>
          <ul className='mt-2'>
            <li className='flex mb-2'>
              <input
                type='radio'
                name='rating'
                onChange={() => setRating(5)}
                className='mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              />
              <FaStar className='text-yellow-300' />
              <FaStar className='text-yellow-300' />
              <FaStar className='text-yellow-300' />
              <FaStar className='text-yellow-300' />
              <FaStar className='text-yellow-300' />
            </li>
            <li className='flex mb-2'>
              <input
                type='radio'
                name='rating'
                onChange={() => setRating(4)}
                className='mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              />
              <FaStar className='text-yellow-300' />
              <FaStar className='text-yellow-300' />
              <FaStar className='text-yellow-300' />
              <FaStar className='text-yellow-300' />
              <FaRegStar className='text-yellow-300' />
            </li>
            <li className='flex mb-2'>
              <input
                type='radio'
                name='rating'
                onChange={() => setRating(3)}
                className='mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              />
              <FaStar className='text-yellow-300' />
              <FaStar className='text-yellow-300' />
              <FaStar className='text-yellow-300' />
              <FaRegStar className='text-yellow-300' />
              <FaRegStar className='text-yellow-300' />
            </li>
            <li className='flex mb-2'>
              <input
                type='radio'
                name='rating'
                onChange={() => setRating(2)}
                className='mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              />
              <FaStar className='text-yellow-300' />
              <FaStar className='text-yellow-300' />
              <FaRegStar className='text-yellow-300' />
              <FaRegStar className='text-yellow-300' />
              <FaRegStar className='text-yellow-300' />
            </li>
            <li className='flex mb-2'>
              <input
                type='radio'
                name='rating'
                onChange={() => setRating(1)}
                className='mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              />
              <FaStar className='text-yellow-300' />
              <FaRegStar className='text-yellow-300' />
              <FaRegStar className='text-yellow-300' />
              <FaRegStar className='text-yellow-300' />
              <FaRegStar className='text-yellow-300' />
            </li>
          </ul>
        </div>
      </div>
      <button
        className='w-1/2 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
        onClick={handleClearFilter}
      >
        Clear All
      </button>
    </div>
  )
}

export default FilterProducts
