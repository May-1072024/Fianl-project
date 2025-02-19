import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.js'

const Logo = () => {
  const navigate = useNavigate()
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          console.log("Audio playback started successfully")
        })
        .catch(error => {
          console.error("Audio playback failed:", error)
        })
    }

    const timer = setTimeout(() => {
      navigate('/login')
    }, 5000)
    
    return () => {
      clearTimeout(timer)
    }
  }, [navigate])



  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center">
      <img 
        src={assets.logos} 
        alt="Logo" 
        className="w-[70vw] bg-black animate-test-animation logo-image"

      />

      <audio ref={audioRef} src={assets.logo_music}></audio>
    </div>
  )
}

export default Logo
