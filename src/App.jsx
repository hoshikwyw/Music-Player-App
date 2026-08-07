import Sidebar from './components/Sidebar'
import Searchbar from './components/Searchbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Discover from './pages/Discover'
import ArtistDetail from "./pages/ArtistDetail"
import Artists from "./pages/Artists"
import SongDetail from "./pages/SongDetail"
import TopPlay from './components/TopPlay'
import MusicPlayer from './pages/MusicPlayer'
import { useSelector } from 'react-redux'
import Charts from './pages/Charts'
import Liked from './pages/Liked'
import Search from './pages/Search'
import NowPlaying from './pages/NowPlaying'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import RequireAdmin from './components/RequireAdmin'

const App = () => {
  const { activeSong } = useSelector((state) => state.player)
  const location = useLocation()
  const hasPlayer = !!activeSong?.attributes?.name
  const isNowPlaying = location.pathname === '/now-playing'

  return (
    <div className="relative flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen md:ml-[210px]">
        {/* Fixed searchbar */}
        <div className="fixed top-0 right-0 left-0 md:left-[210px] z-20">
          <Searchbar />
        </div>
        {/* Content below fixed searchbar */}
        <div className="flex-1 flex lg:flex-row flex-col overflow-y-auto hide-scrollbar mt-[44px] sm:mt-[48px]">
          <div className={`flex-1 min-w-0 px-3 sm:px-4 md:px-5 pt-3 sm:pt-4 ${hasPlayer && !isNowPlaying ? 'pb-24 sm:pb-28' : 'pb-6'}`}>
            {/* Keyed by path so navigating away clears a crashed route */}
            <ErrorBoundary key={location.pathname}>
              <Routes>
                <Route path='/' element={<Discover />} />
                <Route path='/discover' element={<Discover />} />
                <Route path='/artists/:id' element={<ArtistDetail />} />
                <Route path='/songs/:songid' element={<SongDetail />} />
                <Route path='/artists' element={<Artists />} />
                <Route path='/charts' element={<Charts />} />
                <Route path='/liked' element={<Liked />} />
                <Route path='/search/:searchTerm' element={<Search />} />
                <Route path='/now-playing' element={<NowPlaying />} />
                <Route
                  path='/superadmin'
                  element={
                    <RequireAdmin>
                      <AdminDashboard />
                    </RequireAdmin>
                  }
                />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </div>
          <div className="hidden lg:block lg:sticky lg:top-0 self-start lg:max-h-[calc(100vh-48px)] lg:overflow-y-auto hide-scrollbar flex-shrink-0 lg:pr-4 lg:pt-4">
            <TopPlay />
          </div>
        </div>
      </div>
      {hasPlayer && !isNowPlaying && (
        <div className="fixed bottom-0 left-0 md:left-[210px] right-0 flex bg-card border-t-2 border-border z-10 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] h-[60px] sm:h-[72px]">
          <MusicPlayer />
        </div>
      )}
    </div>
  )
}

export default App
