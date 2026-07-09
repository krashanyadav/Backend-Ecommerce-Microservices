const express = require("express")
const { createCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory } = require("../controllers/category.js")
const categoryValidation = require("../middlewares/inpValidation.js")
const generateSlug = require("../helpers/genrateSlug.js")
const authenticate = require("../middlewares/tokenBassedAuthent.js")
const authorizeRole = require("../middlewares/authorizeRole.js")

const cateRoute = express.Router()


cateRoute.post("/create",authenticate,authorizeRole("admin"),categoryValidation,createCategory)
cateRoute.get("/getall",getAllCategory)
cateRoute.get("/getsingle/:slug",getSingleCategory)  
cateRoute.put("/update/:id",authenticate,authorizeRole("admin"),categoryValidation,updateCategory)  
cateRoute.delete("/delete/:id",authenticate,authorizeRole("admin"),deleteCategory)  

module.exports=cateRoute