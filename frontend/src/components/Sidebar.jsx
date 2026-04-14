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
    const { activeTab, emails, sentEmails } = useSelector(store => store.app);

    return (
        <div className='w-[15%]'>
            <div className='p-3'>
                <button onClick={() => dispatch(setOpen(true))} className='flex items-center gap-2 bg-[#C2E7FF] p-4 rounded-2xl hover:shadow-md'>
                    <LuPencil size="24px" />
                    Compose
                </button>
            </div>
            <div className='text-gray-600'>
                {
                    sidebarItems.map((item, index) => {
                        const isActive = activeTab === item.tab;
                        const count = item.tab === "inbox" ? emails?.length : item.tab === "sent" ? sentEmails?.length : null;
                        return (
                            <div
                                key={index}
                                onClick={() => dispatch(setActiveTab(item.tab))}
                                className={`flex items-center pl-6 py-1 rounded-r-full gap-4 my-2 cursor-pointer ${isActive ? 'bg-blue-100 font-semibold text-blue-800' : 'hover:bg-gray-200'}`}
                            >
                                {item.icon}
                                <p>{item.text}</p>
                                {count !== null && count > 0 && (
                                    <span className='ml-auto mr-4 text-xs font-bold text-gray-700'>{count}</span>
                                )}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Sidebar