const express = require("express")
const dotenv =require("dotenv")
const cookieparser = require("cookie-parser")
const ConnectDb = require("./config/db.js")
const brandRoute = require("./routes/brand.js")
const cateRoute = require("./routes/category.js")
const productRoute = require("./routes/product.js")




dotenv.config()

const app = express()

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser())

let port = process.env.PORT

app.use("/v1",cateRoute)
app.use("/v2",brandRoute)
app.use("/v3",productRoute)


app.listen(port , ()=>{
    console.log("server has started at :",port)
    ConnectDb()
})