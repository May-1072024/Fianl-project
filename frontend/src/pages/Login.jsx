import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserData } from '../context/User.jsx'
import { SongData } from '../context/Song.jsx'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {fetchSongs,fetchAlbums} = SongData();

    const{loginUser, btnLoading} = UserData();
    const navigate = useNavigate();

    const submitHandler = (e) =>{
        e.preventDefault();
       loginUser(email, password,navigate, fetchSongs,fetchAlbums);
    }

    return <div className='flex items-center justify-center h-screen max-h-screen '>
        <div className="bg-black text-white p-8 rounded-lg shadow-md max-w-md w-full ">
            <h2 className="text-3xl font-semibold text-center mb-8">Login to Timeless</h2>

            <form onSubmit={submitHandler} className='mt-8'>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type='email' placeholder='Enter Your Email' className='auth-input' value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input type='password' placeholder='Password' className='auth-input' value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button disabled = {btnLoading} className='auth-btn'>{btnLoading ? "Please Wait" : "Login"}</button>
            </form>
            <div className="text-center mt-6">
                <Link to="/register" className='text-sm text-gray-400 hover:text-gray-300'>Don't Have Account?</Link>
            </div>
        </div>
    </div>
}

export default Login