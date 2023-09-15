import React from 'react'
import Sidebar from './components/Sidebar'
import Searchbar from './components/Searchbar'
import { Route, Routes } from 'react-router-dom'
import Discover from './pages/Discover'
import TopPlay from './components/TopPlay'
import MusicPlayer from './pages/MusicPlayer'
import { useSelector } from 'react-redux'

const App = () => {
  const {activeSong} = useSelector((state) => state.player)
  return (
    <div className=' flex relative'>
      <Sidebar />
      <div className=' flex-1 flex flex-col bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'>
        <Searchbar />
        <div className="px-6 flex xl:flex-row flex-col-reverse">
          <div className="flex-1 h-fit pb-40">
            <Routes>
              <Route path='/' element={<Discover />} />
            </Routes>
          </div>
          <div className="xl:sticky relative top-0 h-fit">
            <TopPlay />
          </div>
        </div>
      </div>
      {activeSong?.title && (
        <div className=' fixed h-24 bottom-0 left-0 right-0 flex bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg rounded-t-3xl z-10'>
          <MusicPlayer />
        </div>
      )}
    </div>
  )
}

export default App
