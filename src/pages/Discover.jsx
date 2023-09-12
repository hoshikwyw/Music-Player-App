import React from 'react'
import {genres} from "../assets/constants"
import SongCard from '../components/SongCard'

const Discover = () => {
    const genreTitle = 'Pop'
    // console.log(genres);
  return (
    <div className=' flex flex-col'>
      <div className=' w-full flex justify-between items-center md:flex-row flex-col mt-4 mb-10'>
        <h2 className=' font-bold text-3xl'>Discover</h2>
        <select id="" className=' bg-black text-gray-300 px-2 py-1 text-sm rounded-lg outline-none mt-0 md:mt-5'>
            {genres.map((genre) =>  <option key={genre.value} value={genre.value}>{genre.title}</option> )}
        </select>
      </div>
      <div className=' flex flex-wrap justify-start md:justify-center gap-8'>
        {[1,2,3,4,5,6,7].map((song,i) => (
            <SongCard key={song.key} song={song} i={i} />
        ))}
      </div>
    </div>
  )
}

export default Discover
