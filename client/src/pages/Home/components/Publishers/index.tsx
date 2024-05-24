import React from 'react'

const Publishers: React.FC = () => {
    return (
        <div className='my-10 bg-white shadow-lg'>
            <ul className='flex justify-around items-center'>
                <li>
                    <img
                        src='https://cdn0.fahasa.com/media/wysiwyg/Hien_UI/LogoNCC/9_NCC_MinhLong_115x115.png'
                        alt='Minh Long Book'
                    />
                </li>
                <li>
                    <img
                        src='https://cdn0.fahasa.com/media/wysiwyg/Hien_UI/LogoNCC/1_NCC_KimDong_115x115.png'
                        alt='Kim Đồng'
                    />
                </li>
                <li>
                    <img
                        src='https://cdn0.fahasa.com/media/wysiwyg/Hien_UI/LogoNCC/2_NCC_DinhTi_115x115.png'
                        alt='Đinh Tị'
                    />
                </li>
                <li>
                    <img
                        src='	https://cdn0.fahasa.com/media/wysiwyg/Hien_UI/LogoNCC/5_NCC_McBook_115x115.png'
                        alt='MC Book'
                    />
                </li>
                <li>
                    <img
                        src='https://cdn0.fahasa.com/media/wysiwyg/Hien_UI/LogoNCC/NCC_AlphaBooks_115x115.png'
                        alt='Alpha Book'
                    />
                </li>
            </ul>
        </div>
    )
}

export default Publishers
