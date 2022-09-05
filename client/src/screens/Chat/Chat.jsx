import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChatBox } from '../../components/ChatBox'
import { ChatUsers } from '../../components/ChatUsers'
import { Welcome } from '../../components/Welcome'
import { getAllContacts, getUserInfo, host, sendMessageRoute } from '../../utils/APIRoutes'
import {io} from 'socket.io-client'

import './Chat.css'
import { Loading } from '../Loading/Loading'

export const Chat = () => { 
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentChat, setCurrentChat] = useState(undefined)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // check user or not & fetch user info
  useEffect(()=>{
    async function fetchUser(){
      if(!localStorage.getItem('userId')){
        navigate('/login')
      } else{
        const userId = localStorage.getItem('userId')
        setIsLoaded(true);
        const { data } = await axios.get(`${getUserInfo}/${userId}`)
        setCurrentUser(data)
        setIsLoaded(false);
      }
    }
    fetchUser();
  },[])

  // socket client setup
  const socket = useRef();
  useEffect(()=>{
    if(currentUser){
      socket.current = io(host);
      socket.current.emit('new-user-add', currentUser._id)
      socket.current.on('get-users', (users) => {
        setOnlineUsers(users)
      })      
    }
  }, [currentUser]) 

  // fetch all contacts
  useEffect(()=>{
    async function fetchData(){
      if(currentUser){
        if(currentUser.isAvatarImageSet){
          const { data } = await axios.get(`${getAllContacts}/${currentUser._id}`)
          setContacts(data)
        }else{
          navigate('/setAvatar')
        }
      }
    }
    fetchData();
  },[currentUser])

  // change chat
  const handleChatChange = (chat)=>{
    setCurrentChat(chat);
  }

  return (
    <>
      {
        isLoaded ? <Loading /> : (
          <div className='chat-wrapper'>
            <div className='chat-container'>
              <ChatUsers contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />              
                {
                  isLoaded &&
                  currentChat === undefined ? (
                    
                    <Welcome currentUser={currentUser} />
                  ) : (
                    <ChatBox currentChat={currentChat} currentUser={currentUser} socket={socket} />
                  )
                }
            </div>
          </div>
        )
      }
    </>
  )
}
