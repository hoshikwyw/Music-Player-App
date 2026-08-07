import Sidebar from './components/Sidebar'
import Searchbar from './components/Searchbar'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Mood from './pages/Mood'
import ArtistDetail from './pages/ArtistDetail'
import SongDetail from './pages/SongDetail'
import MusicPlayer from './pages/MusicPlayer'
import { useActiveSong } from './redux/services/playerSelectors'
import Liked from './pages/Liked'
import Search from './pages/Search'
import NowPlaying from './pages/NowPlaying'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import RequireAdmin from './components/RequireAdmin'
import AudioEngine from './components/player-control/AudioEngine'
import AmbientBackdrop from './components/AmbientBackdrop'

const App = () => {
  const activeSong = useActiveSong()
  const location = useLocation()
  const hasPlayer = !!activeSong?.id
  const isNowPlaying = location.pathname === '/now-playing'
  const showDock = hasPlayer && !isNowPlaying

  return (
    <div className="relative flex min-h-screen">
      {/* Painted behind everything -- glass needs a backdrop to refract */}
      <AmbientBackdrop />
      {/* Mounted once, outside the routes, so playback survives navigation */}
      <AudioEngine />
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen md:ml-[210px]">
        {/* Now Playing carries its own header, and a search field on top of an
            immersive player is noise. */}
        {!isNowPlaying && (
          <header className="fixed top-0 right-0 left-0 md:left-[210px] z-20">
            <Searchbar />
          </header>
        )}

        <div
          className={`flex-1 overflow-y-auto hide-scrollbar ${
            isNowPlaying ? 'mt-0' : 'mt-[48px]'
          }`}
        >
          <main
            className={`w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-4 ${
              showDock ? 'pb-32 sm:pb-36' : 'pb-8'
            }`}
          >
            {/* Keyed by path so navigating away clears a crashed route */}
            <ErrorBoundary key={location.pathname}>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/mood/:slug' element={<Mood />} />
                <Route path='/liked' element={<Liked />} />
                <Route path='/search/:searchTerm' element={<Search />} />
                <Route path='/songs/:songid' element={<SongDetail />} />
                <Route path='/artists/:id' element={<ArtistDetail />} />
                <Route path='/now-playing' element={<NowPlaying />} />
                <Route
                  path='/superadmin'
                  element={
                    <RequireAdmin>
                      <AdminDashboard />
                    </RequireAdmin>
                  }
                />

                {/* Old catalogue routes, kept as redirects so existing links
                    and bookmarks do not 404. */}
                <Route path='/discover' element={<Navigate to='/' replace />} />
                <Route path='/charts' element={<Navigate to='/mood/everything' replace />} />
                <Route path='/artists' element={<Navigate to='/mood/everything' replace />} />

                <Route path='*' element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </div>

      {/* Floating dock, inset from the edges so the ambient backdrop stays
          visible around it. Elevation 3 -- the closest surface to the viewer. */}
      {showDock && (
        <div className="fixed bottom-3 left-3 right-3 md:left-[222px] md:right-4 z-30 animate-slideup">
          <div className="glass-3 rounded-glass-lg h-[64px] sm:h-[76px] flex overflow-hidden">
            <MusicPlayer />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
