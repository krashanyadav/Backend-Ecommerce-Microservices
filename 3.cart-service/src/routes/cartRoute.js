const express = require("express")
const { addToCart,
        getCart,
        updateQuantity,
        removeProduct,
        clearCart, 
        getCartByUserId,
        clearCartByUserId} = require("../controllers/cart.js")
const authenticate = require("../middlewares/tokenBassedAuthent.js")
const authorizeRole = require("../middlewares/authorizeRole.js")


const cartRoute = express.Router()



cartRoute.post("/addCart",authenticate,authorizeRole("user"),addToCart)
cartRoute.get("/getCart",authenticate,authorizeRole("user"),getCart)
cartRoute.put("/updateProd-qty",authenticate,authorizeRole("user"),updateQuantity)
cartRoute.delete("/rem-product/:productId",authenticate,authorizeRole("user"),removeProduct)
cartRoute.delete("/clear-cart",authenticate,authorizeRole("user"),clearCart)



module.exports=cartRoute
