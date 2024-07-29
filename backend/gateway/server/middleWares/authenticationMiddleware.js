const jwt = require('jsonwebtoken');
const { User } = require('../Database/MongoDb/userSchema');
const secret = process.env.JWT_SECRET


const verifyToken = async (req, res, next) => {

  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401);
  }
  try {
    const decoded = jwt.verify(token, secret);

    req.userId = decoded.userId;
    const userdata = await User.findById(req.userId)
    if(!userdata.isBlocked){ 
    next();
  }
  else {
    res.clearCookie("jwt");
   return res.status(402).json({ error: "User Blocked" });
  }
} catch (error) {
    return res.status(404);
  }
};

module.exports = verifyToken