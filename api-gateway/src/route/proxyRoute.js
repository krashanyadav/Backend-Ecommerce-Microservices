const express = require("express");

const {
    authProxy,
    productProxy,
    cartProxy,
    orderProxy,
    paymentProxy
} = require("../config/proxy.js");

const app = express();

app.use("/", authProxy);

app.use("/", productProxy);

app.use("/", cartProxy);

app.use("/", orderProxy);

app.use("/", paymentProxy);

let result = process.env.GATEWAY
app.get("/",(req, res)=>{
    return res.json({message:"gateWay is :",result})
})

module.exports = app;