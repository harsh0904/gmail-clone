import React from 'react'
import { MdCropSquare, MdOutlineDrafts, MdDelete } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import { setOpen, addDraft, removeDraft, setSentEmails } from '../redux/appSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const Draft = ({ draft }) => {
    const dispatch = useDispatch();
    const { sentEmails } = useSelector(store => store.app);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    const handleSendDraft = async (e) => {
        e.stopPropagation();
        if (!draft.to || !draft.subject || !draft.message) {
            toast.error('Draft is incomplete. Please fill in all fields.');
            return;
        }
        try {
            const res = await axios.post(
                `${API_URL}/api/v1/email/drafts/${draft._id}/send`,
                {},
                { withCredentials: true }
            );
            if (res.data.success) {
                dispatch(removeDraft(draft._id));
                dispatch(setSentEmails([res.data.email, ...sentEmails]));
                toast.success('Draft sent!');
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Failed to send draft');
        }
    }

    const handleDeleteDraft = async (e) => {
        e.stopPropagation();
        try {
            const res = await axios.delete(
                `${API_URL}/api/v1/email/${draft._id}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                dispatch(removeDraft(draft._id));
                toast.success('Draft deleted');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete draft');
        }
    }

    return (
        <div className='flex items-center border-b border-gray-200 px-2 sm:px-4 py-2 sm:py-3 text-sm hover:cursor-pointer hover:shadow-md group'>
            {/* Left icons */}
            <div className='flex items-center gap-1 sm:gap-3 shrink-0'>
                <div className='text-gray-400 hidden sm:block'>
                    <MdCropSquare size={'18px'} />
                </div>
                <div className='text-red-400'>
                    <MdOutlineDrafts size={'18px'} />
                </div>
            </div>

            {/* Draft recipient */}
            <div className='w-24 sm:w-36 shrink-0 ml-1 sm:ml-2'>
                <h1 className='font-semibold text-red-500 truncate text-xs sm:text-sm'>
                    {draft.to ? `To: ${draft.to}` : '(no recipient)'}
                </h1>
            </div>

            {/* Subject + preview */}
            <div className='flex-1 min-w-0 ml-2 sm:ml-4'>
                <div className='flex gap-1 sm:gap-2 overflow-hidden'>
                    <span className='font-medium text-gray-800 text-xs sm:text-sm truncate'>
                        {draft.subject || '(no subject)'}
                    </span>
                    <span className='text-gray-500 text-xs truncate hidden sm:inline'>
                        — {draft.message || '(no message)'}
                    </span>
                </div>
            </div>

            {/* Actions + Date */}
            <div className='flex items-center gap-1 sm:gap-3 shrink-0 ml-2'>
                <button
                    onClick={handleSendDraft}
                    className='bg-blue-600 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-700 transition-colors sm:hidden group-hover:inline-block'
                >
                    Send
                </button>
                <button
                    onClick={handleSendDraft}
                    className='hidden group-hover:inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 transition-colors sm:block'
                >
                    Send
                </button>
                <button
                    onClick={handleDeleteDraft}
                    className='text-red-400 hover:text-red-600 transition-colors'
                    title='Delete draft'
                >
                    <MdDelete size={'16px'} />
                </button>
                <span className='text-gray-500 text-xs whitespace-nowrap hidden sm:inline'>{formatDate(draft.updatedAt)}</span>
            </div>
        </div>
    )
}

export default Draft
