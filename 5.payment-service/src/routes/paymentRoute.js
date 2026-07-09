const express = require("express")
const authenticate = require("../middlewares/tokenBassedAuthent.js")
const authorizeRole = require("../middlewares/authorizeRole.js")
const { createPaymentOrder, verifyPayment } = require("../controllers/paymentContro.js")

const paymentRoute = express.Router()



paymentRoute.post("/create",authenticate,authorizeRole("user"),createPaymentOrder)
paymentRoute.post("/verify",authenticate,authorizeRole("user"),verifyPayment)

module.exports = paymentRoute
