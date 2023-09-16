import React from 'react'
import erroring from "../assets/error-music.jpg"

const Error = () => {
  return (
    <div className=' flex flex-col justify-center items-center w-full h-full'>
      <img src={erroring} alt="" className=' w-80' />
      <h2 className=" font-bold text-2xl text-center tracking-widest text-gray-500 animate-pulse">There's something wrong. Please Try Again.</h2>
    </div>
  )
}

export default Error
