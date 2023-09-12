import React from 'react'
import Sidebar from './components/Sidebar'
import Searchbar from './components/Searchbar'
import { Route, Routes } from 'react-router-dom'
import Discover from './pages/Discover'
import TopPlay from './components/TopPlay'

const App = () => {
  return (
    <div className=' flex relative'>
      <Sidebar />
      <div className=' flex-1 flex flex-col'>
        <Searchbar />
        <div className="px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
          <div className="flex-1 h-fit pb-40">
            <Routes>
              <Route path='/' element={<Discover />} />
            </Routes>
          </div>
          <div>
            <TopPlay />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
