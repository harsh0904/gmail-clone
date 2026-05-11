import React, { useEffect, useState } from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { CiCircleQuestion } from "react-icons/ci";
import { IoIosSettings } from "react-icons/io";
import { TbGridDots } from "react-icons/tb";
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setSearchText } from '../redux/appSlice';
import axios from 'axios';
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Navbar = () => {
    const [text, setText] = useState("");
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const { user } = useSelector(store => store.app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/v1/user/logout`, { withCredentials: true });
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        dispatch(setSearchText(text));
    }, [text]);

    return (
        <div>
            {/* Main navbar row */}
            <div className='flex items-center justify-between mx-2 sm:mx-3 h-14 sm:h-16'>
                {/* Logo */}
                <div className='flex items-center gap-1 sm:gap-2'>
                    <div className='p-2 sm:p-3 hover:bg-gray-200 rounded-full cursor-pointer'>
                        <RxHamburgerMenu size={'18px'} />
                    </div>
                    <img className='w-6 sm:w-8' src="https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png" alt="logo" />
                    <h1 className='text-lg sm:text-2xl text-gray-500 font-medium'>Gmail</h1>
                </div>

                {/* Desktop search bar */}
                {user && (
                    <div className='hidden md:flex flex-1 max-w-2xl mx-6'>
                        <div className='flex items-center bg-[#EAF1FB] px-2 py-2 rounded-full w-full'>
                            <IoIosSearch size={'22px'} className='text-gray-700 shrink-0' />
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder='Search Mail'
                                className='rounded-full w-full bg-transparent outline-none px-1 text-sm'
                            />
                        </div>
                    </div>
                )}

                {/* Right side icons */}
                {user && (
                    <div className='flex items-center gap-1'>
                        {/* Mobile: search toggle icon */}
                        <div
                            className='md:hidden p-2 rounded-full hover:bg-gray-200 cursor-pointer'
                            onClick={() => setMobileSearchOpen(v => !v)}
                        >
                            <IoIosSearch size={'22px'} />
                        </div>
                        {/* Desktop-only icons */}
                        <div className='hidden sm:flex items-center gap-1'>
                            <div className='p-2 rounded-full hover:bg-gray-200 cursor-pointer'>
                                <CiCircleQuestion size={'22px'} />
                            </div>
                            <div className='p-2 rounded-full hover:bg-gray-200 cursor-pointer'>
                                <IoIosSettings size={'22px'} />
                            </div>
                            <div className='p-2 rounded-full hover:bg-gray-200 cursor-pointer'>
                                <TbGridDots size={'22px'} />
                            </div>
                        </div>
                        <span
                            onClick={logoutHandler}
                            className='hidden sm:inline text-sm underline cursor-pointer text-gray-600 px-1'
                        >
                            Logout
                        </span>
                        <div onClick={logoutHandler} className='sm:hidden cursor-pointer'>
                            <Avatar src={user.profilePhoto} size="32" round={true} />
                        </div>
                        <Avatar src={user.profilePhoto} size="36" round={true} className='hidden sm:block cursor-pointer' />
                    </div>
                )}
            </div>

            {/* Mobile search bar (expandable) */}
            {user && mobileSearchOpen && (
                <div className='md:hidden px-3 pb-2'>
                    <div className='flex items-center bg-[#EAF1FB] px-3 py-2 rounded-full'>
                        <IoIosSearch size={'20px'} className='text-gray-700 shrink-0' />
                        <input
                            autoFocus
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder='Search Mail'
                            className='rounded-full w-full bg-transparent outline-none px-2 text-sm'
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar