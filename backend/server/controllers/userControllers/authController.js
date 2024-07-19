const User = require("../../Database/MongoDb/userSchema");
const bcrypt = require('bcrypt')

const signup = async (req,res)=>{
    try {
        const {firstName,lastName,email,password,birthMonth,birthYear} = req.body
        const hashPassword = await bcrypt.hash(password,10)
        const user = new User({
            firstName,
            lastName,
            email,
            password:hashPassword,
            birthMonth,
            birthYear,
        })
        await user.save()
        return res.status(200).json({success:'Account created',email:user.email})
    } catch (error) {
        if(error.code===11000){
            return res.status(401).json({error:'Email already registered'})
        }
        return res.status(404).json({error:'Server error, Try after some time'})
    }
}


module.exports = { signup }