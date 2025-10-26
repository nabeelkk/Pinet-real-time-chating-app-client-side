import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";


export const ChatContext = createContext()

export const ChatProvider = ({children})=>{

    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [unSeenMessages, setUnSeenMessages] = useState({})
    const [selectedUser, setSelectedUser] = useState(null)

    const {axios, socket} = useContext(AuthContext)

    const getUsers = async()=>{
        try {
            const {data} = await axios.get('/api/messages/users');
            console.log(data,"users data")
            if(data.success){
                setUsers(data.users)
                setUnSeenMessages(data.unSeenMessages)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.messages)
        }
    }
    const getMessages = async(userId)=>{
        try {
            const {data} =await axios.get(`/api/messages/${userId}`)
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.messages)
        }
    }

    const sendMessage = async(messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData)
            console.log(data,"data")
            if(data.success){
                setMessages((pre)=>[...pre,data.newMessage])
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const subscribeToMessage = async()=>{
        if(!socket) return

        socket.on("newMessage",(newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true
                setMessages((prev)=>[...prev,newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }else{
                setUnSeenMessages((prevUnMessages)=>({
                    ...prevUnMessages, [newMessage.senderId] : prevUnMessages[newMessage.senderId] ? prevUnMessages[newMessage.senderId]+1 : 1
                }))
            }
        })
    }

    const unSubscribeFromMessage = ()=>{
        if(socket) socket.off('newMessage')
    }

    useEffect(()=>{
        subscribeToMessage;
        return ()=> unSubscribeFromMessage()
    },[socket, selectedUser])


    const value = {
        messages,
        users,
        unSeenMessages,
        selectedUser,
        setMessages,
        setUnSeenMessages,
        setSelectedUser,
        sendMessage,
        getUsers,
        getMessages
    }
    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}