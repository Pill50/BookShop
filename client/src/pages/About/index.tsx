import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '~/hooks/redux'
import { AboutActions } from '~/redux/slices'

const AboutPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [content, setContent] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(AboutActions.getAboutPageContent(null))
      if (response.payload?.data) {
        setContent(response.payload.data)
      } else {
        setContent('Failed to load content')
      }
    }

    fetchData()
  }, [dispatch])

  return (
    <>
      <div className='max-w-screen-xl px-4 mx-auto min-h-screen relative'>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='font-bold text-4xl text-blue-500 text-center my-2'>ABOUT US</h1>
          <div dangerouslySetInnerHTML={{ __html: content ?? 'Loading...' }} />
        </div>
      </div>
    </>
  )
}

export default AboutPage
