const express = require("express")
const cookieParser = require("cookie-parser")
const dotenv =require("dotenv")
const ConnectDb = require("./config/db.js")
const orderRoute = require("./routes/order.js")


dotenv.config()

const app = express()

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

let port = process.env.PORT

app.use("/",orderRoute)

app.listen(port , ()=>{
    console.log("server has started at :",port)
    ConnectDb()
})