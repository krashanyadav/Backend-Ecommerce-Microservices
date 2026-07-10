const express = require("express")
const cookieParser = require("cookie-parser")
const dotenv =require("dotenv")
const ConnectDb = require("./config/db.js")
const paymentRoute = require("./routes/paymentRoute.js")
const razorpay = require("./config/razorpay.js")
dotenv.config()

const app = express()

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

let port = process.env.PORT

//.................test razorpay.................
// app.post("/test",async(req,res)=>{
//         try {

//         const order = await razorpay.orders.create({
//             amount: 100,
//             currency: "INR",
//             receipt: "test_receipt"
//         });

//         return res.json(order);

//     } catch (error) {

//         console.log(error);

//         return res.status(500).json({
//             message: error.message
//         });

//     }
// })



app.use("/",paymentRoute)

app.listen(port , ()=>{
    console.log("server has started at :",port)
    ConnectDb()
})