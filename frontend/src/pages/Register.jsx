import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserData } from '../context/User.jsx';
import { SongData } from '../context/Song.jsx';
import { toast } from 'react-toastify';
import { sendVerificationEmail } from '../../backend/utills/email.js';



const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const { fetchSongs, fetchAlbums } = SongData();
    const { registerUser, btnLoading } = UserData();
    const navigate = useNavigate();


    const submitHandler = (e) => {
        e.preventDefault();
        registerUser(name, email, password, navigate, fetchSongs, fetchAlbums)
            .then((response) => {
                if (response) {
                    const verificationLink = `${window.location.origin}/verify-email?token=${response.user.verificationToken}`;
                    sendVerificationEmail(response.user.email, verificationLink)
                        .then(() => {
                            toast.info('A verification email has been sent. Please check your inbox.');
                        })
                        .catch((error) => {
                            toast.error('Failed to send verification email. Please try again later.');
                        });
                }
            })

            .catch((error) => {
                toast.error(error.message || 'Registration failed');
            });
    }


    return <div className='flex items-center justify-center h-screen max-h-screen '>
        <div className="bg-black text-white p-8 rounded-lg shadow-md max-w-md w-full ">
            <h2 className="text-3xl font-semibold text-center mb-8">Register to Timeless</h2>

            <form onSubmit={submitHandler} className='mt-8'>
                <div className="mb-4 text-center">
                    <p className="text-sm text-gray-400">
                        We'll send a verification email to confirm your account
                    </p>
                </div>


                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type='text' placeholder='Enter Your Name' className='auth-input' value={name} onChange={e => setName(e.target.value)} required />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type='email' placeholder='Enter Your Email' className='auth-input' value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input type='password' placeholder='Password' className='auth-input' value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button disabled={btnLoading} className='auth-btn'>{btnLoading ? "Please Wait" : "Register"}</button>
            </form>
            <div className="text-center mt-6">
                <Link to="/login" className='text-sm text-gray-400 hover:text-gray-300'>Have Account?</Link>
            </div>
        </div>
    </div>
}

export default Register
