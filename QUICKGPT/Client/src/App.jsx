import {useState} from 'react'
import SideBar from "./components/SideBar.jsx"
import ChatBox from "./components/ChatBox.jsx"
import Credits from "./pages/credits.jsx"
import Community from "./pages/community.jsx"
import { Route, Routes, useLocation, Navigate } from "react-router-dom"
import { useAppContext } from './context/AppContext.jsx'
import { assets } from './assets/assets.js'
import "./assets/prism.css"
import Loading from "./pages/loading.jsx";
import Login from './pages/login.jsx'
import {Toaster} from 'react-hot-toast'


const App = () => {
  const {user, loadingUser, theme}=useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const {pathname}=useLocation();
  
  if(pathname==='/loading'||loadingUser) return <Loading/>

  return (
    <>
    <Toaster/>
    {!isMenuOpen && user && (
      <img 
        src={assets.menu_icon} 
        className={`absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden ${theme !== 'dark' ? 'invert' : ''}`} 
        onClick={() => setIsMenuOpen(true)} 
        alt="menu"
      />
    )}

    {user ? (
      <div className={`${theme === 'dark' ? 'dark:bg-gradient-to-b from-[#242124] to-[#000000]' : 'bg-white'}`}>
        <div className='flex h-screen w-screen'>
          <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/community" element={<Community />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    ) : (
      <Routes>
        <Route path="/login" element={
          <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'>
            <Login/>
          </div>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )}
    </>
  )
}

export default App
