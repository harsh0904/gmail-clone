import React from 'react'
import { IoMdStar } from 'react-icons/io';
import { LuPencil } from "react-icons/lu";
import { MdInbox, MdOutlineDrafts, MdOutlineKeyboardArrowDown, MdOutlineWatchLater } from "react-icons/md";
import { TbSend2 } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab, setOpen } from '../redux/appSlice';

const sidebarItems = [
    {
        icon: <MdInbox size={'20px'} />,
        text: "Inbox",
        tab: "inbox"
    },
    {
        icon: <IoMdStar size={'20px'} />,
        text: "Starred",
        tab: "starred"
    },
    {
        icon: <MdOutlineWatchLater size={'20px'} />,
        text: "Snoozed",
        tab: "snoozed"
    },
    {
        icon: <TbSend2 size={'20px'} />,
        text: "Sent",
        tab: "sent"
    },
    {
        icon: <MdOutlineDrafts size={'20px'} />,
        text: "Drafts",
        tab: "drafts"
    },
    {
        icon: <MdOutlineKeyboardArrowDown size={'20px'} />,
        text: "More",
        tab: "more"
    },
]

const Sidebar = () => {
    const dispatch = useDispatch();
    const { activeTab, emails, sentEmails, drafts } = useSelector(store => store.app);

    const getCount = (tab) => {
        switch(tab) {
            case 'inbox':  return emails?.length;
            case 'sent':   return sentEmails?.length;
            case 'drafts': return drafts?.length;
            default:       return null;
        }
    };

    return (
        <>
            {/* ── Desktop sidebar ── */}
            <div className='hidden md:block w-[200px] lg:w-[220px] shrink-0'>
                <div className='p-3'>
                    <button
                        onClick={() => dispatch(setOpen(true))}
                        className='flex items-center gap-2 bg-[#C2E7FF] px-4 py-3 rounded-2xl hover:shadow-md text-sm font-medium'
                    >
                        <LuPencil size="20px" />
                        Compose
                    </button>
                </div>
                <div className='text-gray-600'>
                    {sidebarItems.map((item, index) => {
                        const isActive = activeTab === item.tab;
                        const count = getCount(item.tab);
                        return (
                            <div
                                key={index}
                                onClick={() => dispatch(setActiveTab(item.tab))}
                                className={`flex items-center pl-6 py-1 rounded-r-full gap-4 my-2 cursor-pointer ${isActive ? 'bg-blue-100 font-semibold text-blue-800' : 'hover:bg-gray-200'}`}
                            >
                                {item.icon}
                                <p className='text-sm'>{item.text}</p>
                                {count !== null && count !== undefined && count > 0 && (
                                    <span className='ml-auto mr-4 text-xs font-bold text-gray-700'>{count}</span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Mobile bottom navigation bar ── */}
            <nav className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex items-center justify-around py-1 safe-area-inset-bottom'>
                {sidebarItems.filter(i => i.tab !== 'more').map((item, index) => {
                    const isActive = activeTab === item.tab;
                    const count = getCount(item.tab);
                    return (
                        <button
                            key={index}
                            onClick={() => dispatch(setActiveTab(item.tab))}
                            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
                        >
                            <div className={`relative p-1 rounded-full ${isActive ? 'bg-blue-100' : ''}`}>
                                {item.icon}
                                {count !== null && count !== undefined && count > 0 && (
                                    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center'>
                                        {count > 9 ? '9+' : count}
                                    </span>
                                )}
                            </div>
                            <span className='text-[10px]'>{item.text}</span>
                        </button>
                    );
                })}
                {/* Compose FAB */}
                <button
                    onClick={() => dispatch(setOpen(true))}
                    className='flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500'
                >
                    <div className='p-1'>
                        <LuPencil size={'20px'} />
                    </div>
                    <span className='text-[10px]'>Compose</span>
                </button>
            </nav>
        </>
    )
}

export default Sidebar