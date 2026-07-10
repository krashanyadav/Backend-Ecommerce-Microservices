const express = require("express")
const cookieParser = require("cookie-parser")
const dotenv =require("dotenv")
const ConnectDb = require("./config/db.js")
const authroute = require("./routes/authRoute.js")
const rateLimiter = require("./middlewares/redisRateLimit.js")




dotenv.config()

const app = express()

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

let port = process.env.PORT
//test
app.get("/",rateLimiter(1,20),(re,res)=>{
    res.send("hi iam docker")
})
//user authentication
app.use("/",authroute)

//getadmin

app.listen(port , ()=>{
    console.log("server has started at :",port)
    ConnectDb()
})