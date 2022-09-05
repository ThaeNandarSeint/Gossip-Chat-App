import axios from 'axios';
import React, { useRef, useState } from 'react'
import { logoutRoute } from '../utils/APIRoutes';
import { IoChatbox, IoEllipsisVertical, IoScanCircleOutline, IoSearchOutline } from "react-icons/io5";
import { IoIosLogOut } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

export const ChatUsers = ({ contacts, currentUser, changeChat }) => {    
    const [currentSelected, setCurrentSelected] = useState(undefined);
    // change chat
    const changeCurrentChat = (index, contact)=>{
        setCurrentSelected(index);
        changeChat(contact);
    }

    // search
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ searchResults, setSearchResults ] = useState([])

    const searchHandler = (searchTerm)=>{
        setSearchTerm(searchTerm)
        if(searchTerm !== ''){
            const newContactList = contacts.filter((contact)=>{
                return Object.values(contact).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
            })
            setSearchResults(newContactList)
        }else{
            setSearchResults(contacts)
        }
    }
    const inputEl = useRef('');
    const getSearchTerm = ()=>{        
        searchHandler(inputEl.current.value)
    } 
    // logout
    const navigate = useNavigate();
    const handleLogout = async ()=>{
        const { data } = await axios.get(logoutRoute)
        localStorage.clear();
        navigate('/login');
    }  

  return (
    <div className="left-side">
        <div className="header">                       
                {
                    currentUser ? (
                        <div className='chat-user'> 
                            <div className="userimg">
                                <img src={`data: image/svg+xml;base64, ${currentUser.avatarImage}`} className="chat-cover" alt="" />
                            </div>
                            <h4>{currentUser.name}</h4>                
                        </div>
                    ) : 'loading'
                }
            <ul className="nav-icons">
                <li><IoScanCircleOutline /></li>
                <li><IoChatbox /></li>
                <li><IoIosLogOut onClick={handleLogout} /></li>
            </ul>
        </div>
        {/* search */}
        <div className="search-chat">
            <div>
                <input  type="text" placeholder="Search or start new chat" value={searchTerm} onChange={getSearchTerm} ref={inputEl} />
                <IoSearchOutline className='chat-search' />
            </div>
        </div>
        {/* chat list */}
        <div className="chatlist">   
        {
            searchTerm.length < 1 ? 
            contacts.map((contact, index) => (
                <div className={`block ${index === currentSelected ? "chat-selected" : ""}`} key={index} onClick={()=>changeCurrentChat(index, contact)}>
                    <div className="imgbx">
                        <img src={`data: image/svg+xml;base64, ${contact.avatarImage}`} className="chat-cover" alt="" />
                    </div>
                    <div className="details">
                        <div className="listhead">
                            <h4>{contact.name}</h4>
                            {/* <p className="time">02/09/2021</p> */}
                         </div>
                        {/* <div className="message-p">
                            <p></p>
                            <b>1</b>
                        </div> */}
                    </div>
                </div>  
            )) :                            
            searchResults.map((contact, index)=>(
                <div className={`block ${index === currentSelected ? "chat-selected" : ""}`} key={index} onClick={()=>changeCurrentChat(index, contact)}>
                    <div className="imgbx">
                        <img src={`data: image/svg+xml;base64, ${contact.avatarImage}`} className="chat-cover" alt="" />
                    </div>
                    <div className="details">
                        <div className="listhead">
                            <h4>{contact.name}</h4>
                            {/* <p className="time">02/09/2021</p> */}
                        </div>
                        {/* <div className="message-p">
                                <p></p>
                                <b>1</b>
                            </div> */}
                        </div>
                    </div>  
                ))
            }                                    
        </div>
    </div>
  )
}
