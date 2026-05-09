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
        <div className='flex items-center justify-between border-b border-gray-200 px-4 py-3 text-sm hover:cursor-pointer hover:shadow-md group'>
            <div className='flex items-center gap-3 min-w-[180px]'>
                <div className='text-gray-400'>
                    <MdCropSquare size={'20px'} />
                </div>
                <div className='text-red-400'>
                    <MdOutlineDrafts size={'20px'} />
                </div>
                <div>
                    <h1 className='font-semibold text-red-500 truncate max-w-[120px]'>
                        {draft.to ? `Draft: To ${draft.to}` : 'Draft (no recipient)'}
                    </h1>
                </div>
            </div>
            <div className='flex-1 ml-4 flex gap-2 overflow-hidden'>
                <span className='font-medium text-gray-800 whitespace-nowrap'>
                    {draft.subject || '(no subject)'}
                </span>
                <span className='text-gray-500 truncate'>
                    — {draft.message || '(no message)'}
                </span>
            </div>
            <div className='flex items-center gap-3 flex-none ml-4'>
                <button
                    onClick={handleSendDraft}
                    className='hidden group-hover:block bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 transition-colors'
                >
                    Send
                </button>
                <button
                    onClick={handleDeleteDraft}
                    className='hidden group-hover:block text-red-400 hover:text-red-600 transition-colors'
                    title='Delete draft'
                >
                    <MdDelete size={'18px'} />
                </button>
                <span className='text-gray-500 text-sm whitespace-nowrap'>{formatDate(draft.updatedAt)}</span>
            </div>
        </div>
    )
}

export default Draft
