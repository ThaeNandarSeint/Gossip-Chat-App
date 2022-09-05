import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { ChatInput } from './ChatInput';
import {v4 as uuidv4} from 'uuid'
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';

export const ChatBox = ({ currentChat, currentUser, socket }) => {
    const [messages, setMessages] = useState([])
    const [arrivalMessage, setArrivalMessage] = useState(null)   

    // fetch all messages
    useEffect(()=>{
        async function fetchData(){
            if(currentChat){
                const { data } = await axios.post(getAllMessagesRoute, {
                    from: currentUser._id,
                    to: currentChat._id,
                })
                await setMessages(data)
            }            
        }
        fetchData();        
    }, [currentChat])

    // send message
    const handleSendMsg = async (msg)=>{
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg
        })
        // send msg socket
        socket.current.emit('send-msg', {
            to: currentChat._id,
            from: currentUser._id,
            message: msg
        })
        const msgs = [...messages]
        msgs.push({fromSelf: true, message: msg})
        setMessages(msgs);
    }
    // receive msg socket
    useEffect(()=>{
        if(socket.current){
            socket.current.on('msg-receive', (msg)=>{
                setArrivalMessage({fromSelf: false, message: msg})
            })
        }
    }, [])
    // collect all messages
    useEffect(()=>{
        arrivalMessage && setMessages((prev)=>[...prev, arrivalMessage])
    }, [arrivalMessage])
    // make always scroll to last message
    const scrollRef = useRef();
    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behaviour: "smooth"})
    }, [messages])

  return (
    <>
        {
            currentChat && (
                <div className="right-side">
                    <div className="header">
                        <div className="imgText">
                            <div className="userimg">
                                <img src={`data: image/svg+xml;base64, ${currentChat.avatarImage}`} className="chat-cover" alt="" />
                            </div>
                            <h4>{currentChat.name}<br />
                            {/* <span>online</span> */}
                            </h4>
                        </div>
                        <ul className="nav-icons">
                            <li><ion-icon name="search-outline"></ion-icon></li>
                            <li><ion-icon name="ellipsis-vertical"></ion-icon></li>
                        </ul>
                    </div>    
                    {/* chatbox */}
                    <div className="chatbox">
                        {
                            messages.map((message)=>(
                                <div ref={scrollRef} key={uuidv4()}>
                                    <div className={`message ${message.fromSelf ? "my-message" : "fri-message"}`}>
                                        <p>{message.message}<br /><span>{message.createdTime}</span></p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {/* chat input */}
                    <ChatInput handleSendMsg={handleSendMsg} />
                </div>
            )
        }
    </>
  )
}
