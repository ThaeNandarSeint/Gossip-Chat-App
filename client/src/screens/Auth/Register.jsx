import React, { useState, useEffect } from 'react'
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import {registerRoute} from '../../utils/APIRoutes'

// css
import './Auth.css'

export const Register = () => {
    const navigate = useNavigate();
    // check user or not (can reach this page if not user) 
    useEffect(()=>{
        if(localStorage.getItem('userId')){
          navigate('/')
        }
    }, [])
    // hide password
    const [isShow, setIsShow] = useState(false)
    const handleShow = ()=>{        
        setIsShow(!isShow)
    }
    // get values from inputs
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        cPassword: ''
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
        const { name, email, password, cPassword } = values;
        if (password !== cPassword) {
            toast.error('Password and Confirm Password do not match!', toastOptions);
            return false;
        }
        if (name === '') {
            toast.error('Username is required!', toastOptions);
            return false;
        }
        if (email === '') {
            toast.error('Email is required!', toastOptions);
            return false;
        }
        if (password === '') {
            toast.error('Password is required!', toastOptions);
            return false;
        }
        if (cPassword === '') {
            toast.error('Confirm Password is required!', toastOptions);
            return false;
        }
        if (name.length < 3) {
            toast.error('Username should be greater than 3 characters!', toastOptions);
            return false;
        }
        if (password.length < 5) {
            toast.error('Password should be greater than 5 characters!', toastOptions);
            return false;
        }
        if (email === password) {
            toast.error('Email and Password should not be equal', toastOptions);
            return false;
        }
        return true;
    }
    // send data
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(handleValidation()){
          const {name, email, password} = values;
          try{
            const {data} = await axios.post(registerRoute , {
                name,
                email,
                password
            })
            if(data.status === true){
                console.log(data.msg);
                toast.error(data.msg, toastOptions)
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
            <ToastContainer /> 
            <div className='auth-wrapper'>
                <div className="auth-title"><span>Register Form</span></div>
                <form onSubmit={handleSubmit} >
                    <div className="auth-input">
                        <i className="fas fa-user"></i>
                        <input className='register-input' type="text" name='name' placeholder="Username" onChange={handleChange} />
                    </div>
                    <div className="auth-input">
                        <i class="fa-solid fa-envelope"></i>
                        <input className='register-input' type="email" name='email' placeholder="Email" onChange={handleChange} />
                    </div>
                    <div className="auth-input">
                        <i className="fas fa-lock"></i>
                        <input className='register-input' type={isShow ? "text" : "password"} name='password' placeholder="Password" onChange={handleChange} />
                        <div className='hide-password' onClick={handleShow}>
                            {
                                isShow ? <AiOutlineEye /> : <AiOutlineEyeInvisible />
                            }
                        </div>                        
                    </div>                    
                    <div className="auth-input">
                        <i class="fa-solid fa-key"></i>
                        <input className='register-input' type={isShow ? "text" : "password"} name='cPassword' placeholder="Confirm Password" onChange={handleChange} />
                        <div className='hide-password' onClick={handleShow}>
                            {
                                isShow ? <AiOutlineEye /> : <AiOutlineEyeInvisible />
                            }
                        </div>
                    </div>
                    <div className="auth-input btn">
                        <button className='auth-btn' type="submit" >Register</button>
                    </div>
                    <div className="change-page">Already a user? <Link to='/login'>LOGIN</Link></div>
                </form>
            </div>                    
        </>
    )
}