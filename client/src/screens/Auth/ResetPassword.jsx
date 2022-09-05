import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { resetPasswordRoute } from '../../utils/APIRoutes'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

export const ResetPassword = () => {
    const navigate = useNavigate()
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

    const {token} = useParams()
    // get values from inputs
    const [values, setValues] = useState({
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
        const { password, cPassword } = values;
        if (password === '') {
            toast.error('Password is required!', toastOptions);
            return false;
        }
        if (cPassword === '') {
            toast.error('Confirm Password is required!', toastOptions);
            return false;
        }
        if (password.length < 5) {
            toast.error('Password should be greater than 5 characters!', toastOptions);
            return false;
        }
        return true;
    }    
    // send data    
    const handleSubmit = async (e)=>{
        e.preventDefault()
        if(handleValidation()){
            const { password, cPassword } = values;
            try {
                const { data } = await axios.post(resetPasswordRoute, {password}, {
                    headers: {Authorization: token}
                })
                if(data.status === true){
                    toast.error(data.msg, toastOptions)                    
                    localStorage.setItem('userId', data.userId)
                    navigate('/')
                } 
            } catch (err) {
                console.log(err.response.status);
                if(err.response.status === 500){
                    toast.error(err.response.data.msg, toastOptions)                    
                }
            }
        }        
    }

    return (
        <>
            <ToastContainer />
            <div className='auth-wrapper reset-wrapper'>
                <div className="auth-title"><span>Register Form</span></div>                
                <form onSubmit={handleSubmit}>
                    <div className='auth-input'>
                        <i className="fas fa-lock"></i>
                        <input type={isShow ? "text" : "password"} name="password" onChange={handleChange} placeholder='Password...' />
                        <div className='hide-password' onClick={handleShow}>
                            {
                                isShow ? <AiOutlineEye /> : <AiOutlineEyeInvisible />
                            }
                        </div> 
                    </div>
                    <div className='auth-input'>
                        <i class="fa-solid fa-key"></i>
                        <input type={isShow ? "text" : "password"} name="cPassword" onChange={handleChange} placeholder='Confirm Password...' />
                        <div className='hide-password' onClick={handleShow}>
                            {
                                isShow ? <AiOutlineEye /> : <AiOutlineEyeInvisible />
                            }
                        </div> 
                    </div>
                    <div className="auth-input btn">
                        <button className='auth-btn' type="submit" >Reset Password</button>
                    </div>
                </form>
            </div>
        </>
    )
}
