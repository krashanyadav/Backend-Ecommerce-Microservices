const mongoose = require("mongoose")
const ConnectDb =async (userId) => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Db connected..")
    } catch (error) {
        console.log("Db connection failed")
    }
}
module.exports = ConnectDb
