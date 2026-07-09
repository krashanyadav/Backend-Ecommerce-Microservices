const jwt = require("jsonwebtoken")

//1. user token verify
const authenticate =async (req,res,next) => {
try {
    let token = req.cookies.token
    if(!token){
        return res.status(401).json({message:"token is not found"})
    }
    // console.log(token)
    const decoded = await jwt.verify(token,process.env.JWT_SECRET)
    if(!decoded){
        return res.status(400).json({message:"aunauthorized access"})
    }
    // console.log(decoded)
    req.user =decoded
    next()

} catch (error) {
    return res.status(401).json({message:"token is not valid"})
}
}

module.exports = authenticate
