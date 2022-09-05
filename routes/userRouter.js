const router = require('express').Router()
// controllers
const {
    register, activateEmail, login, getAccessToken, forgotPassword, resetPassword, getUserInfo, getAllContacts, logout, updateUser, googleLogin, facebookLogin, setAvatar
} = require('../controllers/userCtrl')
// middlewares
const auth = require('../middleware/auth')

router.post('/register', register)
router.post('/activation', activateEmail)
router.put('/setAvatar/:id', setAvatar);

router.post('/login', login)
router.post('/refresh_token', getAccessToken)
router.post('/forgot', forgotPassword)
router.post('/reset', auth, resetPassword)

router.get('/info/:id', getUserInfo)
router.get('/contacts/:id', getAllContacts)

router.get('/logout', logout)

router.patch('/update', auth, updateUser)

// social media login
router.post('/google_login', googleLogin)
router.post('/facebook_login', facebookLogin)

module.exports = router