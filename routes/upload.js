const uploadImage = require('../middleware/uploadImage');
const router = require('express').Router()
const { uploadAvatar } = require('../controllers/uploadCtrl')
const auth = require('../middleware/auth')

router.post('/upload_avatar', uploadImage, auth, uploadAvatar)

module.exports = router;