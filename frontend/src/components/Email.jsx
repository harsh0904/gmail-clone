import React from 'react'
import { MdCropSquare } from 'react-icons/md'
import { MdOutlineStarBorder } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedEmail } from '../redux/appSlice';

const Email = ({email}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { activeTab } = useSelector(store => store.app);

    const openMail = () => {
        dispatch(setSelectedEmail(email));
        navigate(`/mail/${email._id}`);
    }

    // Format date nicely
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    return (
        <div onClick={openMail} className='flex items-center justify-between border-b border-gray-200 px-4 py-3 text-sm hover:cursor-pointer hover:shadow-md'>
            <div className='flex items-center gap-3 min-w-[180px]'>
                <div className='text-gray-400'>
                    <MdCropSquare size={'20px'} />
                </div>
                <div className='text-gray-400'>
                    <MdOutlineStarBorder size={'20px'} />
                </div>
                <div>
                    <h1 className='font-semibold text-gray-900 truncate max-w-[120px]'>
                        {activeTab === 'sent' ? `To: ${email?.to}` : email?.from || 'Unknown'}
                    </h1>
                </div>
            </div>
            <div className='flex-1 ml-4 flex gap-2 overflow-hidden'>
                <span className='font-medium text-gray-800 whitespace-nowrap'>{email?.subject}</span>
                <span className='text-gray-500 truncate'>— {email?.message}</span>
            </div>
            <div className='flex-none text-gray-500 text-sm ml-4 whitespace-nowrap'>
                <p>{formatDate(email?.createdAt)}</p>
            </div>
        </div>
    )
}

export default Email