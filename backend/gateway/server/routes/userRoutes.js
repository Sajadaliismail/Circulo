const express =  require('express')
const validateForm = require('../middleWares/signupValidationMiddleware')
const authController = require('../controllers/userControllers/authController')
const userController = require('../controllers/userControllers/userController')
const postsController = require('../controllers/userControllers/postsController')
const verifyToken = require('../middleWares/authenticationMiddleware')
const upload = require('../middleWares/multerMiddleware')
const route = express.Router()

route.post('/signup',validateForm,authController.signup)
route.post('/sendotp',authController.sendOtpEmail)
route.post('/verifyotp',authController.verifyOtp)
route.post('/signin',authController.signin)
route.patch('/updatepassword',authController.updatePassword)

route.post('/uploadImage',verifyToken,upload.single('image'),userController.uploadImage)
route.post('/updateaddress',verifyToken,userController.addressSetup)


route.get('/fetchuser',verifyToken,userController.fetchUser)
route.post('/addpost',verifyToken,upload.single('image'),postsController.addPost)
route.get('/fetchposts',verifyToken,postsController.fetchposts)

module.exports = route 