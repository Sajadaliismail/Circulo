const  {validationSchema}  = require("../services/signupValidationCheck");

 const validateForm = async (req,res,next) => {
     try {
        await validationSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (err) {
        const errors = {}
       err.inner.forEach((e)=>{
        errors[e.path] = e.errors[0]
       })
      return res.status(400).json(
        errors
        );
    }
 }
module.exports = validateForm