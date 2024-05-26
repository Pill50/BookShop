import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Category } from '~/types/category'

interface ICategoryCart {
  category: Category
}

const CategoryCart: React.FC<ICategoryCart> = ({ category }: ICategoryCart) => {
  const navigate = useNavigate()
  return (
    <div
      className='w-44 p-2 border-2 rounded-lg hover:bg-green-100 hover:border-green-400 hover:cursor-pointer hover:scale-105 transition-all'
      onClick={() => navigate(`/book?categories=${category.id}`)}
    >
      <div className='flex items-center justify-center flex-col'>
        <img src={category.thumbnail} alt={category.title} className='h-20 w-20 object-cover rounded-md' />
        <div className='mt-2 text-center font-medium'>{category.title}</div>
      </div>
    </div>
  )
}

export default CategoryCart
