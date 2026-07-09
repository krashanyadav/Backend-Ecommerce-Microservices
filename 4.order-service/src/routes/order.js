const express = require("express")
const authenticate = require("../middlewares/tokenBassedAuthent.js")
const authorizeRole = require("../middlewares/authorizeRole.js")
const { createOrder, getMyOrders, getSingleOrder, cancelOrder, updateOrderStatus, updatePaymentStatus } = require("../controllers/orderContoller.js")


const orderRoute = express.Router()



orderRoute.post("/create",authenticate,authorizeRole("user"),createOrder) //ye yaha se token send karega
orderRoute.get("/myorder",authenticate,authorizeRole("user"),getMyOrders)
orderRoute.get("/singOrder/:orderId",authenticate,authorizeRole("user"),getSingleOrder)
orderRoute.put("/cancel/:orderId",authenticate,authorizeRole("user"),cancelOrder) //orderstatus= cancelled use put method
orderRoute.put("/updtOdr-sts/:orderId",authenticate,authorizeRole("admin"),updateOrderStatus)
orderRoute.put("/updtPayStatus/:orderId",authenticate,authorizeRole("user"),updatePaymentStatus)


module.exports = orderRoute
