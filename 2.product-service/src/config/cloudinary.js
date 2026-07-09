const cloudinary = require("cloudinary").v2
const fs = require("fs")
const dotenv = require("dotenv")
dotenv.config()
    cloudinary.config({ 
        cloud_name:process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret:process.env.API_SECRET
    });

    const uploadFile = async (filePath) => {
        try {
            if(!filePath){
                return null
            }
            const result = await cloudinary.uploader.upload(filePath)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return {
                url: result.secure_url,
                public_id: result.public_id
            };
        } catch (error) {
            if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
            console.log(error)
        

        }

    }
module.exports = uploadFile
