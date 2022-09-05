const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')

const { google } = require('googleapis')
const { OAuth2 } = google.auth

// const fetch = require('node-fetch')

const ACTIVATION_TOKEN_SECRET = process.env.ACTIVATION_TOKEN_SECRET
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const CLIENT_URL = process.env.CLIENT_URL
const MAILING_SERVICE_CLIENT_ID = process.env.MAILING_SERVICE_CLIENT_ID
const GOOGLE_SECRET = process.env.GOOGLE_SECRET
const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET

const client = new OAuth2(MAILING_SERVICE_CLIENT_ID)

// register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        // validation
        if (!name || !email || !password) {
            return res.status(400).json({ status: false, msg: "Please fill in all fields!" })
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ status: false, msg: "Invalid Email!" });
        }
        const user = await Users.findOne({ email })
        if (user) {
            return res.status(400).json({ status: false, msg: "This email already exists!" })
        }
        if (password.length < 6) {
            return res.status(400).json({ status: false, msg: "Password must be at least 6 characters!" })
        }

        const passwordHash = await bcrypt.hash(password, 12)
        const newUser = {
            name,
            email,
            password: passwordHash
        }
        // create token
        const activation_token = createActivationToken(newUser)

        const url = `${CLIENT_URL}/user/activate/${activation_token}`
        sendMail(email, url, "Verify your email address")

        return res.json({ status: true, msg: "Register Success! Please activate your email to start" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, msg: err.message })
    }
}

// activate email
const activateEmail = async (req, res) => {
    try {
        const { activation_token } = req.body
        const user = jwt.verify(activation_token, ACTIVATION_TOKEN_SECRET)

        const { name, email, password } = user
        const check = await Users.findOne({ email })
        if (check) {
            return res.status(500).json({ status: false, msg: "This email already exists!" })
        }
        const newUser = new Users({
            name, email, password
        })

        const savedUser = await newUser.save()

        return res.json({ status: true, userId: savedUser._id, msg: "Account has been created!" })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, msg: err.message })
    }
}

// set Avatar
const setAvatar = async(req, res)=>{
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await Users.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        })
        return res.json({ status: true, isSet: userData.isAvatarImageSet, image: userData.avatarImage })
    }catch(err){
        console.log(err);
        return res.status(500).json({ status: false, msg: err.message })
    }
}

// login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email })

        if (!user) {
            return res.status(400).json({ status: false, msg: "This email does not exist!" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ status: false, msg: "Password is incorrect!" })
        }

        const refresh_token = createRefreshToken({ id: user._id })
        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000 //7days
        })
        return res.json({ status: true, userId: user._id, msg: "Login Success!" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, msg: err.message })
    }
}

// getAccessToken
const getAccessToken = async (req, res) => {
    try {
        const rf_token = req.cookies.refresh_token
        if (!rf_token) {
            return res.status(400).json({ status: false, msg: "Token expires! Please Login now" })
        }
        jwt.verify(rf_token, REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(400).json({ status: false, msg: "Token expires! Please Login now" })
            }
            const access_token = createAccessToken({ id: user.id }) //need to chat
            return res.json({ access_token })
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, msg: err.message })
    }
}

// forgotPassword
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await Users.findOne({ email })
        if (!user) {
            return res.status(400).json({ status: false, msg: "This email does not exist!" })
        }
        const access_token = createAccessToken({ id: user._id })
        const url = `${CLIENT_URL}/user/reset/${access_token}`
        sendMail(email, url, "Reset your password")
        return res.json({ status: true, msg: "Already resend your password, please check your email !" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, msg: err.message })
    }
}

// reset password
const resetPassword = async (req, res) => {
    try {
        const { password } = req.body
        const passwordHash = await bcrypt.hash(password, 12)

        const user = await Users.findOneAndUpdate({ _id: req.user.id }, {
            password: passwordHash
        })
        return res.json({ status: true, userId: user._id, msg: "Password is successfully changed!" })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, msg: err.message })
    }
}

// getUserInfo
const getUserInfo = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id).select('-password')
        return res.json(user)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, msg: err.message })
    }
}
// get all contacts
const getAllContacts = async(req, res)=>{
    try {
        const users = await Users.find({_id: {$ne:req.params.id}}).select([
            "_id", "name", "email", "avatarImage"
        ])
        return res.json(users)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, msg: err.message })
    }    
}

// logout
const logout = async (req, res) => {
    try {
        res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
        return res.json({ status: true, msg: "Logged out!" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, msg: err.message })
    }
}

// updateUser
const updateUser = async (req, res) => {
    try {
        const { name, avatar } = req.body
        await Users.findOneAndUpdate({ _id: req.user.id }, {
            name, avatar
        })
        return res.json({ status: true, msg: "Update Success!" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, msg: err.message })
    }
}

// google signup\login
const googleLogin = async (req, res) => {
    try {
        const { tokenId } = req.body
        const verify = await client.verifyIdToken({ idToken: tokenId, audience: MAILING_SERVICE_CLIENT_ID })

        const { email_verified, email, name, picture } = verify.payload

        const password = email + GOOGLE_SECRET
        const passwordHash = await bcrypt.hash(password, 12)

        if (!email_verified) {
            return res.status(400).json({ status: false, msg: "Email verification failed!" })
        }

        const user = await Users.findOne({ email })

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ status: false, msg: "Password is incorrect!" })
            }
            const refresh_token = createRefreshToken({ id: user._id })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 //7days
            })
            return res.json({ status: true, msg: "Login Success!" })
        } else {
            const newUser = new Users({
                name, email, password: passwordHash, avatar: picture
            })
            await newUser.save()

            const refresh_token = createRefreshToken({ id: newUser._id })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 //7days
            })
            return res.json({ status: true, msg: "Login Success!" })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, msg: err.message })
    }
}

// facebook signup\login
const facebookLogin = async (req, res) => {
    try {
        const { accessToken, userID } = req.body
        const URL = `https://graph.facebook.com/v4.0/${userID}/fields=id,name,email,picture&access_token=${accessToken}`

        // const data = await fetch(URL).then((res)=> res.json()).then((res)=> {return res})
        const data = await import('node-fetch').then(()=>fetch(URL)).then((res)=> res.json()).then((res)=> {return res})

        const { email, name, picture } = data

        const password = email + FACEBOOK_SECRET
        const passwordHash = await bcrypt.hash(password, 12)

        if (!email_verified) {
            return res.status(400).json({ status: false, msg: "Email verification failed!" })
        }

        const user = await Users.findOne({ email })

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ status: false, msg: "Password is incorrect!" })
            }
            const refresh_token = createRefreshToken({ id: user._id })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 //7days
            })
            return res.json({ status: true, msg: "Login Success!" })
        } else {
            const newUser = new Users({
                name, email, password: passwordHash, avatar: picture.data.url
            })
            await newUser.save()

            const refresh_token = createRefreshToken({ id: newUser._id })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 //7days
            })
            return res.json({ status: true, msg: "Login Success!" })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, msg: err.message })
    }
}

// functions
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return re.test(email)
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, ACTIVATION_TOKEN_SECRET, {
        expiresIn: '5m'
    })
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    })
}

module.exports = {
    register,
    activateEmail,
    setAvatar,
    login,
    getAccessToken,
    forgotPassword,
    resetPassword,
    getUserInfo,
    getAllContacts,
    logout,
    updateUser,
    googleLogin,
    facebookLogin
}