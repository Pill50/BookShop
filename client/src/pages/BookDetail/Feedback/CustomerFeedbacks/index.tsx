import React from 'react'

interface IFeedbackContent {
    userName: string
    userAvatar: string
    date: string
    content: string
}

const CustomerFeedBacks: React.FC<IFeedbackContent> = ({ userName, userAvatar, date, content }) => {
    return (
        <div className='flex gap-2 my-2'>
            <div className=''>
                <figure>
                    <img src={userAvatar} alt={userName} className='w-12 h-12 object-cover rounded-full' />
                </figure>
            </div>
            <div className='flex flex-col gap-1'>
                <p className='font-bold'>{userName}</p>
                <p className='italic text-sm'>{date}</p>
                <p>{content}</p>
            </div>
        </div>
    )
}

export default CustomerFeedBacks
