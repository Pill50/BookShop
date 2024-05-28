import React, { useState, useEffect } from 'react'

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    'https://cdn0.fahasa.com/media/magentothem/banner7/TanViet_Silver_0424_Ver1_Slide_840x320_1.jpg',
    'https://cdn0.fahasa.com/media/magentothem/banner7/TrangTapVoT424_840x320.jpg',
    'https://cdn0.fahasa.com/media/magentothem/banner7/HSO_DoChoiT324-slide_-smallbanner_Slide_840x320.jpg',
    'https://cdn0.fahasa.com/media/magentothem/banner7/Tuan1_mainbanner_Slidebanner_840x320.jpg'
  ]
  const slideCount = slides.length

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slideCount)
    }, 2000)

    return () => clearInterval(interval)
  }, [slideCount])

  const nextSlide = (index: number) => {
    if (index == slideCount) setCurrentSlide(0)
    else setCurrentSlide(index + 1)
  }

  const previousSlide = (index: number) => {
    if (index < 0) setCurrentSlide(slideCount - 1)
    else setCurrentSlide(index - 1)
  }

  return (
    <div className=' w-full h-full'>
      {slides.map((slide, index) => (
        <div key={index} className={`relative w-full h-full ${index === currentSlide ? 'block' : 'hidden'}`}>
          <img src={slide} className='w-full h-full rounded-md object-cover' alt={`Slide ${index + 1}`} />
          <div className='absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2'>
            <button
              className='btn btn-circle bg-blue-100 px-4 py-2 rounded-full hover:bg-blue-400'
              onClick={() => previousSlide(index - 1)}
            >
              ❮
            </button>
            <button
              className='btn btn-circle bg-blue-100 px-4 py-2 rounded-full hover:bg-blue-400'
              onClick={() => nextSlide(index + 1)}
            >
              ❯
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Carousel
