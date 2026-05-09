import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { MdMinimize } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { setSentEmails, setOpen, addDraft } from '../redux/appSlice';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const SendEmail = () => {
    const [formData, setFormData] = useState({
        to: "",
        subject: "",
        message: ""
    })
    const [draftId, setDraftId] = useState(null);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const { open, sentEmails } = useSelector(store => store.app);
    const dispatch = useDispatch();

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const saveDraft = async () => {
        if (!formData.to && !formData.subject && !formData.message) return;
        setIsSavingDraft(true);
        try {
            const res = await axios.post(
                `${API_URL}/api/v1/email/drafts/save`,
                { ...formData, draftId },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            if (res.data.success) {
                setDraftId(res.data.draft._id);
                dispatch(addDraft(res.data.draft));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSavingDraft(false);
        }
    }

    const handleClose = async () => {
        // Auto-save draft if there's content
        await saveDraft();
        dispatch(setOpen(false));
        setFormData({ to: '', subject: '', message: '' });
        setDraftId(null);
        if (formData.to || formData.subject || formData.message) {
            toast.success('Draft saved');
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/v1/email/create`, formData, {
                headers: { 'Content-Type': "application/json" },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setSentEmails([res.data.email, ...sentEmails]));
                toast.success('Email sent!');
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Failed to send email');
        }
        dispatch(setOpen(false));
        setFormData({ to: '', subject: '', message: '' });
        setDraftId(null);
    }

    return (
        <div className={`${open ? 'block' : 'hidden'} bg-white max-w-6xl shadow-xl shadow-slate-600 rounded-t-md`}>
            <div className='flex items-center justify-between px-3 py-2 bg-[#404040] text-white rounded-t-md'>
                <h1 className='text-sm font-medium'>New Message</h1>
                <div className='flex items-center gap-2'>
                    <div onClick={handleClose} className='p-1 rounded hover:bg-gray-600 hover:cursor-pointer' title='Save draft & close'>
                        <MdMinimize size="18px" />
                    </div>
                    <div onClick={handleClose} className='p-1 rounded hover:bg-gray-600 hover:cursor-pointer' title='Save draft & close'>
                        <RxCross2 size="18px" />
                    </div>
                </div>
            </div>
            <form onSubmit={submitHandler} className='flex flex-col p-3 gap-2'>
                <input
                    onChange={changeHandler}
                    value={formData.to}
                    name="to"
                    type="text"
                    placeholder='To'
                    className='outline-none py-1 border-b border-gray-200 text-sm'
                />
                <input
                    onChange={changeHandler}
                    value={formData.subject}
                    name="subject"
                    type="text"
                    placeholder='Subject'
                    className='outline-none py-1 border-b border-gray-200 text-sm'
                />
                <textarea
                    onChange={changeHandler}
                    value={formData.message}
                    name="message"
                    rows={'10'}
                    className='outline-none py-1 text-sm resize-none'
                    placeholder='Compose email'
                />
                <div className='flex items-center justify-between'>
                    <button
                        type='submit'
                        className='bg-blue-700 rounded-full px-5 py-2 text-sm text-white hover:bg-blue-800 transition-colors'
                    >
                        Send
                    </button>
                    <button
                        type='button'
                        onClick={saveDraft}
                        disabled={isSavingDraft}
                        className='text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50'
                    >
                        {isSavingDraft ? 'Saving...' : 'Save Draft'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SendEmail