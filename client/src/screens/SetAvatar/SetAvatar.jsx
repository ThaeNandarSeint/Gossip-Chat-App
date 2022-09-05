import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import {setAvatarRoute} from '../../utils/APIRoutes'
import {Buffer} from 'buffer';

// css
import './SetAvatar.css'

// components
import { Loading } from '../../screens/Loading/Loading'

export const SetAvatar = () => {
    const navigate = useNavigate();
    // check user or not (Only user can reach this page) 
    useEffect(()=>{
        if(!localStorage.getItem('userId')){
          navigate('/login')
        }
    }, [])

    // fetch avatar api
    const api = "https://api.multiavatar.com/45678945"
    useEffect(()=>{
        async function fetchData(){
            const data = [];
            for(let i=0; i<4; i++){
                const image = await axios.get(`${api}/${Math.round(Math.random()*1000)}`)
                const buffer = new Buffer(image.data);
                data.push(buffer.toString('base64'))
            }
            setAvatars(data);
            setIsLoading(false)
        }
        fetchData();
    }, [])
    // 
    const [avatars, setAvatars] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAvatar, setSelectedAvatar] = useState(undefined)

    const toastOptions = {
        position: 'top-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }
    // set avatar
    const setProfilePicture = async ()=>{
        if(selectedAvatar === undefined){
            toast.error("Please select an avatar!", toastOptions)
        }else{
            const userId = localStorage.getItem('userId')
            const { data } = await axios.put(`${setAvatarRoute}/${userId}`, {
                image: avatars[selectedAvatar]
            })
            if(!data.isSet){
                toast.error("Avatar setting error! Please try again...", toastOptions)
            }
            navigate('/')           
        }
    }   

  return (
    <>
        <ToastContainer />
        {
            isLoading ? <Loading /> : (
                <div className='avatar-wrapper'>
                    <div className='avatar-title'>
                        <h1>Pick an avatar as your profile picture</h1>
                    </div>
                    <div className='avatars'>
                        {
                            avatars.map((avatar, index)=>{
                                return (
                                    <div
                                    key={index}
                                    className={`avatar ${selectedAvatar === index ? "avatar-selected" : ""}`}>
                                        <img src={`data: image/svg+xml;base64, ${avatar}`} 
                                            onClick={()=>setSelectedAvatar(index)}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <button className='avatar-btn' onClick={setProfilePicture}>Set as Profile Picture</button>
                </div>
            )
        }        
    </>
  )
}