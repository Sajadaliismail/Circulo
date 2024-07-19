const express =  require('express')
const validateForm = require('../middleWares/signupValidationMiddleware')
const authController = require('../controllers/userControllers/authController')
const route = express.Router()

route.post('/signup',validateForm,authController.signup)

module.exports = route