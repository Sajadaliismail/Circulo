const express =  require('express')
const validateForm = require('../middleWares/signupValidationMiddleware')
const authController = require('../controllers/userControllers/authController')
const route = express.Router()

route.post('/signup',validateForm,authController.signup)
route.post('/sendotp',authController.sendOtpEmail)
route.post('/verifyotp',authController.verifyOtp)
route.post('/signin',authController.signin)

module.exports = route 