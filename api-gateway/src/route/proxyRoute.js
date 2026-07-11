const express = require("express");

const {
    authProxy,
    productProxy,
    cartProxy,
    orderProxy,
    paymentProxy
} = require("../config/proxy.js");

const app = express();

app.use("/api/auth", authProxy);

app.use("/api/product", productProxy);
app.use("/api/category", productProxy);
app.use("/api/brand", productProxy);

app.use("/api/cart", cartProxy);

app.use("/api/order", orderProxy);

app.use("/api/order-pay", paymentProxy);

let result = process.env.GATEWAY
app.get("/",(req, res)=>{
    return res.json({message:"gateWay is :",result})
})

module.exports = app;