import React from 'react'
import Category from './components/Category'
import Banner from './components/Banner'
import Publishers from './components/Publishers'
import TrendingProduct from './components/Trending'
import NewProduct from './components/NewProduct'
import StatisticPage from './components/Statistic'

const HomePage: React.FC = () => {
  return (
    <>
      <div className='max-w-screen-xl px-4 mx-auto'>
        <Banner />
        <Category />
        <TrendingProduct />
        <StatisticPage />
        <NewProduct />
      </div>
      <Publishers />
    </>
  )
}

export default HomePage
