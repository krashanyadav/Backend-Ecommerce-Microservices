const express = require("express")
const {register,login,logOut,googleLogin, getProfile,updateProfile,deleteProfile, changePassword, forgotPassword,  verifyOtp, resetPassword} = require("../controllers/authController.js")
const authenticate = require("../middlewares/tokenBassedAuthent.js")
const upload = require("../middlewares/multer.js")
const { registerValidation, loginValidation, changePasswordValidation, forgotPasswordValidation, verifyOtpValidation, resetPasswordValidation, updateProfileValidation } = require("../middlewares/inpValidation.js")
const authorizeRole = require("../middlewares/authorizeRole.js")
const rateLimiter = require("../middlewares/redisRateLimit.js")


const router = express.Router()

router.post("/register",registerValidation,register)
router.post("/login",rateLimiter(3,30),loginValidation, login)  
router.get("/logout",logOut)

router.post("/googlelogin",googleLogin) //not working in direct postmen
                                        //becoz ppassword is required
router.patch("/changepass",rateLimiter(3,30),changePasswordValidation,authenticate,changePassword)
router.post("/forgetpass",rateLimiter(3,30),forgotPasswordValidation,forgotPassword)
router.post("/verify-otp",rateLimiter(3,30),verifyOtpValidation,verifyOtp)
router.post("/reset-pass",resetPasswordValidation,resetPassword)



router.get("/getprofile",authenticate,getProfile)  //authorization check -> authorizeRole("user")
router.put("/updateprofile",rateLimiter(3,30),updateProfileValidation,authenticate,upload.single("profileImage"),updateProfile)
router.delete("/deleteprofile",authenticate,deleteProfile)




module.exports=router
