import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'
import toast from 'react-hot-toast'
import axios from 'axios'

const SideBar = ({isMenuOpen, setIsMenuOpen}) => {
  const { chats,setChats, fetchUsersChats,setSelectedChat, theme, setTheme, user, navigate, logout, createNewChat,token,setToken } = useAppContext()
  const [search, setSearch] = useState('')

  const deleteChat=async(e,chatId)=>{
    try {
      e.stopPropagation()
      const confirm=window.confirm("Are you sure you want to delete this chat?")
    if(!confirm)return
const { data } = await axios.post('/api/chat/delete', { chatId }, {
  headers: { Authorization: `Bearer ${token}` }
});
    if(data.success){
      setChats(prev=>prev.filter(chat=>chat._id!==chatId))
      await fetchUsersChats()
      toast.success(data.message)
    }
return data;
    } catch (error) {
      console.error("Delete Chat Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
    }
  }
  return (
    <div className={`flex flex-col h-screen min-w-72 p-5 border-r border-[#80609F]/30
      transition-all duration-500 max-md:absolute left-0 z-10 
      ${theme === 'dark' ? 'dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30' : 'bg-white'}
      ${!isMenuOpen && 'max-md:-translate-x-full'}`}>

      {/*LOGO*/}
      <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark}
        alt="" className='w-full max-w-48' />

      {/*New chat button*/}
      <button onClick={createNewChat} className='flex justify-center items-center w-full py-2 mt-10
      text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm
      rounded-md cursor-pointer'>
        <span className='mr-2 text-xl'>+</span>New Chat
      </button>

      {/*Search Conversations*/}
      <div className={`flex items-center gap-2 p-3 mt-4 border rounded-md
        ${theme === 'dark' ? 'border-gray-600 dark:border-white/15' : 'border-gray-400'}`}>
        <img src={assets.search_icon} className={`${theme === 'dark' ? '' : 'invert'}`} alt="" />
        <input onChange={(e) => setSearch(e.target.value)} value={search} type="text"
          placeholder='Search conversations' className='text-xs placeholder:text-gray-400
          outline-none'/>
      </div>

      {/*Recent Chats*/}
      {chats.length > 0 && <p className='mt-4 text-sm'>Recent Chats</p>}
      <div className="flex-grow">
        {
          chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.
            toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().
              includes(search.toLowerCase())).map((chat) => (
                <div onClick={()=>{navigate('/'); setSelectedChat(chat); setIsMenuOpen(false)}}
                key={chat._id} className={`p-2 px-4 my-2 rounded-md cursor-pointer
              flex justify-between group
                ${theme === 'dark' ? 'bg-[#2f2f2f] text-white border border-gray-800 dark:border-white/15' : 'bg-white border border-gray-400'}`}>
                  <div>
                    <p className='truncate w-full'>
                      {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-[#B1A6C0]'>
                      {moment(chat.updatedAt).fromNow()}
                    </p>
                  </div>
                  <img src={assets.bin_icon} className='hidden group-hover:block w-4 cursor-pointer not-dark:invert' style={{ filter: 'invert(100%)' }} alt=""
                  onClick={e=>toast.promise(deleteChat(e,chat._id),{loading:'deleting...'})} />
                </div>
              ))
        }
      </div>

      {/*Community Images*/}
      <div onClick={() => { navigate('/community');setIsMenuOpen(false) }} className={`flex items-center gap-2 p-3 mt-4 border rounded-md cursor-pointer hover:scale-103 transition-all
        ${theme === 'dark' ? 'bg-[#000000] text-white dark:border-white/15' : 'bg-white border-gray-400'}`}>
        <img src={assets.gallery_icon} className={`w-4.5 ${theme === 'dark' ?'':'invert'}`} alt="" />
        <div className='flex flex-col text-sm'>
          <p>Community Images</p>
        </div>
      </div>

      {/*Credits Purchases Option*/}
      <div onClick={() => { navigate('/credits'); setIsMenuOpen(false) }} className={`flex items-center gap-2 p-3 mt-4 border rounded-md cursor-pointer hover:scale-103 transition-all
        ${theme === 'dark' ? 'bg-[#000000] text-white dark:border-white/15' : 'bg-white border-gray-400'}`}>
        <img src={assets.diamond_icon} className={`w-4.5 ${theme === 'dark' ? 'invert' : ''}`} alt="" />
        <div className='flex flex-col text-sm'>
          <p>Credits:{user?.credits}</p>
          <p className='text-xs text-gray-400'>Purchase credits to use quickgpt</p>
        </div>
      </div>
      
      {/*Dark Mode Toggle*/}
      <div className={`flex items-center gap-2 p-3 mt-4 border rounded-md
        ${theme === 'dark' ? 'bg-[#000000] text-white dark:border-white/15' : 'bg-white border-gray-400'}`}>
        <div className='flex items-center justify-between gap-2 text-sm'>
          <img src={assets.theme_icon} className={`w-4.5 ${theme === 'dark' ?'':'invert' }`}  alt="" />
          <p>Dark Mode</p>
        </div>
        <label className='relative inline-flex cursor-pointer'>
          <input onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          type="checkbox" className='sr-only peer' checked={theme === 'dark'} />
          <div className='w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600
          transition-all'>
          </div>
          <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full
          transition-transform peer-checked:translate-x-4'></span>
        </label>
      </div>

        {/*User Account*/}
        <div className={`flex items-center gap-3 p-3 mt-4 border rounded-md cursor-pointer group
          ${theme === 'dark' ? 'border-gray-300 dark:border-white/15' : 'border-gray-400'}`}>
          <img src={assets.user_icon} className='w-7 rounded-full' alt="" />
          <p className='flex-1 text-sm truncate' style={{ color: theme === 'light' ? '#000000' : '#FFFFFF' }}>{user?user.name
          :'Login your account'}</p>
         {user && (
  <img
    onClick={logout}
    src={assets.logout_icon}
    className={`h-5 cursor-pointer transition-all duration-200 hover:scale-110 ${
      theme === 'dark' ? '' : 'invert'
    }`}
    alt="Logout"
  />
)}
        </div>

        <img onClick={() => setIsMenuOpen(false)} src={assets.close_icon} className={`absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden ${theme !== 'dark' ? 'invert' : ''}`}alt=""/>

    </div>
  )
}

export default SideBar
