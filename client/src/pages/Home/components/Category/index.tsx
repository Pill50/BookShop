import React, { useEffect } from 'react'
import { BiCategory } from 'react-icons/bi'
import CategoryCart from './CategoryCart'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { CategoryActions } from '~/redux/slices'
import { Category as CategoryType } from '~/types/category'

const Category: React.FC = () => {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.category.categories)

  useEffect(() => {
    dispatch(CategoryActions.getAllCategories(null))
  }, [dispatch])

  return (
    <>
      <div className='container'>
        <div className='py-4'>
          <div className='flex items-center gap-1 mb-2'>
            <div className='bg-green-200 p-2 rounded-lg'>
              <BiCategory size={28} color='green' />
            </div>
            <h3 className='text-xl text-green-500 font-bold'>Product Category</h3>
          </div>
          <div className='flex justify-center items-center gap-4 flex-wrap'>
            {categories.length > 0 &&
              categories.map((category: CategoryType) => <CategoryCart key={category.id} category={category} />)}
          </div>
        </div>
      </div>
    </>
  )
}

export default Category
