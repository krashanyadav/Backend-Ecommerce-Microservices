const User = require("../models/authModel.js");
const dotenv = require("dotenv")
dotenv.config()

const {
    hashPassword,
    comparePassword
} = require("../helpers/bcrypt.js");

const generateToken = require("../helpers/generateToken.js");
const uploadFile = require("../config/cloudinary.js");


//1. Register User
const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        // Check Existing User
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists."
            });
        }

        // Hash Password
        const hashedPassword = await hashPassword(password);

        // Create User
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//2. Login User
const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password."
            });
        }
        //yadi admin ne user ko block kiya(true) h tab ye without permission(false) login nahi hoga
        if (user.isBlocked) {
        return res.status(403).json({
            success: false,
            message: "Your account has been blocked. Please contact support."
        });
}

        const isMatch = await comparePassword(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password."
            });
        }

        const token = generateToken(
            user._id,
            user.role
        );
       res.cookie("token",token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })

        res.status(200).json({
            success: true,
            message: "Login Successful.",
            token
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

//3.logOut
const logOut = async (req,res) => {
    try {
        res.clearCookie("token",{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite:"Strict",        
        })
        return res.status(200).json({message:"user  successfully logOut" })
    }
     catch (error) {
       return res.status(500).json({message:"Internal server error" })
    }
}
//4.googlLogin
const googleLogin = async (req,res) => {
    try {
    let {firstName,lastName,email}=req.body;
    const user = await User.findOne({email})
    if(!user){
        user = await User.create({
            firstName,lastName, email
        })

        let token = await generateToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"Strict",
            maxAge:7*24*60*60*1000
        })
            
    }
    return res.status(200).json({message:"user successfully logined",
        user
    })
    } catch (error) {
        return res.status(400).json({message:"user login failed"})
    }
}
//5.change pass
const changePassword = async (req, res) => {
    try {

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old password and new password are required"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await comparePassword(oldPassword,user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be same as old password"
            });
        }

        user.password = await hashPassword(newPassword);

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        next(error);
    }
};
//6. forget-pass (send-otp)
const sendEmail = require("../helpers/sendEmail.js");

const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate 6 Digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP & Expiry
        user.resetOtp = otp;
        user.resetOtpExpire = Date.now() +5 * 60 * 1000; // 5 Minutes

        user.otpVerified = true;
        await user.save();

        // Email Content
        const subject = "Password Reset OTP";

        const  message = `
        <h2>Password Reset OTP</h2>
        <p>Your OTP is <b>${otp}</b></p>
        <p>This OTP is valid for 5 minutes.</p> `

        await sendEmail(user.email, subject, message);

        return res.status(200).json({
            success: true,
            otp,
            message: "OTP sent successfully to your email."
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: message.error
    });
    }
};

//7.verify-otp
const verifyOtp = async (req, res) => {
    try {

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.resetOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found. Please request a new OTP."
            });
        }

        if (user.resetOtpExpire < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        if (user.resetOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
         return res.status(400).json({
            success: false,
            message: message.error
         });
    }
};

//8.reset pass
const resetPassword = async (req, res) => {
    try {

        const { email, newPassword, confirmPassword } = req.body;

        // Validation
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            });
        }

        // Find User
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // OTP Verify Check
        if (!user.otpVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify OTP first"
            });
        }

        // Hash Password
        const hashedPassword = await hashPassword(newPassword);

        // Update Password
        user.password = hashedPassword;

        // Clear OTP Data
        user.resetOtp = null;
        user.resetOtpExpire = null;
        user.otpVerified = false;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
         return res.status(400).json({
            success: false,
            message: message.error
        });
    }
};

// 9.Get Profile
const getProfile = async (req, res) => {

    try {
        //form token middleware
        const user = await User.findById(req.user.id)
            .select("-password");
        // console.log(req.userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


//10 Update Profile
const updateProfile = async (req, res) => {
    try {
        const {firstName,lastName}=req.body;

        //  console.log(lastName)
        // console.log(req.file)
        const updatedUser = await User.findById(req.user.id).select("-password");
        if(!updatedUser){
            return res.status(404).json({
                success: false,
                message: error.message
            })
        }
        //  console.log(updatedUser)
        //  console.log(req.body)
        // console.log(req.file)

        if(req.file){
            updatedUser.profileImage =await uploadFile(req.file.path)
        }


        if(req.body?.firstName) updatedUser.firstName = firstName
        if(req.body?.lastName) updatedUser.lastName = lastName
           await updatedUser.save()

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: updatedUser
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

//11 Delete Profile
const deleteProfile = async (req, res) => {
    try {

        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({
            success: true,
            message: "Account deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    register,
    login,
    logOut,
    googleLogin,
    changePassword,
    forgotPassword,
    verifyOtp,
    resetPassword,
    getProfile,
    updateProfile,
    deleteProfile
};