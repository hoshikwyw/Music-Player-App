import React from 'react'
import PlayPause from './PlayPause'
import {playPause, setActiveSong} from '../redux/services/PlayerSlice'

const SongCard = ({song,i}) => {
  const activeSong = 'hello';
  return (
    <div className=' flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer'>
      <div className=" relative w-full h-60 group">
        <div className={` absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${activeSong?.title === song.title ? 'flex bg-black bg-opacity-70' : 'hidden'}`}>
          <PlayPause />
        </div>
        <img src={song.images?.coverart} alt="song_image" className=' h-60' />
      </div>
      
    </div>
  )
}

export default SongCard
