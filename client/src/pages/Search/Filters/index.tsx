import React, { useEffect, useState } from 'react'
import { BiSolidCategory } from 'react-icons/bi'
import { FaFilter } from 'react-icons/fa'
import { FaAddressBook } from 'react-icons/fa6'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { CategoryActions, PublisherActions } from '~/redux/slices'
import { Category } from '~/types/category'
import { Publisher } from '~/types/publisher'

interface IFilterBook {
  initCategory: string
  initPublisher: string
  onFilterChange: (categoryId: string[], publisherId: string[]) => void
}

const FilterProducts: React.FC<IFilterBook> = ({ onFilterChange, initCategory, initPublisher }) => {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.category.categories)
  const publishers = useAppSelector((state) => state.publisher.publishers)
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [publisherFilter, setPublisherFilter] = useState<string[]>([])

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
    onFilterChange(categoryFilter, publisherFilter)
  }, [categoryFilter, publisherFilter])

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
    <div className='border-r-2 w-64'>
      <div className='flex items-center gap-1 mb-2'>
        <div className='bg-red-600 rounded-md p-3'>
          <FaFilter size={24} color='white' />
        </div>
        <h2 className='font-bold text-xl'>Filter by</h2>
      </div>
      <div className=''>
        <div className=''>
          <div className='flex gap-1'>
            <BiSolidCategory size={24} className='text-yellow-600' />
            <h2 className='font-bold text-lg text-yellow-600'>Theo category</h2>
          </div>
          <ul>
            {categories?.length > 0 &&
              categories.map((category: Category) => (
                <li className='form-control' key={category.id}>
                  <label className='cursor-pointer label justify-start gap-2'>
                    <input
                      type='checkbox'
                      value={category.id}
                      checked={initCategory?.includes(category.id) || categoryFilter?.includes(category.id)}
                      className='checkbox checkbox-info'
                      onChange={handleCategoryChange}
                    />
                    <span className='label-text'>{category.title}</span>
                  </label>
                </li>
              ))}
          </ul>
        </div>
        <div className=''>
          <div className='flex gap-1'>
            <FaAddressBook size={24} className='text-yellow-600' />
            <h2 className='font-bold text-lg text-yellow-600'>Theo nhà xuất bản</h2>
          </div>
          <ul>
            {publishers?.length > 0 &&
              publishers.map((publisher: Publisher) => (
                <li className='form-control' key={publisher.id}>
                  <label className='cursor-pointer label justify-start gap-2'>
                    <input
                      type='checkbox'
                      value={publisher.id}
                      checked={initPublisher?.includes(publisher.id) || publisherFilter?.includes(publisher.id)}
                      className='checkbox checkbox-info'
                      onChange={handlePublisherChange}
                    />
                    <span className='label-text'>{publisher.name}</span>
                  </label>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <button className='btn btn-primary w-[50%]' onClick={handleClearFilter}>
        Xóa tất cả
      </button>
    </div>
  )
}

export default FilterProducts
