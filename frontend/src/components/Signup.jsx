import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
    const [input, setInput] = useState({
        fullname:"",
        email:"",
        password:""
    });

    const navigate = useNavigate();

    const changeHandler = (e) => {
        setInput({...input, [e.target.name]:e.target.value});
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/v1/user/register`, input, {
                headers:{
                    'Content-Type':"application/json"
                },
                withCredentials:true
            });
            if(res.data.success){
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='flex items-center justify-center w-screen h-screen bg-gray-50 px-4'>
            <form onSubmit={submitHandler} className='flex flex-col gap-3 bg-white p-6 sm:p-8 w-full max-w-sm rounded-xl shadow-md'>
                <h1 className='font-bold text-2xl uppercase my-2'>Signup</h1>
                <input onChange={changeHandler} value={input.fullname} name='fullname' type='text' placeholder='Name' className='border border-gray-400 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500' />
                <input onChange={changeHandler} value={input.email} name='email' type='email' placeholder='Email' className='border border-gray-400 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500' />
                <input onChange={changeHandler} value={input.password} name='password' type='password' placeholder='Password' className='border border-gray-400 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500' />
                <button type="submit" className='bg-gray-800 p-2 text-white my-2 rounded-md hover:bg-gray-700 transition-colors'>Signup</button>
                <p className='text-sm text-center'>Already have an account? <Link to={"/login"} className='text-blue-600'>Login</Link></p>
            </form>
        </div>
    )
}

export default Signup