import React, { useState } from 'react'
import { MdCropSquare, MdInbox, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { FaCaretDown, FaUserFriends } from "react-icons/fa"
import { IoMdMore, IoMdRefresh } from 'react-icons/io'
import { GoTag } from "react-icons/go";
import Emails from './Emails';

const mailType = [
    {
        icon: <MdInbox size={'20px'} />,
        text: "Primary"
    },
    {
        icon: <GoTag size={'20px'} />,
        text: "Promotions"
    },
    {
        icon: <FaUserFriends size={'20px'} />,
        text: "Social"
    },
]

const Inbox = () => {
    const [selected, setSelected] = useState(0);
    return (
        <div className='bg-white rounded-xl mx-1 sm:mx-3 sm:mx-5'>
            <div className='flex items-center justify-between px-2 sm:px-4 my-2'>
                <div className='flex items-center gap-1 sm:gap-2'>
                    <div className='flex items-center gap-1'>
                        <MdCropSquare size={'18px'} />
                        <FaCaretDown size={'16px'} />
                    </div>
                    <div className='p-1.5 sm:p-2 rounded-full hover:bg-gray-200 cursor-pointer'>
                        <IoMdRefresh size={'18px'} />
                    </div>
                    <div className='p-1.5 sm:p-2 rounded-full hover:bg-gray-200 cursor-pointer'>
                        <IoMdMore size={'18px'} />
                    </div>
                </div>
                <div className='flex items-center gap-1 sm:gap-2 text-sm text-gray-600'>
                    <span className='hidden sm:inline'>1 to 50</span>
                    <MdKeyboardArrowLeft size="22px" />
                    <MdKeyboardArrowRight size="22px" />
                </div>
            </div>
            <div className='overflow-y-auto'>
                <div className='flex items-center border-b border-gray-100 overflow-x-auto'>
                    {
                        mailType.map((item, index) => {
                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelected(index)}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-5 p-3 sm:p-4 sm:w-44 hover:bg-gray-100 text-sm whitespace-nowrap ${selected === index ? "border-b-4 border-b-blue-600 text-blue-600" : "border-b-4 border-b-transparent text-gray-600"}`}
                                >
                                    {item.icon}
                                    <span>{item.text}</span>
                                </button>
                            )
                        })
                    }
                </div>
                <Emails/>
            </div>
        </div>
    )
}

export default Inbox