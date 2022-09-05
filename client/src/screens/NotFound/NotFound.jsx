import React from 'react';
import { Link } from 'react-router-dom'

// image
import error from '../../assets/error.gif'

// css
import './NotFound.css'

export const NotFound = () => {
    return (
        <div className="not-container">
            <img src={error} alt="" />
            <h2>Hmmm...</h2>
            <p>It Looks Like You're Lost...</p>
            <p>That's a trouble?</p>
            <Link to='/'>
                <button className="not-btn">Go Back</button>
            </Link>
        </div> 
    )
}