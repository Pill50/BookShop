import React from 'react'

const LoadingSVG = () => (
  <svg width='300' height='160' viewBox='0 0 160 80' xmlns='http://www.w3.org/2000/svg'>
    <g transform='matrix(1 0 0 -1 0 80)'>
      <rect className='rect1' width='40' height='60' rx='3' fill='#4285F4'>
        <animate
          attributeName='height'
          begin='0s'
          dur='4.3s'
          values='20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20'
          calcMode='linear'
          repeatCount='indefinite'
        ></animate>
      </rect>
      <rect className='rect2' x='40' width='40' height='80' rx='3' fill='#0F9D58'>
        <animate
          attributeName='height'
          begin='0s'
          dur='2s'
          values='80;55;33;5;75;23;73;33;12;14;60;80'
          calcMode='linear'
          repeatCount='indefinite'
        ></animate>
      </rect>
      <rect className='rect3' x='80' width='40' height='50' rx='3' fill='#F4B400'>
        <animate
          attributeName='height'
          begin='0s'
          dur='1.4s'
          values='50;34;78;23;56;23;34;76;80;54;21;50'
          calcMode='linear'
          repeatCount='indefinite'
        ></animate>
      </rect>
      <rect className='rect4' x='120' width='40' height='30' rx='3' fill='#DB4437'>
        <animate
          attributeName='height'
          begin='0s'
          dur='2s'
          values='30;45;13;80;56;72;45;76;34;23;67;30'
          calcMode='linear'
          repeatCount='indefinite'
        ></animate>
      </rect>
    </g>
  </svg>
)

const Loading: React.FC = () => (
  <div className='absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center h-screen bg-gray-300'>
    <LoadingSVG />
  </div>
)

export default Loading
