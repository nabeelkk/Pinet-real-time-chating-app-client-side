import { createContext } from "react";
import axios from 'axios'
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { io } from 'socket.io-client'

export const AuthContext = createContext()

const backenUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backenUrl

export const AuthProvider = ({children})=>{

    const [ token, setToken ] = useState(localStorage.getItem("token"))
    const [ authUser, setAuthUser ] = useState(null)
    const [ onlineUsers, setOnlineUsers] = useState([])
    const [ socket, setSocket] = useState(null) 

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['token'] = token
        }else{
            delete axios.defaults.headers.common['token']
        }
    },[token])

    const checkAuth = async ()=>{
        try {
            const {data} = await axios.get('/api/auth/check');

            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            toast.error(error.message)
        }
    } 

    const login = async (state,credentail)=>{
        try {
            const {data} = await axios.post(`/api/auth/${state}`,credentail)
                console.log(state,"data")
                console.log(credentail,"data")
                console.log(data.success)
            if(data.success){
                console.log("first")
                setAuthUser(data.userData)
                connectSocket(data.userData)
                setToken(data.token) 
                localStorage.setItem("token",data.token)
                toast.success("logged in successfully")
            }else{
                toast.error(data.message)
            }
        } catch (error) {
           toast.error(error.message) 
        }
    }

    const logout = ()=>{
        localStorage.removeItem("token")
        setToken(null)
        setAuthUser(null)
        setOnlineUsers([])
        toast.success('Logged out successfull')
        if(socket){
            socket.disconnect()
            setSocket(null)
        }
    }

    const updateUser = async (body)=>{
        try {
            const {data} = await axios.put('/api/auth/update-profile',body)
            setAuthUser(data.user)
            toast.success("User Updated Succesfully")
        } catch (error) {
            toast.error(error.message)
        }
    }

    const connectSocket = (userData)=>{
        if(!userData || socket?.connected) return
        const newSocket = io(backenUrl,{
            query:{
                userId : userData?._id,
                transports: ["websocket"]
            }
        })
        newSocket.on("connect",()=>{
            console.log("✅ Socket connected:", newSocket.id)
        })
        newSocket.on('disconnect',()=>{
            console.log("Socket disconnected")
        })
        setSocket(newSocket)
    }

    useEffect(()=>{
        if(token) checkAuth()
    },[token])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}