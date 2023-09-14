import React, { useEffect, useState } from 'react'
import {genres} from "../assets/constants"
import SongCard from '../components/SongCard'
import axios from 'axios'

const Discover = () => {
    const genreTitle = 'Pop'
    // console.log(genres);
    const [data,setData] = useState([])

    const fetchData =async () => {
        const api =await axios.get('https://shazam.p.rapidapi.com/charts/track' , {
            params: {
                // id: '2396871'
            },
            headers: {
                'X-RapidAPI-Key': '569e84436amshf9e2b2888bc499ep10c414jsne17550357488',
                'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
            },
        })
        setData(api.data.tracks)
    }

    useEffect(() => {
        fetchData()
    },[])

    console.log(data);

  return (
    <div className=' flex flex-col'>
      <div className=' w-full flex justify-between items-center md:flex-row flex-col mt-4 mb-10'>
        <h2 className=' font-bold text-3xl'>Discover</h2>
        <select id="" className=' bg-black text-gray-300 px-2 py-1 text-sm rounded-lg outline-none mt-0 md:mt-5'>
            {genres.map((genre) =>  <option key={genre.value} value={genre.value}>{genre.title}</option> )}
        </select>
      </div>
      <div className=' flex flex-wrap justify-start md:justify-center gap-8'>
        {data?.map((songs,i) => (
            <SongCard key={songs.key} song={songs} i={i} />
        ))}
      </div>
    </div>
  )
}

export default Discover
