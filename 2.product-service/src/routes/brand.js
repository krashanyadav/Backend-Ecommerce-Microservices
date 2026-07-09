const express = require("express")
const { createBrand, getAllBrand, getSingleBrand, updateBrand, deleteBrand } = require("../controllers/brand.js")
const brandValidation = require("../middlewares/inpValidation.js")
const authenticate = require("../middlewares/tokenBassedAuthent.js")
const authorizeRole = require("../middlewares/authorizeRole.js")

const brandRoute = express.Router()


brandRoute.post("/create",authenticate,authorizeRole("admin"),brandValidation,createBrand)
brandRoute.get("/getall",getAllBrand)
brandRoute.get("/getsingle/:slug",getSingleBrand)  
brandRoute.put("/update/:id",authenticate,authorizeRole("admin"),brandValidation,updateBrand)  
brandRoute.delete("/delete/:id",authenticate,authorizeRole("admin"),deleteBrand)  

module.exports=brandRoute