import React, { useState } from 'react'
import { MdCropSquare, MdOutlineWatchLater } from 'react-icons/md'
import { MdOutlineStarBorder, MdStar } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedEmail, setStarredEmails, setSnoozedEmails } from '../redux/appSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const Email = ({email}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, starredEmails, snoozedEmails } = useSelector(store => store.app);

    const isStarred = starredEmails.some(e => e._id === email._id);
    const isSnoozed = snoozedEmails.some(e => e._id === email._id);

    const openMail = () => {
        dispatch(setSelectedEmail(email));
        navigate(`/mail/${email._id}`);
    }

    const handleStar = async (e) => {
        e.stopPropagation();
        try {
            const res = await axios.put(`${API_URL}/api/v1/email/${email._id}/star`, {}, { withCredentials: true });
            if (res.data.success) {
                if (res.data.starred) {
                    dispatch(setStarredEmails([...starredEmails, res.data.email]));
                } else {
                    dispatch(setStarredEmails(starredEmails.filter(e => e._id !== email._id)));
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to update star');
        }
    }

    const handleSnooze = async (e) => {
        e.stopPropagation();
        try {
            const until = isSnoozed ? null : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            const res = await axios.put(
                `${API_URL}/api/v1/email/${email._id}/snooze`,
                { until },
                { withCredentials: true }
            );
            if (res.data.success) {
                if (isSnoozed) {
                    dispatch(setSnoozedEmails(snoozedEmails.filter(e => e._id !== email._id)));
                    toast.success('Snooze removed');
                } else {
                    dispatch(setSnoozedEmails([...snoozedEmails, res.data.email]));
                    toast.success('Snoozed for 1 day');
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to snooze email');
        }
    }

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
        <div onClick={openMail} className='flex items-center border-b border-gray-200 px-2 sm:px-4 py-2 sm:py-3 text-sm hover:cursor-pointer hover:shadow-md group'>
            {/* Left icons */}
            <div className='flex items-center gap-1 sm:gap-3 shrink-0'>
                <div className='text-gray-400 hidden sm:block'>
                    <MdCropSquare size={'18px'} />
                </div>
                <div
                    onClick={handleStar}
                    className={`cursor-pointer transition-colors ${isStarred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                    title={isStarred ? 'Unstar' : 'Star'}
                >
                    {isStarred ? <MdStar size={'18px'} /> : <MdOutlineStarBorder size={'18px'} />}
                </div>
                <div
                    onClick={handleSnooze}
                    className={`cursor-pointer transition-colors hidden sm:block opacity-0 group-hover:opacity-100 ${isSnoozed ? 'text-blue-500 opacity-100' : 'text-gray-400 hover:text-blue-500'}`}
                    title={isSnoozed ? 'Remove snooze' : 'Snooze for 1 day'}
                >
                    <MdOutlineWatchLater size={'16px'} />
                </div>
            </div>

            {/* Sender */}
            <div className='w-24 sm:w-32 shrink-0 ml-1 sm:ml-2'>
                <h1 className='font-semibold text-gray-900 truncate text-xs sm:text-sm'>
                    {email?.from || 'Unknown'}
                </h1>
            </div>

            {/* Subject + Preview */}
            <div className='flex-1 min-w-0 ml-2 sm:ml-4'>
                <div className='flex gap-1 sm:gap-2 overflow-hidden'>
                    <span className='font-medium text-gray-800 text-xs sm:text-sm truncate'>{email?.subject}</span>
                    <span className='text-gray-500 text-xs truncate hidden sm:inline'>— {email?.message}</span>
                </div>
            </div>

            {/* Date */}
            <div className='shrink-0 text-gray-500 text-xs ml-2 whitespace-nowrap'>
                <p>{formatDate(email?.createdAt)}</p>
            </div>
        </div>
    )
}

export default Email