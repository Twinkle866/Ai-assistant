import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [chatsFetched, setChatsFetched] = useState(false);

  // Setup axios interceptor to add token to all requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setChats([]);
    setSelectedChat(null);
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
  }, [navigate]);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/user/data');
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
        logout();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      logout();
    } finally {
      setLoadingUser(false);
    }
  }, [logout]);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      const { data } = await axios.post('/api/user/login', { email, password });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        toast.success('Login successful!');
        return { success: true };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, []);

  // Register function
  const register = useCallback(async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/user/register', { name, email, password });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        toast.success('Account created successfully!');
        return { success: true };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, []);

  const createNewChat = useCallback(async () => {
    try {
      if (!user) return toast('Login to create a new chat');
      navigate("/");
      await axios.post('/api/chat/create');
      // Fetch chats after creating
      const { data } = await axios.get('/api/chat/get');
      if (data.success) {
        setChats(data.chats);
        if (data.chats.length > 0) {
          setSelectedChat(data.chats[0]);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [user, navigate]);

  const fetchUsersChats = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/chat/get');
      if (data.success) {
        setChats(data.chats);
        setChatsFetched(true);
        if (data.chats.length === 0) {
          // Only create new chat if user explicitly needs it, not automatically
          setSelectedChat(null);
        } else {
          setSelectedChat(data.chats[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user && !chatsFetched) {
      fetchUsersChats();
    } else if (!user) {
      setChats([]);
      setSelectedChat(null);
      setChatsFetched(false);
    }
  }, [user, chatsFetched, fetchUsersChats]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [token, fetchUser]);

  const value = {
    navigate, user, setUser, fetchUser, chats, setChats,
    selectedChat, setSelectedChat, theme, setTheme,
    createNewChat, loadingUser, fetchUsersChats,
    token, setToken, axios, login, register, logout
  };

  return (
    <AppContext.Provider value={value}> 
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
