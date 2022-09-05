import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { forgotPasswordRoute } from '../../utils/APIRoutes'

export const ForgotPassword = () => {
    const navigate = useNavigate()
    // check user or not (can reach this page if not user) 
    useEffect(()=>{
        if(localStorage.getItem('userId')){
          navigate('/')
        }
    }, [])
    // get values from inputs
    const [values, setValues] = useState({
        email: ''
    })
    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }
    // validation
    const toastOptions = {
        // position: 'bottom-right',
        position: 'top-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }
    const handleValidation = () => {
        const { email } = values;
        if (email === '') {
            toast.error('Email is required!', toastOptions);
            return false;
        }
        return true;
    }    
    // send data
    const handleSubmit = async (e)=>{
        e.preventDefault()
        if(handleValidation()){
          const { email } = values;
          try {
                const { data } = await axios.post(forgotPasswordRoute, {email})
                if(data.status === true){                    
                    toast.error(data.msg, toastOptions)
                }  
            } catch (err) {
                if(err.response.data.status === false){
                    toast.error(err.response.data.msg, toastOptions)
                }
            }
        }        
    }

    return (
        <>
            <ToastContainer />
            <div className='auth-wrapper fg-wrapper'>
                <div className="auth-title"><span>Register Form</span></div>                
                <form onSubmit={handleSubmit}>
                    <div className="auth-input">
                        <i class="fa-solid fa-envelope"></i>
                        <input type="email" name="email" onChange={handleChange} placeholder='Email...' />
                    </div>
                    <div className="auth-input btn">
                        <button className='auth-btn' type="submit" >Verify your email</button>
                    </div>
                </form>
            </div>
        </>
    )
}
