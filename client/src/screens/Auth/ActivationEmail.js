import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'
import { activationEmailRoute } from '../../utils/APIRoutes'

export const ActivationEmail = () => {
    const navigate = useNavigate()
    // check user or not (can reach this page if not user) 
    useEffect(()=>{
        if(localStorage.getItem('userId')){
          navigate('/')
        }
    }, [])
    
    const {activation_token} = useParams()

    const [err, setErr] = useState('')
    const [success, setSuccess] = useState('')
    // get activation token and activate email
    useEffect(() => {
        if(activation_token){
            const activationEmail = async () => {
                try {
                    const { data } = await axios.post(activationEmailRoute, {activation_token})
                    setSuccess(data.msg)
                    localStorage.setItem('userId', data.userId)
                    navigate('/setAvatar')
                } catch (err) {
                    err.response.data.msg && setErr(err.response.data.msg)
                }
            }
            activationEmail()
        }
    },[activation_token])

    return (
        <div className="active_page">
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
        </div>
    )
}
