import React from 'react'
import { IoMdArrowBack, IoMdMore } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'
import { BiArchiveIn } from "react-icons/bi";
import { MdDeleteOutline, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineAddTask, MdOutlineDriveFileMove, MdOutlineMarkEmailUnread, MdOutlineReport, MdOutlineWatchLater } from 'react-icons/md';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const Mail = () => {
    const navigate = useNavigate();
    const { selectedEmail } = useSelector(store => store.app);
    const params = useParams();

    const deleteHandler = async () => {
        try {
            const res = await axios.delete(`${API_URL}/api/v1/email/${params.id}`, { withCredentials: true });
            toast.success(res.data.message);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='bg-white rounded-xl mx-1 sm:mx-3 lg:mx-5'>
            <div className='flex items-center justify-between px-2 sm:px-4 py-1'>
                {/* Action toolbar */}
                <div className='flex items-center gap-0.5 sm:gap-1 text-gray-700 py-1 flex-wrap'>
                    <div onClick={() => navigate("/")} className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer' title='Back'>
                        <IoMdArrowBack size={'18px'} />
                    </div>
                    <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
                        <BiArchiveIn size={'18px'} />
                    </div>
                    <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
                        <MdOutlineReport size={'18px'} />
                    </div>
                    <div onClick={deleteHandler} className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer' title='Delete'>
                        <MdDeleteOutline size={'18px'} />
                    </div>
                    <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer hidden sm:block'>
                        <MdOutlineMarkEmailUnread size={'18px'} />
                    </div>
                    <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer hidden sm:block'>
                        <MdOutlineWatchLater size={'18px'} />
                    </div>
                    <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer hidden sm:block'>
                        <MdOutlineAddTask size={'18px'} />
                    </div>
                    <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer hidden sm:block'>
                        <MdOutlineDriveFileMove size={'18px'} />
                    </div>
                    <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
                        <IoMdMore size={'18px'} />
                    </div>
                </div>
                <div className='hidden sm:flex items-center gap-1 text-sm text-gray-500'>
                    <span>1 to 50</span>
                    <MdKeyboardArrowLeft size="22px" />
                    <MdKeyboardArrowRight size="22px" />
                </div>
            </div>

            {/* Email body */}
            <div className='overflow-y-auto p-3 sm:p-6' style={{ maxHeight: 'calc(100vh - 130px)' }}>
                {/* Subject + Date */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-3'>
                    <div className='flex items-center gap-2 flex-wrap'>
                        <h1 className='text-base sm:text-xl font-medium'>{selectedEmail?.subject}</h1>
                        <span className='text-xs sm:text-sm bg-gray-200 rounded-md px-2 py-0.5'>inbox</span>
                    </div>
                    <div className='text-gray-400 text-xs sm:text-sm shrink-0'>
                        <p>12 days ago</p>
                    </div>
                </div>

                {/* Sender info */}
                <div className='text-gray-500 text-xs sm:text-sm mb-6'>
                    <p className='font-medium'>{selectedEmail?.to}</p>
                    <span>to me</span>
                </div>

                {/* Message */}
                <div className='text-sm sm:text-base leading-relaxed text-gray-800'>
                    <p>{selectedEmail?.message}</p>
                </div>
            </div>
        </div>
    )
}

export default Mail