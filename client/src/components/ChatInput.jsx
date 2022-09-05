
import React, { useState } from 'react'
import Picker from 'emoji-picker-react'
import {BsEmojiSmileFill} from 'react-icons/bs'
import styled from 'styled-components'
import {IoMdSend} from 'react-icons/io'
import { IoAttachOutline, IoHappyOutline, IoMic, IoSendSharp } from "react-icons/io5";

export const ChatInput = ({ handleSendMsg }) => { 
    // pick emoji
    const [showEmojiPicker, setShowEmojiPicker ] = useState(false);
    const handleEmojiPickerHideShow = ()=>{
        setShowEmojiPicker(!showEmojiPicker)
    }

    const handleEmojiClick = (e, emoji)=>{
        let message = msg;
        message += emoji.emoji;
        setMsg(message);
    }
    // send msg
    const [msg, setMsg ] = useState('');
    const sendChat = (e)=>{
        e.preventDefault();
        if(msg.length>0){
            handleSendMsg(msg);
            setMsg('')
        }
    }

  return (
    <Container>
        <div className='button-container'>
            <div className='emoji'>
                <IoHappyOutline className='ion-icons' onClick={handleEmojiPickerHideShow} />
                {
                    showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />
                }
            </div>    
        </div>
        <form className='input-container' onSubmit={(e)=>sendChat(e)}>            
            <input type='text' placeholder='Type Your Message Here' value={msg} onChange={(e)=>setMsg(e.target.value)} />
            <button type='submit' className='ion-icons msg-send-btn'>
                <IoMdSend />
            </button>
        </form>
    </Container>
  )
}

const Container = styled.div`
position: relative;
width: 100%;
height: 60px;
background: #f0f0f0;
display: flex;
justify-content: space-evenly;
align-items: center;
padding: 20px;
.button-container{
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji{
        position: relative;        
        .emoji-picker-react{
            position: absolute;
            top: -350px;
            background: #e5ddd5;
            box-shadow: 0 1px 5px #009688;
            border-color: #9186f3;
            .emoji-scroll-wrapper::-webkit-scrollbar{
              background: #e5ddd5;
                width: 5px;
                &-thumb {
                    background-color: #009688
                }
            }
            .emoji-categories{
                button{
                    filter: contrast(0);
                }
            }
            .emoji-search{
                background-color: transparent;
                border-color: #9186f3;
            }
            .emoji-group:before{
              background: #e5ddd5;
            }
        }
    }
    .image{
        color: red;
    }
}
.ion-icons{
    cursor: pointer;
    font-size: 1.8em;
    color: #51585c; 
}
.input-container{
  display: flex;
  justify-content: space-evenly;
  align-items: center; 
  width: 100%;
    input{
      position: relative;
      width: 100%;
      margin: 0 20px;
      padding: 10px 20px;
      border: none;
      outline: none;
      border-radius: 30px;
      font-size: 1.2rem;
      color: black;    
    }    
  .msg-send-btn{
      border: none;
      margin-top: 10px;
  }
}
`;