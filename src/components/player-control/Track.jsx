import React from 'react'

const Track = ({isPlaying , isActive , activeSong}) => {
  return (
    <div className=' flex-1 flex items-center justify-start'>
      <div className={` ${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} hidden sm:block h-16 w-16 mr-4`}>
        <img src={activeSong?.images?.coverart} alt="cover image" className=' rounded-full' />
      </div>
      <div className=" w-[50%]">
        <p className=" truncate text-white font-semibold text-lg">
            {activeSong?.title ? activeSong?.title : 'No playing song'}
        </p>
        <p className=" truncate text-zinc-500">
            {activeSong?.subtitle ? activeSong?.subtitle : 'Unknown artist'}
        </p>
      </div>
    </div>
  )
}

export default Track
