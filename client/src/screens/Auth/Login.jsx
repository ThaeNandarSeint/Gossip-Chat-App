import React, { useState, useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import {loginRoute} from '../../utils/APIRoutes'

// css
import './Auth.css'

export const Login = () => {
    const navigate = useNavigate();
    // check user or not (can reach this page if not user) 
    useEffect(()=>{
        if(localStorage.getItem('userId')){
          navigate('/')
        }
    }, [])
    // hide password
    const [isShow, setIsShow] = useState(false)
    const handleShow = (e)=>{        
        setIsShow(!isShow)
    }
    // get values from inputs
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }
    // validation
    const toastOptions = {
        position: 'top-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }
    const handleValidation = () => {
        const { email, password } = values;
        
        if (email === '') {
            toast.error('Email is required!', toastOptions);
            return false;
        }
        if (password === '') {
            toast.error('Password is required!', toastOptions);
            return false;
        }   

        return true;
    }
    // send data
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const {email, password} = values;
            try{                
                const {data} = await axios.post(loginRoute, {
                    email,
                    password
                })
                if(data.status === true){
                    toast.error(data.msg, toastOptions)
                    localStorage.setItem('userId', data.userId)
                    navigate('/')
                }           
            }catch(err){
                if(err.response.data.status === false){
                    toast.error(err.response.data.msg, toastOptions)
                }
            }            
        }
    }

  return (
    <>
        <div className="auth-wrapper auth-wrapper-login">
            <div className="auth-title"><span>Login Form</span></div>
            <form onSubmit={handleSubmit}>
                <div className="auth-input">
                    <i className="fas fa-user"></i>
                    <input type="email" name='email' placeholder="Email" onChange={handleChange} />
                </div>
                <div className="auth-input">
                    <i className="fas fa-lock"></i>
                    <input type={isShow ? "text" : "password"} name='password' placeholder="Password" onChange={handleChange} />
                    <div className='hide-password' onClick={handleShow}>
                        {
                            isShow ? <AiOutlineEye /> : <AiOutlineEyeInvisible />
                        }
                    </div>                    
                </div>
                <div className="forgot-password"><Link to='/forgot_password'>Forgot Password?</Link></div>
                <div className="auth-input btn">
                    <button className='auth-btn' type="submit" >Login</button>         
                </div>
                <div className="change-page">Need an account? <Link to='/register'>SIGN UP</Link></div>
            </form>
        </div>
        <ToastContainer />
    </>
  )
}
