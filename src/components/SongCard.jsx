import React from 'react'

const SongCard = ({song}) => {
  return (
    <div className=' bg-slate-400'>
      
      <img src={song.share.image} className=' w-32' alt="" />
    </div>
  )
}

export default SongCard
