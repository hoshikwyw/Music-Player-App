import React from 'react'
import Sidebar from './components/Sidebar'
import Searchbar from './components/Searchbar'
import { Route, Routes } from 'react-router-dom'
import Discover from './pages/Discover'
import ArtistDetail from "./pages/ArtistDetail"
import Artists from "./pages/Artists"
import SongDetail from "./pages/SongDetail"
import TopPlay from './components/TopPlay'
import MusicPlayer from './pages/MusicPlayer'
import { useSelector } from 'react-redux'
import Charts from './pages/Charts'
import Search from './pages/Search'

const App = () => {
  const {activeSong} = useSelector((state) => state.player)
  return (
    <div className=' flex relative'>
      <Sidebar />
      <div className=' flex-1 flex flex-col bg-[#94A684]'>
        <Searchbar />
        <div className="px-6 flex xl:flex-row flex-col-reverse h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar">
          <div className="flex-1 h-fit pb-40">
            <Routes>
              <Route path='/' element={<Discover />} />
              <Route path='/artists/:id' element={<ArtistDetail />} />
              <Route path='/songs/:songid' element={<SongDetail />} />
              <Route path='/artists' element={<Artists />} />
              <Route path='/charts' element={<Charts />} />
              <Route path='/search/:searchTerm' element={<Search />} />
            </Routes>
          </div>
          <div className="xl:sticky relative top-0 h-fit">
            <TopPlay />
          </div>
        </div>
      </div>
      {activeSong?.title && (
        <div className=' fixed h-24 bottom-0 left-0 right-0 flex bg-gradient-to-br from-white/10 to-[#94A684] backdrop-blur-lg rounded-t-3xl z-10'>
          <MusicPlayer />
        </div>
      )}
    </div>
  )
}

export default App
